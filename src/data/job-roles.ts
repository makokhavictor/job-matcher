export interface JobRole {
  slug: string;
  title: string;
  industry: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  averageSalary: string;
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Executive';
  keywords: string[];
  searchVolume: number;
  relatedRoles: string[];
}

export const jobRoles: JobRole[] = [
  {
    slug: 'software-engineer',
    title: 'Software Engineer',
    industry: 'software-engineering',
    description: 'Design, develop, and maintain software applications and systems using various programming languages and frameworks.',
    responsibilities: [
      'Write clean, maintainable, and efficient code',
      'Collaborate with cross-functional teams to define and implement features',
      'Participate in code reviews and maintain coding standards',
      'Debug and troubleshoot software issues',
      'Contribute to system architecture and design decisions'
    ],
    requirements: [
      "Bachelor's degree in Computer Science or related field",
      '2+ years of software development experience',
      'Proficiency in at least one programming language',
      'Understanding of software development lifecycle',
      'Experience with version control systems (Git)'
    ],
    skills: ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'Git', 'Agile'],
    averageSalary: '$85,000 - $150,000',
    experienceLevel: 'Mid',
    keywords: ['software engineer job description', 'software developer requirements', 'programming job'],
    searchVolume: 12000,
    relatedRoles: ['full-stack-developer', 'backend-developer', 'frontend-developer']
  },
  {
    slug: 'data-scientist',
    title: 'Data Scientist',
    industry: 'data-science',
    description: 'Extract insights from large datasets using statistical analysis, machine learning, and data visualization techniques.',
    responsibilities: [
      'Analyze complex datasets to identify trends and patterns',
      'Build and deploy machine learning models',
      'Create data visualizations and reports for stakeholders',
      'Collaborate with business teams to define analytical requirements',
      'Maintain and optimize data pipelines'
    ],
    requirements: [
      "Master's degree in Data Science, Statistics, or related field",
      '3+ years of experience in data analysis',
      'Proficiency in Python or R',
      'Experience with machine learning frameworks',
      'Strong statistical and mathematical background'
    ],
    skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Pandas', 'NumPy', 'Tableau', 'Statistics'],
    averageSalary: '$95,000 - $165,000',
    experienceLevel: 'Mid',
    keywords: ['data scientist job description', 'machine learning engineer', 'data analyst role'],
    searchVolume: 8500,
    relatedRoles: ['data-analyst', 'ml-engineer', 'research-scientist']
  },
  {
    slug: 'product-manager',
    title: 'Product Manager',
    industry: 'product-management',
    description: 'Guide product development from conception to launch, working with cross-functional teams to deliver user-focused solutions.',
    responsibilities: [
      'Define product strategy and roadmap',
      'Gather and prioritize product requirements',
      'Work closely with engineering and design teams',
      'Analyze market trends and competitive landscape',
      'Track product metrics and user feedback'
    ],
    requirements: [
      "Bachelor's degree in Business, Engineering, or related field",
      '3+ years of product management experience',
      'Strong analytical and problem-solving skills',
      'Experience with agile development methodologies',
      'Excellent communication and leadership abilities'
    ],
    skills: ['Product Strategy', 'User Research', 'Agile', 'Analytics', 'Roadmapping', 'A/B Testing'],
    averageSalary: '$100,000 - $170,000',
    experienceLevel: 'Mid',
    keywords: ['product manager job description', 'pm role requirements', 'product management'],
    searchVolume: 6200,
    relatedRoles: ['product-owner', 'product-marketing-manager', 'senior-product-manager']
  },
  {
    slug: 'digital-marketing-manager',
    title: 'Digital Marketing Manager',
    industry: 'digital-marketing',
    description: 'Develop and execute digital marketing strategies to drive brand awareness, lead generation, and customer acquisition.',
    responsibilities: [
      'Plan and execute digital marketing campaigns',
      'Manage social media presence and content strategy',
      'Optimize SEO and SEM campaigns',
      'Analyze campaign performance and ROI',
      'Collaborate with creative teams on marketing materials'
    ],
    requirements: [
      "Bachelor's degree in Marketing, Communications, or related field",
      '2+ years of digital marketing experience',
      'Experience with Google Analytics and Ads',
      'Knowledge of social media platforms and tools',
      'Strong analytical and creative thinking skills'
    ],
    skills: ['Google Analytics', 'SEO', 'SEM', 'Social Media', 'Content Marketing', 'Email Marketing'],
    averageSalary: '$55,000 - $95,000',
    experienceLevel: 'Mid',
    keywords: ['digital marketing manager job', 'marketing manager role', 'digital marketing position'],
    searchVolume: 4800,
    relatedRoles: ['seo-specialist', 'social-media-manager', 'content-marketing-manager']
  },
  {
    slug: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    industry: 'cybersecurity',
    description: 'Monitor and protect organizational systems from cyber threats, investigate security incidents, and implement security measures.',
    responsibilities: [
      'Monitor security events and investigate incidents',
      'Implement and maintain security tools and systems',
      'Conduct vulnerability assessments and penetration testing',
      'Develop security policies and procedures',
      'Provide security awareness training to employees'
    ],
    requirements: [
      "Bachelor's degree in Cybersecurity, IT, or related field",
      '2+ years of cybersecurity experience',
      'Security certifications (Security+, CISSP, etc.)',
      'Knowledge of security frameworks and compliance',
      'Strong problem-solving and analytical skills'
    ],
    skills: ['Network Security', 'SIEM', 'Incident Response', 'Penetration Testing', 'Risk Assessment'],
    averageSalary: '$70,000 - $120,000',
    experienceLevel: 'Mid',
    keywords: ['cybersecurity analyst job', 'security analyst role', 'information security position'],
    searchVolume: 3600,
    relatedRoles: ['security-engineer', 'penetration-tester', 'security-consultant']
  },
  {
    slug: 'registered-nurse',
    title: 'Registered Nurse',
    industry: 'healthcare',
    description: 'Provide direct patient care, administer medications, and coordinate with healthcare teams to ensure optimal patient outcomes.',
    responsibilities: [
      'Assess patient conditions and develop care plans',
      'Administer medications and treatments',
      'Monitor patient vital signs and progress',
      'Educate patients and families about health conditions',
      'Collaborate with physicians and healthcare team'
    ],
    requirements: [
      'Associate or Bachelor degree in Nursing',
      'Valid RN license in state of practice',
      'BLS and ACLS certification',
      'Strong communication and interpersonal skills',
      'Ability to work in fast-paced environment'
    ],
    skills: ['Patient Care', 'Medical Terminology', 'EMR Systems', 'Clinical Assessment', 'HIPAA Compliance'],
    averageSalary: '$60,000 - $85,000',
    experienceLevel: 'Mid',
    keywords: ['registered nurse job description', 'rn position requirements', 'nursing job'],
    searchVolume: 9200,
    relatedRoles: ['nurse-practitioner', 'clinical-nurse', 'charge-nurse']
  },
  {
    slug: 'financial-analyst',
    title: 'Financial Analyst',
    industry: 'finance',
    description: 'Analyze financial data, prepare reports, and provide insights to support business decision-making and strategic planning.',
    responsibilities: [
      'Prepare financial reports and forecasts',
      'Analyze financial performance and trends',
      'Build financial models and scenarios',
      'Support budgeting and planning processes',
      'Present findings to management and stakeholders'
    ],
    requirements: [
      "Bachelor's degree in Finance, Accounting, or Economics",
      '1-3 years of financial analysis experience',
      'Advanced Excel and financial modeling skills',
      'Knowledge of financial software and databases',
      'Strong analytical and communication skills'
    ],
    skills: ['Financial Analysis', 'Excel', 'Financial Modeling', 'Bloomberg Terminal', 'SQL', 'PowerBI'],
    averageSalary: '$60,000 - $90,000',
    experienceLevel: 'Entry',
    keywords: ['financial analyst job description', 'finance analyst role', 'financial planning position'],
    searchVolume: 5400,
    relatedRoles: ['senior-financial-analyst', 'investment-analyst', 'budget-analyst']
  },
  {
    slug: 'sales-representative',
    title: 'Sales Representative',
    industry: 'sales',
    description: 'Generate leads, build relationships with prospects, and close deals to drive revenue growth for the organization.',
    responsibilities: [
      'Identify and qualify potential customers',
      'Conduct product demonstrations and presentations',
      'Negotiate contracts and close sales',
      'Maintain customer relationships and ensure satisfaction',
      'Meet or exceed sales targets and quotas'
    ],
    requirements: [
      "Bachelor's degree in Business, Marketing, or related field",
      '1-2 years of sales experience preferred',
      'Excellent communication and interpersonal skills',
      'Strong negotiation and closing abilities',
      'Self-motivated and results-oriented'
    ],
    skills: ['CRM Software', 'Lead Generation', 'Negotiation', 'Salesforce', 'Pipeline Management'],
    averageSalary: '$45,000 - $80,000',
    experienceLevel: 'Entry',
    keywords: ['sales representative job', 'sales rep position', 'inside sales role'],
    searchVolume: 7800,
    relatedRoles: ['account-executive', 'business-development-rep', 'sales-manager']
  }
];

export const getJobRoleBySlug = (slug: string): JobRole | undefined => {
  return jobRoles.find(role => role.slug === slug);
};

export const getJobRolesByIndustry = (industry: string): JobRole[] => {
  return jobRoles.filter(role => role.industry === industry);
};

export const getAllJobRoleSlugs = (): string[] => {
  return jobRoles.map(role => role.slug);
};