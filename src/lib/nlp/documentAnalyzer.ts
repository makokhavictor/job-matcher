/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// DocumentAnalyzer.ts
import * as tf from '@tensorflow/tfjs'; // Node-specific import
import * as use from '@tensorflow-models/universal-sentence-encoder';
import nlp from 'compromise';

type NlpDocument = ReturnType<typeof nlp>;

export type AnalysisResult = {
  score: number;
  matches: {
    skills: string[];
    experience: string[];
    education: string[];
    keywords: string[];
  };
  missing: {
    skills: string[];
    requirements: string[];
    experience?: string[];
  };
  suggestions: string[];
};

export class DocumentAnalyzer {
  private model: any;
  private similarityThreshold = 0.75;
  private minKeywordScore = 0.65;
  private isModelReady = false;

  constructor() {
    this.initializeModel().catch(console.error);
  }

  private async initializeModel() {
    try {
      // Load model with local cache configuration
      this.model = await use.load();
      
      this.isModelReady = true;
    } catch (error) {
      console.error('Failed to initialize TensorFlow model:', error);
      throw error;
    }
  }

  async analyze(cvText: string, jobText: string): Promise<AnalysisResult> {
    if (!this.isModelReady) {
      await this.initializeModel();
    }

    try {
      const [cvDoc, jobDoc] = [nlp(cvText), nlp(jobText)];
      
      // Process documents in parallel
      const [cvChunks, jobChunks] = await Promise.all([
        this.processDocumentChunks(cvText),
        this.processDocumentChunks(jobText)
      ]);

      // Extract embeddings in batches to avoid memory issues
      const [skillMatches, experienceMatches] = await Promise.all([
        this.matchSemanticEntities(cvChunks.skills, jobChunks.skills),
        this.matchSemanticEntities(cvChunks.experience, jobChunks.requirements)
      ]);

      // Calculate score and suggestions
      const score = this.calculateDynamicScore(
        skillMatches,
        experienceMatches,
        cvChunks,
        jobChunks
      );

      const suggestions = this.generateSuggestions(
        skillMatches.missing,
        experienceMatches.missing,
        cvChunks,
        jobChunks
      );

      // Explicit memory cleanup
      tf.engine().startScope();
      const cvEmbeddings = await this.getDocumentEmbeddings(cvText);
      const jobEmbeddings = await this.getDocumentEmbeddings(jobText);
      const keywords = await this.extractKeywordMatches(cvEmbeddings, jobEmbeddings);
      tf.engine().endScope();

      return {
        score,
        matches: {
          skills: skillMatches.matched,
          experience: experienceMatches.matched,
          education: cvChunks.education,
          keywords
        },
        missing: {
          skills: skillMatches.missing,
          requirements: experienceMatches.missing
        },
        suggestions
      };
    } catch (error) {
      console.error('Analysis failed:', error);
      throw error;
    }
  }

  private async getDocumentEmbeddings(text: string): Promise<tf.Tensor> {
    const sentences = text.split(/[.!?]/)
      .filter(s => s.trim().length > 0)
      .slice(0, 50); // Limit to 50 sentences for performance
    
    return this.model.embed(sentences);
  }

  private async processDocumentChunks(text: string) {
    const doc = nlp(text);
    return {
      skills: this.extractPotentialSkills(doc),
      experience: this.extractExperiencePhrases(doc),
      education: this.extractEducation(doc),
      requirements: this.extractRequirementPhrases(doc)
    };
  }

  private extractPotentialSkills(doc: NlpDocument): string[] {
    const skillPhrases = [
      ...doc.match('#Noun+').out('array'),
      ...doc.nouns().out('array'),
      ...doc.match('(experienced|proficient|skilled) in? #Noun+').out('array'),
      ...doc.match('#Adjective #Noun').out('array') // Catch phrases like "machine learning"
    ];

    return [...new Set(skillPhrases)]
      .map(s => s.toLowerCase())
      .filter(s => s.length > 2); // Filter out very short phrases
  }

