export interface Industry {
  slug: string;
  name: string;
  description: string;
  keySkills: string[];
  commonRoles: string[];
  averageSalary: string;
  growthRate: string;
  topCompanies: string[];
  resumeTips: string[];
  keywords: string[];
  searchVolume: number;
}

export const industries: Industry[] = [
  {
    slug: 'software-engineering',
    name: 'Software Engineering',
    description: 'Build and maintain software applications, systems, and platforms using various programming languages and frameworks.',
    keySkills: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'AWS', 'Docker'],
    commonRoles: ['Software Engineer', 'Full Stack Developer', 'Backend Developer', 'Frontend Developer', 'DevOps Engineer'],
    averageSalary: '$95,000 - $180,000',
    growthRate: '22% (Much faster than average)',
    topCompanies: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix'],
    resumeTips: [
      'Highlight specific programming languages and frameworks',
      'Include GitHub portfolio links and project descriptions',
      'Quantify impact with metrics (performance improvements, user growth)',
      'Show experience with agile methodologies and CI/CD'
    ],
    keywords: ['software engineer resume', 'developer resume template', 'programming resume'],
    searchVolume: 8900
  },
  {
    slug: 'data-science',
    name: 'Data Science',
    description: 'Extract insights from complex datasets using statistical analysis, machine learning, and data visualization techniques.',
    keySkills: ['Python', 'R', 'SQL', 'Machine Learning', 'Pandas', 'NumPy', 'Tableau', 'TensorFlow'],
    commonRoles: ['Data Scientist', 'Data Analyst', 'ML Engineer', 'Research Scientist', 'Business Intelligence Analyst'],
    averageSalary: '$85,000 - $165,000',
    growthRate: '35% (Much faster than average)',
    topCompanies: ['Google', 'Facebook', 'Amazon', 'Microsoft', 'Uber', 'Airbnb'],
    resumeTips: [
      'Showcase data projects with clear business impact',
      'Include links to Kaggle competitions and GitHub repositories',
      'Highlight experience with specific ML algorithms and tools',
      'Quantify results with statistical significance and business metrics'
    ],
    keywords: ['data scientist resume', 'data analyst resume template', 'machine learning resume'],
    searchVolume: 5400
  },
  {
    slug: 'digital-marketing',
    name: 'Digital Marketing',
    description: 'Promote products and services through digital channels including social media, search engines, and email campaigns.',
    keySkills: ['Google Analytics', 'SEO', 'SEM', 'Social Media Marketing', 'Content Marketing', 'Email Marketing', 'PPC'],
    commonRoles: ['Digital Marketing Manager', 'SEO Specialist', 'Social Media Manager', 'Content Marketing Manager', 'PPC Specialist'],
    averageSalary: '$50,000 - $95,000',
    growthRate: '10% (Faster than average)',
    topCompanies: ['Google', 'Facebook', 'HubSpot', 'Salesforce', 'Adobe', 'Mailchimp'],
    resumeTips: [
      'Include specific campaign results and ROI metrics',
      'Highlight certifications (Google Ads, Analytics, Facebook Blueprint)',
      'Show experience with marketing automation tools',
      'Demonstrate understanding of customer acquisition costs and lifetime value'
    ],
    keywords: ['digital marketing resume', 'marketing manager resume', 'seo specialist resume'],
    searchVolume: 4200
  },
  {
    slug: 'product-management',
    name: 'Product Management',
    description: 'Guide product development from conception to launch, working with cross-functional teams to deliver user-focused solutions.',
    keySkills: ['Product Strategy', 'User Research', 'Agile', 'Roadmapping', 'Analytics', 'A/B Testing', 'Wireframing'],
    commonRoles: ['Product Manager', 'Senior Product Manager', 'Product Owner', 'VP of Product', 'Product Marketing Manager'],
    averageSalary: '$90,000 - $170,000',
    growthRate: '19% (Much faster than average)',
    topCompanies: ['Google', 'Amazon', 'Microsoft', 'Uber', 'Airbnb', 'Spotify'],
    resumeTips: [
      'Focus on product outcomes and user impact metrics',
      'Highlight cross-functional leadership experience',
      'Include specific examples of product launches and iterations',
      'Show data-driven decision making with A/B test results'
    ],
    keywords: ['product manager resume', 'product management resume template', 'pm resume'],
    searchVolume: 3800
  },
  {
    slug: 'cybersecurity',
    name: 'Cybersecurity',
    description: 'Protect organizations from digital threats by implementing security measures, monitoring systems, and responding to incidents.',
    keySkills: ['Network Security', 'Penetration Testing', 'SIEM', 'Incident Response', 'Risk Assessment', 'Compliance', 'Firewall Management'],
    commonRoles: ['Security Analyst', 'Cybersecurity Engineer', 'Security Consultant', 'CISO', 'Penetration Tester'],
    averageSalary: '$75,000 - $150,000',
    growthRate: '33% (Much faster than average)',
    topCompanies: ['CrowdStrike', 'Palo Alto Networks', 'FireEye', 'Symantec', 'IBM', 'Cisco'],
    resumeTips: [
      'Highlight security certifications (CISSP, CEH, Security+)',
      'Include specific security tools and technologies used',
      'Quantify security improvements and incident response times',
      'Show compliance experience with frameworks like SOC 2, ISO 27001'
    ],
    keywords: ['cybersecurity resume', 'security analyst resume', 'information security resume'],
    searchVolume: 2900
  },
  {
    slug: 'healthcare',
    name: 'Healthcare',
    description: 'Provide medical care, support patient health outcomes, and work in various healthcare settings from hospitals to clinics.',
    keySkills: ['Patient Care', 'Medical Terminology', 'EMR Systems', 'Clinical Assessment', 'Healthcare Compliance', 'HIPAA'],
    commonRoles: ['Registered Nurse', 'Medical Assistant', 'Healthcare Administrator', 'Physical Therapist', 'Medical Technologist'],
    averageSalary: '$45,000 - $85,000',
    growthRate: '16% (Much faster than average)',
    topCompanies: ['Kaiser Permanente', 'Mayo Clinic', 'Cleveland Clinic', 'Johns Hopkins', 'HCA Healthcare'],
    resumeTips: [
      'Highlight relevant certifications and licenses',
      'Include patient care metrics and outcomes',
      'Show experience with healthcare technology and EMR systems',
      'Demonstrate compliance knowledge and continuing education'
    ],
    keywords: ['healthcare resume', 'nurse resume template', 'medical assistant resume'],
    searchVolume: 6700
  },
  {
    slug: 'finance',
    name: 'Finance',
    description: 'Manage financial operations, analyze market trends, and provide strategic financial guidance to organizations.',
    keySkills: ['Financial Analysis', 'Excel', 'Financial Modeling', 'Risk Management', 'Bloomberg Terminal', 'SQL', 'Python'],
    commonRoles: ['Financial Analyst', 'Investment Banker', 'Financial Advisor', 'Risk Manager', 'Portfolio Manager'],
    averageSalary: '$65,000 - $140,000',
    growthRate: '8% (As fast as average)',
    topCompanies: ['Goldman Sachs', 'JPMorgan Chase', 'Morgan Stanley', 'BlackRock', 'Vanguard'],
    resumeTips: [
      'Include relevant certifications (CFA, FRM, CPA)',
      'Quantify financial impact and portfolio performance',
      'Highlight experience with financial software and modeling',
      'Show regulatory compliance and risk management experience'
    ],
    keywords: ['finance resume', 'financial analyst resume', 'investment banking resume'],
    searchVolume: 5100
  },
  {
    slug: 'sales',
    name: 'Sales',
    description: 'Drive revenue growth by building relationships with clients, identifying opportunities, and closing deals.',
    keySkills: ['CRM Software', 'Lead Generation', 'Negotiation', 'Pipeline Management', 'Customer Relationship Management', 'Salesforce'],
    commonRoles: ['Sales Representative', 'Account Executive', 'Sales Manager', 'Business Development Manager', 'Inside Sales Rep'],
    averageSalary: '$45,000 - $120,000',
    growthRate: '4% (As fast as average)',
    topCompanies: ['Salesforce', 'Oracle', 'Microsoft', 'IBM', 'Adobe', 'HubSpot'],
    resumeTips: [
      'Lead with quantified sales achievements and quota attainment',
      'Include specific CRM and sales tool experience',
      'Highlight relationship building and client retention metrics',
      'Show progression in sales targets and territory growth'
    ],
    keywords: ['sales resume', 'sales representative resume', 'account executive resume'],
    searchVolume: 7200
  }
];

export const getIndustryBySlug = (slug: string): Industry | undefined => {
  return industries.find(industry => industry.slug === slug);
};

export const getAllIndustrySlugs = (): string[] => {
  return industries.map(industry => industry.slug);
};