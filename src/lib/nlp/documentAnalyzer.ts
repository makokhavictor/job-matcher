import { findSkill, findRelatedSkills, skillsDatabase } from './skillsDatabase';

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
  constructor() {
    // No need for NlpManager initialization
  }

  async analyze(cvText: string, jobDescriptionText: string): Promise<AnalysisResult> {
    // Extract skills and keywords from both documents
    const cvSkills = await this.extractSkills(cvText);
    const jobSkills = await this.extractSkills(jobDescriptionText);
    
    // Extract experience and education from CV
    const cvExperience = await this.extractExperience(cvText);
    const cvEducation = await this.extractEducation(cvText);
    
    // Extract requirements from job description
    const jobRequirements = await this.extractRequirements(jobDescriptionText);
    
    // Find matches and missing items
    const matchedSkills = cvSkills.filter(skill => 
      jobSkills.some(jobSkill => this.isMatch(skill, jobSkill))
    );
    
    const missingSkills = jobSkills.filter(skill =>
      !cvSkills.some(cvSkill => this.isMatch(cvSkill, skill))
    );

    const extractedKeywords = await this.extractKeywords(cvText, jobDescriptionText);
    
    // Calculate match score
    const score = this.calculateScore({
      matchedSkills,
      missingSkills,
      jobSkills,
      cvExperience,
      jobRequirements
    });

    // Generate suggestions
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

  private async extractSkills(text: string): Promise<string[]> {
    const foundSkills = new Set<string>();
    const words = text.toLowerCase().match(/\b\w+(?:\s+\w+){0,2}\b/g) || [];
    
    // Check for single words and phrases up to 3 words long
    for (const phrase of words) {
      const skill = findSkill(phrase);
      if (skill) {
        foundSkills.add(skill.name);
        
        // Add related skills with a lower confidence
        const relatedSkills = findRelatedSkills(skill.name);
        for (const related of relatedSkills) {
          if (text.toLowerCase().includes(related.name.toLowerCase())) {
            foundSkills.add(related.name);
          }
        }
      }
    }

    // Look for known skills and their aliases
    for (const skill of skillsDatabase) {
      if (text.toLowerCase().includes(skill.name.toLowerCase())) {
        foundSkills.add(skill.name);
      }
      for (const alias of skill.aliases) {
        if (text.toLowerCase().includes(alias.toLowerCase())) {
          foundSkills.add(skill.name);
          break;
        }
      }
    }

    return Array.from(foundSkills);
  }

  private async extractExperience(text: string): Promise<string[]> {
    const experiencePatterns = [
      /(\d+)\s*(?:\+\s*)?years?\s+(?:of\s+)?experience/gi,
      /(?:worked|working)\s+(?:as|with|in|at)\s+([^.,]+)/gi,
      /(?:senior|lead|principal)\s+([^.,]+)/gi,
    ];

    const experiences = new Set<string>();
    
    for (const pattern of experiencePatterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match[0]) {
          experiences.add(match[0].trim());
        }
      }
    }

    return Array.from(experiences);
  }

  private async extractEducation(text: string): Promise<string[]> {
    const educationPatterns = [
      /(?:bachelor'?s?|master'?s?|ph\.?d\.?|doctorate|degree)\s+(?:of|in)?\s+([^.,]+)/gi,
      /(?:b\.?s\.?|m\.?s\.?|b\.?a\.?|m\.?a\.?)\s+(?:in)?\s+([^.,]+)/gi,
    ];

    const education = new Set<string>();
    
    for (const pattern of educationPatterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match[0]) {
          education.add(match[0].trim());
        }
      }
    }

    return Array.from(education);
  }

  private async extractRequirements(text: string): Promise<string[]> {
    const requirementPatterns = [
      /(?:required|requirements?|qualifications?|must\s+have):\s*([^.]+)/gi,
      /(\d+)\s*(?:\+\s*)?years?\s+(?:of\s+)?experience\s+(?:in|with)\s+([^.,]+)/gi,
      /proficiency\s+in\s+([^.,]+)/gi,
    ];

    const requirements = new Set<string>();
    
    for (const pattern of requirementPatterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match[0]) {
          requirements.add(match[0].trim());
        }
      }
    }

    return Array.from(requirements);
  }

  private async extractKeywords(cvText: string, jobText: string): Promise<string[]> {
    const commonWords = new Set([
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
      'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    ]);

    const words1 = new Set(cvText.toLowerCase().match(/\b\w+\b/g) || []);
    const words2 = new Set(jobText.toLowerCase().match(/\b\w+\b/g) || []);
    
    return Array.from(new Set([...words1].filter(word => 
      words2.has(word) && !commonWords.has(word)
    ))).slice(0, 20); // Limit to top 20 keywords
  }

  private isMatch(str1: string, str2: string): boolean {
    // Normalize skill names first
    const normalized1 = normalizeSkillName(str1);
    const normalized2 = normalizeSkillName(str2);
    if (normalized1 === normalized2) return true;
    const skill1 = findSkill(normalized1);
    const skill2 = findSkill(normalized2);
    // Only match if exact or strong alias/synonym
    if (skill1 && skill2) {
      if (skill1.name === skill2.name) return true;
      if (skill1.aliases.includes(normalized2) || skill2.aliases.includes(normalized1)) return true;
      // Related skills are not considered a match for strictness
    }
    // No substring fallback for strictness
    return false;
  }

  private isExperienceMatch(experience: string, requirement: string): boolean {
    const normalizedExp = experience.toLowerCase();
    const normalizedReq = requirement.toLowerCase();
    // Extract years from both strings
    const expYears = this.extractYears(normalizedExp);
    const reqYears = this.extractYears(normalizedReq);
    // Require both years and domain/role match
    if (expYears && reqYears) {
      if (expYears < reqYears) return false;
      // Check for domain/role overlap (must match a skill or keyword)
      const expWords = normalizedExp.split(/\W+/);
      const reqWords = normalizedReq.split(/\W+/);
      const overlap = reqWords.some(word => word.length > 2 && expWords.includes(word));
      return overlap;
    }
    // Otherwise, do not match
    return false;
  }

  private extractYears(text: string): number | null {
    const match = text.match(/(\d+)(?:\+)?\s*years?/);
    return match ? parseInt(match[1], 10) : null;
  }

  private calculateScore(data: {
    matchedSkills: string[];
    missingSkills: string[];
    jobSkills: string[];
    cvExperience: string[];
    jobRequirements: string[];
  }): number {
    const weights = {
      skills: 0.5,
      experience: 0.5,
    };
    const skillsScore = data.jobSkills.length > 0
      ? (data.matchedSkills.length / data.jobSkills.length) * 100
      : 0;
    // Only count experience if both years and domain/role match
    const matchedExperience = data.cvExperience.filter(exp =>
      data.jobRequirements.some(req => this.isExperienceMatch(exp, req))
    );
    const experienceScore = data.jobRequirements.length > 0
      ? (matchedExperience.length / data.jobRequirements.length) * 100
      : 0;
    // Penalize missing requirements more heavily
    const penalty = data.missingSkills.length * 10 + (data.jobRequirements.length - matchedExperience.length) * 10;
    const cappedSkillsScore = Math.max(Math.min(skillsScore, 100), 0);
    const cappedExperienceScore = Math.max(Math.min(experienceScore, 100), 0);
    let rawScore = cappedSkillsScore * weights.skills + cappedExperienceScore * weights.experience - penalty;
    rawScore = Math.max(Math.min(rawScore, 100), 0);
    return Math.round(rawScore);
  }

  private generateSuggestions({
    missingSkills,
    jobRequirements,
    cvExperience,
    cvEducation,
  }: {
    missingSkills: string[];
    jobRequirements: string[];
    cvExperience: string[];
    cvEducation: string[];
  }): string[] {
    const suggestions: string[] = [];

    // Suggest missing skills
    if (missingSkills.length > 0) {
      suggestions.push(
        `Consider adding experience with: ${missingSkills.join(', ')}`
      );
    }

    // Suggest missing requirements
    const missingReqs = jobRequirements.filter(req =>
      !cvExperience.some(exp => this.isExperienceMatch(exp, req))
    );
    if (missingReqs.length > 0) {
      suggestions.push(
        `Try to highlight experience that matches: ${missingReqs.join(', ')}`
      );
    }

    // Education suggestions
    if (cvEducation.length === 0) {
      suggestions.push(
        'Add your educational background to strengthen your profile'
      );
    }

    // Add general improvement suggestions
    suggestions.push(
      'Quantify your achievements with metrics where possible',
      'Use action verbs to describe your experience',
      'Ensure your CV is tailored to the specific role'
    );

    return suggestions;
  }
}
function normalizeSkillName(skillName: string): string {
  return skillName
    .toLowerCase()
    .trim()
    // Remove common prefixes
    .replace(/^(senior|junior|lead)\s+/, '')
    // Remove special characters and extra spaces
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    // Remove common suffixes
    .replace(/\s+(developer|engineer|specialist)$/g, '')
    // Normalize common variations
    .replace(/javascript/gi, 'javascript')
    .replace(/typescript/gi, 'typescript')
    .replace(/react\.?js/gi, 'react')
    .replace(/node\.?js/gi, 'nodejs')
    .trim();
}
