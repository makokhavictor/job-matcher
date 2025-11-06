export interface SalaryData {
  role: string;
  roleSlug: string;
  industry: string;
  locations: {
    [key: string]: {
      name: string;
      averageSalary: number;
      salaryRange: {
        min: number;
        max: number;
      };
      costOfLiving: number; // Index where 100 = national average
      jobCount: number;
      topCompanies: string[];
      growthRate: string;
    };
  };
}

export const salaryData: SalaryData[] = [
  {
    role: 'Software Engineer',
    roleSlug: 'software-engineer',
    industry: 'Technology',
    locations: {
      'san-francisco': {
        name: 'San Francisco, CA',
        averageSalary: 165000,
        salaryRange: { min: 120000, max: 220000 },
        costOfLiving: 180,
        jobCount: 12500,
        topCompanies: ['Google', 'Meta', 'Uber', 'Airbnb', 'Salesforce'],
        growthRate: '25%'
      },
      'new-york': {
        name: 'New York, NY',
        averageSalary: 145000,
        salaryRange: { min: 105000, max: 195000 },
        costOfLiving: 160,
        jobCount: 8900,
        topCompanies: ['Google', 'Meta', 'Goldman Sachs', 'JPMorgan', 'Bloomberg'],
        growthRate: '22%'
      },
      'seattle': {
        name: 'Seattle, WA',
        averageSalary: 155000,
        salaryRange: { min: 115000, max: 205000 },
        costOfLiving: 140,
        jobCount: 7200,
        topCompanies: ['Amazon', 'Microsoft', 'Google', 'Meta', 'Expedia'],
        growthRate: '28%'
      },
      'austin': {
        name: 'Austin, TX',
        averageSalary: 125000,
        salaryRange: { min: 90000, max: 170000 },
        costOfLiving: 110,
        jobCount: 4800,
        topCompanies: ['Google', 'Meta', 'Apple', 'Dell', 'IBM'],
        growthRate: '35%'
      },
      'denver': {
        name: 'Denver, CO',
        averageSalary: 115000,
        salaryRange: { min: 85000, max: 155000 },
        costOfLiving: 105,
        jobCount: 3200,
        topCompanies: ['Google', 'Amazon', 'Palantir', 'Shopify', 'Twilio'],
        growthRate: '30%'
      }
    }
  },
  {
    role: 'Data Scientist',
    roleSlug: 'data-scientist',
    industry: 'Technology',
    locations: {
      'san-francisco': {
        name: 'San Francisco, CA',
        averageSalary: 175000,
        salaryRange: { min: 130000, max: 240000 },
        costOfLiving: 180,
        jobCount: 3500,
        topCompanies: ['Google', 'Meta', 'Uber', 'Airbnb', 'Netflix'],
        growthRate: '40%'
      },
      'new-york': {
        name: 'New York, NY',
        averageSalary: 155000,
        salaryRange: { min: 115000, max: 210000 },
        costOfLiving: 160,
        jobCount: 2800,
        topCompanies: ['Google', 'Meta', 'Goldman Sachs', 'JPMorgan', 'Two Sigma'],
        growthRate: '38%'
      },
      'seattle': {
        name: 'Seattle, WA',
        averageSalary: 165000,
        salaryRange: { min: 125000, max: 220000 },
        costOfLiving: 140,
        jobCount: 2200,
        topCompanies: ['Amazon', 'Microsoft', 'Google', 'Meta', 'Zillow'],
        growthRate: '42%'
      },
      'boston': {
        name: 'Boston, MA',
        averageSalary: 145000,
        salaryRange: { min: 110000, max: 195000 },
        costOfLiving: 145,
        jobCount: 1800,
        topCompanies: ['Google', 'Amazon', 'Wayfair', 'HubSpot', 'Moderna'],
        growthRate: '35%'
      }
    }
  },
  {
    role: 'Product Manager',
    roleSlug: 'product-manager',
    industry: 'Technology',
    locations: {
      'san-francisco': {
        name: 'San Francisco, CA',
        averageSalary: 185000,
        salaryRange: { min: 140000, max: 250000 },
        costOfLiving: 180,
        jobCount: 2800,
        topCompanies: ['Google', 'Meta', 'Uber', 'Airbnb', 'Stripe'],
        growthRate: '20%'
      },
      'new-york': {
        name: 'New York, NY',
        averageSalary: 165000,
        salaryRange: { min: 125000, max: 220000 },
        costOfLiving: 160,
        jobCount: 2200,
        topCompanies: ['Google', 'Meta', 'Goldman Sachs', 'JPMorgan', 'Spotify'],
        growthRate: '18%'
      },
      'los-angeles': {
        name: 'Los Angeles, CA',
        averageSalary: 155000,
        salaryRange: { min: 115000, max: 205000 },
        costOfLiving: 150,
        jobCount: 1600,
        topCompanies: ['Google', 'Meta', 'Snap', 'Netflix', 'Disney'],
        growthRate: '22%'
      }
    }
  }
];

export const getAllLocationSlugs = (): string[] => {
  const locations = new Set<string>();
  salaryData.forEach(role => {
    Object.keys(role.locations).forEach(location => {
      locations.add(location);
    });
  });
  return Array.from(locations);
};

export const getSalaryDataByRole = (roleSlug: string): SalaryData | undefined => {
  return salaryData.find(data => data.roleSlug === roleSlug);
};

export const getSalaryDataByLocation = (locationSlug: string) => {
  return salaryData
    .map(role => ({
      role: role.role,
      roleSlug: role.roleSlug,
      industry: role.industry,
      locationData: role.locations[locationSlug]
    }))
    .filter(item => item.locationData);
};