  private async matchSemanticEntities(
    source: string[],
    target: string[]
  ): Promise<{ matched: string[]; missing: string[] }> {
    if (target.length === 0) return { matched: [], missing: [] };
    if (source.length === 0) return { matched: [], missing: target };

    try {
      tf.engine().startScope();
      
      const embeddings = await Promise.all([
        this.model.embed(source.slice(0, 100)), // Limit to 100 items per batch
        this.model.embed(target.slice(0, 100))
      ]);

      const similarityMatrix = tf.matMul(
        embeddings[0],
        embeddings[1],
        false,
        true
      );

      const similarities = similarityMatrix.arraySync() as number[][];
      const matched = new Set<string>();
      const missing = new Set(target);

      similarities.forEach((row, i) => {
        const maxScore = Math.max(...row);
        if (maxScore >= this.similarityThreshold) {
          const matchIndex = row.indexOf(maxScore);
          matched.add(source[i]);
          missing.delete(target[matchIndex]);
        }
      });

      return {
        matched: Array.from(matched),
        missing: Array.from(missing)
      };
    } finally {
      tf.engine().endScope();
    }
  }

  // Enhanced scoring with normalization
  private calculateDynamicScore(
    skillMatches: { matched: string[]; missing: string[] },
    experienceMatches: { matched: string[]; missing: string[] },
    jobChunks: any,
    cvChunks: any,
  ): number {
    const totalSkills = skillMatches.matched.length + skillMatches.missing.length;
    const skillScore = totalSkills > 0 
      ? skillMatches.matched.length / totalSkills 
      : 0;

    const totalRequirements = experienceMatches.matched.length + experienceMatches.missing.length;
    const expScore = totalRequirements > 0
      ? experienceMatches.matched.length / totalRequirements
      : 0;

    const eduScore = cvChunks.education.length > 0 ? 1 : 0;

    // Normalized weighted score
    return Math.min(100, Math.round(
      (skillScore * 0.6 + expScore * 0.3 + eduScore * 0.1) * 100
    ));
  }

  private async extractKeywordMatches(
    cvEmbeddings: tf.Tensor,
    jobEmbeddings: tf.Tensor
  ): Promise<string[]> {
    try {
      tf.engine().startScope();
      
      const similarityMatrix = tf.matMul(cvEmbeddings, jobEmbeddings, false, true);
      const similarities = similarityMatrix.arraySync() as number[][];
      
      const keywordPairs = similarities
        .flatMap((row, i) => 
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          row.map((score, j) => ({ score, term: i }))
        )
        .filter(item => item.score >= this.minKeywordScore)
        .sort((a, b) => b.score - a.score);

      return keywordPairs
        .slice(0, 20)
        .map(pair => pair.term.toString());
    } finally {
      tf.engine().endScope();
    }
  }

  private extractExperiencePhrases(doc: NlpDocument): string[] {
    const experiences = new Set<string>();
    
    // Extract duration phrases
    const durationPatterns = [
      '#Value+ years? (of )?(experience|development)',
      'worked for #Value+ years?',
      '#Value+ years? as? #Noun+'
    ];
    
    durationPatterns.forEach(pattern => {
      doc.match(pattern).out('array')
        .forEach((exp: string) => experiences.add(exp));
    });

    // Extract position phrases
    doc.match('(#Noun|#Adjective)+ (developer|engineer|specialist)')
      .out('array')
      .forEach((exp: string) => experiences.add(exp));

    return Array.from(experiences);
  }

  private extractEducation(doc: NlpDocument): string[] {
    return doc.match('(Bachelor|Master|PhD|Doctorate) of? in? #Noun+')
      .out('array');
  }

  private extractRequirementPhrases(doc: NlpDocument): string[] {
    const requirements = new Set<string>();
    
    // Extract from requirement sentences
    doc.sentences().forEach(sentence => {
      if (/(required|must have|should have)/i.test(sentence.text())) {
        sentence.match('#Noun+').out('array')
          .forEach((phrase: string) => requirements.add(phrase));
      }
    });

    return Array.from(requirements);
  }

  private generateSuggestions(
    missingSkills: string[],
    missingExperience: string[],
    cvChunks: any,
    jobChunks: any
  ): string[] {
    const suggestions: string[] = [];
    
    // Skill-related suggestions
    if (missingSkills.length > 0) {
      const topMissing = missingSkills.slice(0, 3);
      suggestions.push(
        `Highlight transferable skills related to: ${topMissing.join(', ')}. ` +
        `Consider similar technologies you've worked with.`
      );
    }

    // Experience-related suggestions
    if (missingExperience.length > 0) {
      suggestions.push(
        `Reframe existing experience to better match: ` +
        `${missingExperience.slice(0, 2).join(' and ')}`
      );
    }

    // General improvements
    suggestions.push(
      'Use metrics to quantify achievements (e.g., "Improved performance by 30%")',
      'Include specific technologies from the job description where applicable',
      'Match the job description\'s terminology for key skills'
    );

    return suggestions;
  }
}