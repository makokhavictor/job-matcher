export type SkillCategory = 'technical' | 'soft' | 'domain' | 'tool' | 'language' | 'framework';

export interface Skill {
  name: string;
  category: SkillCategory;
  aliases: string[];
  related?: string[];
}

export const skillsDatabase: Skill[] = [
  // Programming Languages
  {
    name: 'JavaScript',
    category: 'language',
    aliases: ['js', 'javascript', 'ecmascript'],
    related: ['TypeScript', 'Node.js', 'React', 'Vue.js', 'Angular']
  },
  {
    name: 'TypeScript',
    category: 'language',
    aliases: ['ts', 'typescript'],
    related: ['JavaScript', 'Node.js', 'Angular']
  },
  {
    name: 'Python',
    category: 'language',
    aliases: ['py', 'python3', 'python2'],
    related: ['Django', 'Flask', 'FastAPI', 'NumPy', 'Pandas']
  },
  
  // Frameworks
  {
    name: 'React',
    category: 'framework',
    aliases: ['reactjs', 'react.js', 'react native'],
    related: ['JavaScript', 'TypeScript', 'Redux', 'Next.js']
  },
  {
    name: 'Angular',
    category: 'framework',
    aliases: ['angularjs', 'angular2+', 'ng'],
    related: ['TypeScript', 'RxJS', 'JavaScript']
  },
  {
    name: 'Vue.js',
    category: 'framework',
    aliases: ['vue', 'vuejs', 'vue3'],
    related: ['JavaScript', 'Vuex', 'Nuxt.js']
  },
  
  // Databases
  {
    name: 'PostgreSQL',
    category: 'tool',
    aliases: ['postgres', 'postgresql', 'psql'],
    related: ['SQL', 'Database', 'MySQL']
  },
  {
    name: 'MongoDB',
    category: 'tool',
    aliases: ['mongo', 'mongodb', 'nosql'],
    related: ['NoSQL', 'Database', 'Mongoose']
  },
  
  // Cloud & DevOps
  {
    name: 'AWS',
    category: 'tool',
    aliases: ['amazon web services', 'aws cloud', 'amazon aws'],
    related: ['Cloud Computing', 'S3', 'EC2', 'Lambda']
  },
  {
    name: 'Docker',
    category: 'tool',
    aliases: ['docker container', 'containerization'],
    related: ['Kubernetes', 'DevOps', 'CI/CD']
  },
  
  // Soft Skills
  {
    name: 'Project Management',
    category: 'soft',
    aliases: ['program management', 'project lead', 'project leadership'],
    related: ['Agile', 'Scrum', 'Team Leadership']
  },
  {
    name: 'Team Leadership',
    category: 'soft',
    aliases: ['team lead', 'technical lead', 'tech lead'],
    related: ['Project Management', 'People Management']
  },
  
  // Domain Knowledge
  {
    name: 'Machine Learning',
    category: 'domain',
    aliases: ['ml', 'deep learning', 'ai', 'artificial intelligence'],
    related: ['Python', 'TensorFlow', 'PyTorch', 'Data Science']
  },
  {
    name: 'Web Development',
    category: 'domain',
    aliases: ['web dev', 'frontend', 'backend', 'full stack'],
    related: ['JavaScript', 'HTML', 'CSS', 'React', 'Node.js']
  }
];

export function findSkill(text: string): Skill | undefined {
  const normalizedText = text.toLowerCase();
  
  return skillsDatabase.find(skill => 
    skill.name.toLowerCase() === normalizedText ||
    skill.aliases.some(alias => alias.toLowerCase() === normalizedText)
  );
}

export function findRelatedSkills(skillName: string): Skill[] {
  const skill = findSkill(skillName);
  if (!skill?.related) return [];
  
  return skill.related
    .map(name => findSkill(name))
    .filter((s): s is Skill => s !== undefined);
}

export function getSkillsByCategory(category: SkillCategory): Skill[] {
  return skillsDatabase.filter(skill => skill.category === category);
}

export function normalizeSkillName(text: string): string {
  const skill = findSkill(text);
  return skill ? skill.name : text;
}