export interface Person {
  id: string;
  name: string;
  email: string | string[];
  designation: string;
  phoneNumbers?: string[];
  linkedin?: string;
}

export interface Company {
  id: string;
  name: string;
  location: string;
  website?: string;
  linkedin?: string;
  industry?: string;
  people: Person[];
}

export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Apple Inc.',
    location: 'Cupertino, CA',
    website: 'https://www.apple.com',
    linkedin: 'https://www.linkedin.com/company/apple',
    industry: 'Technology',
    people: [
      {
        id: '1',
        name: 'John Smith',
        email: ['john.smith@apple.com', 'johnsmith@gmail.com'],
        designation: 'Senior Software Engineer',
        phoneNumbers: ['+1 (555) 123-4567'],
        linkedin: 'https://www.linkedin.com/in/johnsmith'
      },
      {
        id: '2',
        name: 'Sarah Chen',
        email: 'sarah.chen@apple.com',
        designation: 'Product Manager'
      }
    ]
  },
  {
    id: '2',
    name: 'Microsoft',
    location: 'Redmond, WA',
    website: 'https://www.microsoft.com',
    linkedin: 'https://www.linkedin.com/company/microsoft',
    industry: 'Technology',
    people: [
      {
        id: '3',
        name: 'Sarah Johnson',
        email: 'sarah.j@microsoft.com',
        designation: 'Product Manager'
      }
    ]
  },
  {
    id: '3',
    name: 'Google',
    location: 'Mountain View, CA',
    website: 'https://www.google.com',
    linkedin: 'https://www.linkedin.com/company/google',
    industry: 'Technology',
    people: [
      {
        id: '4',
        name: 'Michael Chen',
        email: 'm.chen@google.com',
        designation: 'ML Engineer'
      }
    ]
  }
];