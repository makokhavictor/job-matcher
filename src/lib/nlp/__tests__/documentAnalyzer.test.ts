import { DocumentAnalyzer } from '../documentAnalyzer';

describe('DocumentAnalyzer', () => {
  let analyzer: DocumentAnalyzer;

  beforeEach(() => {
    analyzer = new DocumentAnalyzer();
  });

  describe('analyze', () => {
    it('should match skills between CV and job description', async () => {
      const cv = `
        Senior Software Engineer with 7+ years of experience
        Expert in React, TypeScript, and Node.js
        Led development of multiple web applications
        Bachelor's in Computer Science
        Implemented CI/CD pipelines using Docker and AWS
      `;

      const jobDescription = `
        Required Skills:
        - 5+ years of experience in web development
        - Strong proficiency in React and TypeScript
        - Experience with Node.js and AWS
        - Bachelor's degree in Computer Science or related field
        - Docker and containerization experience
      `;

      const result = await analyzer.analyze(cv, jobDescription);

      expect(result.score).toBeGreaterThan(80);
      expect(result.matches.skills).toContain('React');
      expect(result.matches.skills).toContain('TypeScript');
      expect(result.matches.skills).toContain('Node.js');
      expect(result.matches.education).toHaveLength(1);
      expect(result.missing.skills).toHaveLength(0);
    });

    it('should identify missing skills and requirements', async () => {
      const cv = `
        Junior Developer
        1 year experience with JavaScript and React
        Building web applications
        Bachelor's in Mathematics
      `;

      const jobDescription = `
        Senior Frontend Developer
        Requirements:
        - 5+ years of experience
        - Expert in React, TypeScript, and Angular
        - Experience with GraphQL and REST APIs
        - Team leadership experience
      `;

      const result = await analyzer.analyze(cv, jobDescription);

      expect(result.score).toBeLessThan(70);
      expect(result.missing.skills).toContain('TypeScript');
      expect(result.missing.skills).toContain('Angular');
      expect(result.suggestions).toHaveLength(3);
    });

    it('should handle related skills and aliases', async () => {
      const cv = `
        Full Stack Developer
        Experienced in JS, React.js, and Express
        Working with MongoDB databases
      `;

      const jobDescription = `
        Looking for:
        - JavaScript developer
        - React experience
        - Node.js backend skills
        - NoSQL database experience
      `;

      const result = await analyzer.analyze(cv, jobDescription);

      expect(result.matches.skills).toContain('JavaScript');
      expect(result.matches.skills).toContain('React');
      expect(result.matches.skills).toContain('MongoDB');
    });

    it('should extract and match experience requirements', async () => {
      const cv = `
        Software Engineer with 8 years of experience
        Tech lead for 3 years
        Managing team of 5 developers
      `;

      const jobDescription = `
        Senior Position requiring:
        - 5+ years of software development
        - 2+ years in team leadership
        - Experience managing development teams
      `;

      const result = await analyzer.analyze(cv, jobDescription);

      expect(result.matches.experience).toHaveLength(2);
      expect(result.score).toBeGreaterThan(85);
    });
  });
});