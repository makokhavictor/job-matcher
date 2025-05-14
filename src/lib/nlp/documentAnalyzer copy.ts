// DocumentAnalyzer.ts
import nlp from 'compromise';
import {
  findSkill,
  findRelatedSkills,
  skillsDatabase
} from './skillsDatabase';

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
  async analyze(cvText: string, jobText: string): Promise<AnalysisResult> {
    const cvDoc = nlp(cvText);
    const jobDoc = nlp(jobText);

    const cvSkills = await this.extractSkills(cvDoc);
    const jobSkills = await this.extractSkills(jobDoc);

    const cvExperience = this.extractExperience(cvDoc);
    const cvEducation = this.extractEducation(cvDoc);
    const jobRequirements = this.extractRequirements(jobDoc);

    const extractedKeywords = this.extractKeywords(cvDoc, jobDoc);

    const matchedSkills = cvSkills.filter(s =>
      jobSkills.some(js => this.isMatch(s, js))
    );
    const missingSkills = jobSkills.filter(s =>
      !cvSkills.some(cs => this.isMatch(cs, s))
    );

    const score = this.calculateScore({
      matchedSkills,
      jobSkills,
      cvExperience,
      jobRequirements
    });

    const suggestions = this.generateSuggestions({
      missingSkills,
      jobRequirements,
      cvExperience,
      cvEducation
    });

    return {
      score,
      matches: {
        skills: matchedSkills,
        experience: cvExperience.filter(exp =>
          jobRequirements.some(req => this.isExperienceMatch(exp, req))
        ),
        education: cvEducation,
        keywords: extractedKeywords,
      },
      missing: {
        skills: missingSkills,
        requirements: jobRequirements.filter(req =>
          !cvExperience.some(exp => this.isExperienceMatch(exp, req))
        ),
      },
      suggestions,
    };
  }

  private async extractSkills(doc: NlpDocument): Promise<string[]> {
    const candidates = new Set<string>();

    // 1) Multi‑word noun phrases: 1+ consecutive nouns
    doc.match('#Noun+').out('array')
      .forEach((p: string) => candidates.add(p.toLowerCase()));

    // 2) Single nouns
    doc.nouns().out('array')
      .forEach((n: string) => candidates.add(n.toLowerCase()));

    // 3) Fallback: look for any exact skill name or alias in text
    const found = new Set<string>();
    candidates.forEach(phrase => {
      const skill = findSkill(phrase);
      if (skill) {
        found.add(skill.name);
        // add related if mentioned
        findRelatedSkills(skill.name)
          .filter(r => doc.has(r.name))
          .forEach(r => found.add(r.name));
      }
    });

    // 4) If nothing found yet, scan full DB
    if (found.size === 0) {
      skillsDatabase.forEach(skill => {
        if (doc.has(skill.name) ||
            skill.aliases.some(a => doc.has(a))) {
          found.add(skill.name);
        }
      });
    }

    return Array.from(found);
  }

  private extractExperience(doc: NlpDocument): string[] {
    const exps = new Set<string>();
    
    // Filter out percentage patterns first
    const percentageFiltered = doc.text().replace(/\d+(\.\d+)?%/g, '');
    const cleanedDoc = nlp(percentageFiltered);

    // Match more specific year patterns
    const yearPatterns = [
      // e.g. "3 years experience", "5+ years of experience"
      '#Value+ years? (of )?(professional |work )?experience',
      // e.g. "worked for 5 years"
      '(worked|working) for #Value+ years?',
      // e.g. "5 years as Senior Developer"
      '#Value+ years? as? #Noun+',
    ];

    yearPatterns.forEach(pattern => {
      cleanedDoc.match(pattern).out('array')
        .forEach((txt: string) => {
          // Validate the year value is reasonable (1-20 years)
          const years = this.extractYears(txt);
          if (years !== null && years > 0 && years <= 20) {
            exps.add(txt);
          }
        });
    });

    // e.g. "Senior Developer (2018-2022)", "2019 - Present"
    const dateRanges = cleanedDoc.match('(#Year|present|current) ?(-|to|–) ?(#Year|present|current)')
      .out('array')
      .filter((txt: string) => {
        const years = this.calculateYearsFromRange(txt);
        return years !== null && years > 0 && years <= 20;
      });
    (dateRanges as string[]).forEach((range: string) => exps.add(range));

    return Array.from(exps);
  }

  private calculateYearsFromRange(text: string): number | null {
    const normalized = text.toLowerCase().replace(/–/g, '-');
    const parts = normalized.split(/[-to]+/).map(p => p.trim());
    
    if (parts.length !== 2) return null;
    
    const endYear = parts[1] === 'present' || parts[1] === 'current' 
      ? new Date().getFullYear()
      : parseInt(parts[1], 10);
    const startYear = parseInt(parts[0], 10);
    
    if (isNaN(startYear) || isNaN(endYear)) return null;
    if (startYear < 1950 || startYear > endYear) return null;
    
    return endYear - startYear;
  }

  private extractEducation(doc: NlpDocument): string[] {
    const edus = new Set<string>();

    // e.g. "Bachelor of Science", "PhD in Physics"
    doc.match('(Bachelor|Master|PhD|Doctorate) of? in? #Noun+')
      .out('array')
      .forEach((txt: string) => edus.add(txt));

    return Array.from(edus);
  }

  private extractRequirements(doc: NlpDocument): string[] {
    const reqs = new Set<string>();

    doc.sentences().out('array').forEach((sentText: string) => {
      if (/requirement|must have|proficiency/i.test(sentText)) {
        const sent = nlp(sentText);
        sent.match('#Noun+').out('array')
          .forEach((p: string) => reqs.add(p));
      }
    });

    return Array.from(reqs);
  }

  private extractKeywords(
    cvDoc: NlpDocument,
    jobDoc: NlpDocument
  ): string[] {
    const cvTerms = new Set<string>(cvDoc.match('#Noun|#Adjective').out('array') as string[]);
    const jobTerms = new Set<string>(jobDoc.match('#Noun|#Adjective').out('array') as string[]);

    return Array.from(cvTerms)
      .filter((t: string) => jobTerms.has(t))
      .slice(0, 20);
  }

  // --- Matching & scoring (unchanged) ---

  private isMatch(str1: string, str2: string): boolean {
    const n1 = normalizeSkillName(str1);
    const n2 = normalizeSkillName(str2);
    if (n1 === n2) return true;
    const s1 = findSkill(n1), s2 = findSkill(n2);
    if (s1 && s2) {
      if (s1.name === s2.name) return true;
      if (s1.aliases.includes(n2) || s2.aliases.includes(n1)) return true;
    }
    return false;
  }

  private isExperienceMatch(exp: string, req: string): boolean {
    exp = exp.toLowerCase();
    req = req.toLowerCase();
    
    const eY = this.extractYears(exp);
    const rY = this.extractYears(req);
    
    // Stricter year matching - CV years should be at least 90% of required
    if (eY && rY) {
      if (eY < rY * 0.9) return false;
    }
    
    // Split into words and remove common words
    const commonWords = new Set(['and', 'or', 'the', 'in', 'with', 'years', 'year', 'of', 'experience', 
      'for', 'as', 'to', 'present', 'current', '-', 'professional', 'work']);
    const eW = exp.split(/\W+/).filter(w => !commonWords.has(w) && w.length > 2);
    const rW = req.split(/\W+/).filter(w => !commonWords.has(w) && w.length > 2);
    
    // More strict word matching - require at least 50% of words to match
    const minMatchCount = Math.max(1, Math.ceil(rW.length * 0.5));
    const matchCount = rW.filter(rWord => 
      eW.some(eWord => this.areWordsRelated(eWord, rWord))
    ).length;
    
    return matchCount >= minMatchCount;
  }

  private areWordsRelated(word1: string, word2: string): boolean {
    // Exact match
    if (word1 === word2) return true;
    
    // One word contains the other
    if (word1.includes(word2) || word2.includes(word1)) return true;
    
    // Levenshtein distance for similar words (handle typos)
    if (word1.length > 3 && word2.length > 3) {
      const maxDist = Math.floor(Math.min(word1.length, word2.length) * 0.3); // Allow 30% difference
      if (this.levenshteinDistance(word1, word2) <= maxDist) return true;
    }
    
    return false;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const m = str1.length, n = str2.length;
    const dp: number[][] = Array.from({length: m + 1}, () => Array(n + 1).fill(0));
    
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = str1[i-1] === str2[j-1] 
          ? dp[i-1][j-1]
          : Math.min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1]) + 1;
      }
    }
    
    return dp[m][n];
  }

  private extractYears(text: string): number | null {
    // Ignore percentages
    if (text.includes('%')) return null;
    // Patterns for years of experience
    const patterns = [
      /(\d+)(?:\+)?\s*years?(?:\s+(?:of\s+)?(?:professional\s+|work\s+)?experience)?/i,
      /(?:worked|working)\s+for\s+(\d+)(?:\+)?\s*years?/i,
      /(\d+)(?:\+)?\s*yrs?/i,
    ];
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const years = parseInt(match[1], 10);
        if (!isNaN(years)) return years;
      }
    }
    // Try to extract from date ranges (e.g. 2018-2022)
    const range = text.match(/(\d{4})\s*[-to–]+\s*(\d{4}|present|current)/i);
    if (range) {
      const start = parseInt(range[1], 10);
      const end = (range[2] === 'present' || range[2] === 'current') ? new Date().getFullYear() : parseInt(range[2], 10);
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        return end - start;
      }
    }
    return null;
  }

  private calculateScore(args: {
    matchedSkills: string[];
    jobSkills: string[];
    cvExperience: string[];
    jobRequirements: string[];
  }): number {
    const { matchedSkills, jobSkills, cvExperience, jobRequirements } = args;
    // Skill score: ratio of matched to required
    const skillScore = jobSkills.length > 0 ? matchedSkills.length / jobSkills.length : 1;
    // Experience score: ratio of matched experience requirements
    let expMatches = 0;
    for (const req of jobRequirements) {
      if (cvExperience.some(exp => this.isExperienceMatch(exp, req))) expMatches++;
    }
    const expScore = jobRequirements.length > 0 ? expMatches / jobRequirements.length : 1;
    // Final score: weighted sum (skills 60%, experience 40%)
    const score = (skillScore * 0.6 + expScore * 0.4) * 100;
    return Math.round(score);
  }

  private generateSuggestions(args: {
    missingSkills: string[];
    jobRequirements: string[];
    cvExperience: string[];
    cvEducation: string[];
  }): string[] {
    const { missingSkills, jobRequirements, cvExperience, cvEducation } = args;
    const suggestions: string[] = [];

    if (missingSkills.length) {
      suggestions.push(`Consider adding experience with: ${missingSkills.join(', ')}`);
    }
    const missingReqs = jobRequirements.filter(r =>
      !cvExperience.some(e => this.isExperienceMatch(e, r))
    );
    if (missingReqs.length) {
      suggestions.push(`Highlight experience matching: ${missingReqs.join(', ')}`);
    }
    if (!cvEducation.length) {
      suggestions.push('Add your educational background to strengthen your profile');
    }
    suggestions.push(
      'Quantify your achievements with metrics where possible',
      'Use action verbs to describe your experience',
      'Ensure your CV is tailored to the specific role'
    );
    return suggestions;
  }
}

// Simple normalize
function normalizeSkillName(s: string): string {
  return s.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
