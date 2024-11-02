export interface User {
  id: string;
  email: string;
  password?: string;
  role: 'admin' | 'sales';
  name: string;
}

export interface Person {
  id: string;
  name: string;
  email: string | string[];
  designation: string;
  phoneNumbers?: string[];
  linkedin?: string;
}

export interface Lead {
  id: string;
  persons: {
    person: Person;
    isPrimary: boolean;
  }[];
  companyName: string;
  location: string;
  source: string;
  jobPostUrl: string;
  jobTitle: string;
  jobNature: 'Contract' | 'Permanent';
  workplaceModel: 'Remote' | 'Onsite' | 'Hybrid';
  officeLocation?: string;
  salaryType: 'Hourly' | 'Monthly';
  salaryCurrency: string;
  salaryAmount?: number;
  description?: string;
  customFields: Array<{
    id: string;
    title: string;
    value: string;
  }>;
  status: 'SENT' | 'IN_PROGRESS' | 'PENDING' | 'HIRED';
  resumeSent: boolean;
  contractSigned: boolean;
  interested: boolean;
  notInterested: boolean;
  response: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
}