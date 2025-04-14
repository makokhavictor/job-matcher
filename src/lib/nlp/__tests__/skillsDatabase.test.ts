import { findSkill, findRelatedSkills, getSkillsByCategory, normalizeSkillName } from '../skillsDatabase';

describe('Skills Database', () => {
  describe('findSkill', () => {
    it('should find a skill by exact name', () => {
      const skill = findSkill('JavaScript');
      expect(skill?.name).toBe('JavaScript');
      expect(skill?.category).toBe('language');
    });

    it('should find a skill by alias', () => {
      const skill = findSkill('js');
      expect(skill?.name).toBe('JavaScript');
    });

    it('should return undefined for unknown skills', () => {
      const skill = findSkill('UnknownTechnology');
      expect(skill).toBeUndefined();
    });
  });

  describe('findRelatedSkills', () => {
    it('should find related skills for JavaScript', () => {
      const relatedSkills = findRelatedSkills('JavaScript');
      expect(relatedSkills).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: 'TypeScript' }),
          expect.objectContaining({ name: 'React' })
        ])
      );
    });

    it('should return empty array for unknown skill', () => {
      const relatedSkills = findRelatedSkills('UnknownTechnology');
      expect(relatedSkills).toEqual([]);
    });
  });

  describe('getSkillsByCategory', () => {
    it('should return all skills in a category', () => {
      const languageSkills = getSkillsByCategory('language');
      expect(languageSkills.length).toBeGreaterThan(0);
      expect(languageSkills.every(skill => skill.category === 'language')).toBe(true);
    });
  });

  describe('normalizeSkillName', () => {
    it('should normalize known skill aliases', () => {
      expect(normalizeSkillName('js')).toBe('JavaScript');
      expect(normalizeSkillName('typescript')).toBe('TypeScript');
    });

    it('should return original text for unknown skills', () => {
      expect(normalizeSkillName('UnknownTechnology')).toBe('UnknownTechnology');
    });
  });
});