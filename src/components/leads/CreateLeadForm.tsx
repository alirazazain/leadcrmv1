import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { SelectWithAdd } from './SelectWithAdd';
import { SearchableDropdown } from '../common/SearchableDropdown';
import { CreateCompanyPanel } from '../company/CreateCompanyPanel';
import { CreatePersonPanel } from '../person/CreatePersonPanel';
import { mockCompanies } from '../../data/mockCompanies';

const currencies = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
  { value: 'CAD', label: 'CAD' },
  { value: 'AUD', label: 'AUD' },
  { value: 'JPY', label: 'JPY' },
];

interface FormData {
  company: string;
  persons: string[];
  jobTitle: string;
  jobPostUrl: string;
  source: string;
  jobNature: 'Contract' | 'Permanent';
  workplaceModel: 'Remote' | 'Onsite' | 'Hybrid';
  officeLocation: string;
  salaryType: 'Monthly' | 'Hourly';
  salaryCurrency: string;
  salaryAmount: string;
  description: string;
  notes: string;
}

interface FormErrors {
  salaryAmount?: string;
  jobPostUrl?: string;
  persons?: string;
}

export function CreateLeadForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isCompanyPanelOpen, setIsCompanyPanelOpen] = useState(false);
  const [isPersonPanelOpen, setIsPersonPanelOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [companies, setCompanies] = useState(mockCompanies.map(c => ({ value: c.id, label: c.name })));
  const [persons, setPersons] = useState<Array<{ value: string; label: string }>>([]);
  const [currentPerson, setCurrentPerson] = useState('');

  const [formData, setFormData] = useState<FormData>({
    company: '',
    persons: [],
    jobTitle: '',
    jobPostUrl: '',
    source: '',
    jobNature: 'Permanent',
    workplaceModel: 'Onsite',
    officeLocation: '',
    salaryType: 'Monthly',
    salaryCurrency: 'USD',
    salaryAmount: '',
    description: '',
    notes: ''
  });

  const handleCompanySearch = (query: string) => {
    const filtered = mockCompanies
      .filter(company => 
        company.name.toLowerCase().includes(query.toLowerCase())
      )
      .map(c => ({ value: c.id, label: c.name }));
    setCompanies(filtered);
  };

  const handlePersonSearch = (query: string) => {
    const selectedCompany = mockCompanies.find(c => c.id === formData.company);
    if (selectedCompany) {
      const filtered = selectedCompany.people
        .filter(person => 
          person.name.toLowerCase().includes(query.toLowerCase()) &&
          !formData.persons.includes(person.id)
        )
        .map(p => ({ value: p.id, label: p.name }));
      setPersons(filtered);
    }
  };

  const handleChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // When company changes, reset persons and update persons list
      if (field === 'company') {
        newData.persons = [];
        setCurrentPerson('');
        const selectedCompany = mockCompanies.find(c => c.id === value);
        if (selectedCompany) {
          setPersons(selectedCompany.people.map(p => ({
            value: p.id,
            label: p.name
          })));
        } else {
          setPersons([]);
        }
      }
      
      return newData;
    });
    
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddPerson = () => {
    if (currentPerson && !formData.persons.includes(currentPerson)) {
      handleChange('persons', [...formData.persons, currentPerson]);
      setCurrentPerson('');
      // Update available persons list
      setPersons(prev => prev.filter(p => p.value !== currentPerson));
    }
  };

  const handleRemovePerson = (personId: string) => {
    handleChange('persons', formData.persons.filter(id => id !== personId));
    // Add the person back to the available persons list
    const selectedCompany = mockCompanies.find(c => c.id === formData.company);
    const person = selectedCompany?.people.find(p => p.id === personId);
    if (person) {
      setPersons(prev => [...prev, { value: person.id, label: person.name }]);
    }
  };

  const handleCompanySubmit = (companyData: any) => {
    const newCompany = {
      id: crypto.randomUUID(),
      name: companyData.name,
      location: `${companyData.city}, ${companyData.country}`,
      website: companyData.website,
      linkedin: companyData.linkedin,
      industry: companyData.industry,
      people: []
    };
    
    mockCompanies.push(newCompany);
    setCompanies(prev => [...prev, { value: newCompany.id, label: newCompany.name }]);
    handleChange('company', newCompany.id);
    setIsCompanyPanelOpen(false);
  };

  const handlePersonSubmit = (personData: any) => {
    const selectedCompany = mockCompanies.find(c => c.id === formData.company);
    if (!selectedCompany) return;

    const newPerson = {
      id: crypto.randomUUID(),
      name: `${personData.firstName} ${personData.lastName}`,
      email: personData.emails,
      designation: personData.designation,
      phoneNumbers: personData.phoneNumbers,
      linkedin: personData.linkedin
    };
    
    selectedCompany.people.push(newPerson);
    setPersons(prev => [...prev, { value: newPerson.id, label: newPerson.name }]);
    setCurrentPerson(newPerson.id);
    setIsPersonPanelOpen(false);
  };

  const validateForm = () => {
    const errors: FormErrors = {};

    if (formData.persons.length === 0) {
      errors.persons = 'At least one person is required';
    }

    if (formData.salaryAmount && !/^\d+([,.]\d{1,2})?$/.test(formData.salaryAmount)) {
      errors.salaryAmount = 'Please enter a valid amount';
    }

    if (formData.jobPostUrl && !formData.jobPostUrl.startsWith('https://')) {
      errors.jobPostUrl = 'URL must start with https://';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      // API call would go here
      navigate('/leads');
    } catch (error) {
      console.error('Error creating lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPersonName = (personId: string) => {
    const selectedCompany = mockCompanies.find(c => c.id === formData.company);
    const person = selectedCompany?.people.find(p => p.id === personId);
    return person?.name || '';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Contact Details</h3>
          <div className="mt-4">
            <div className="grid grid-cols-2 gap-6">
              <SearchableDropdown
                label="Company"
                id="company"
                value={formData.company}
                onChange={(value) => handleChange('company', value)}
                onAdd={() => setIsCompanyPanelOpen(true)}
                options={companies}
                onSearch={handleCompanySearch}
                required
              />

              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <SearchableDropdown
                    label={`Relevant Person ${formData.persons.length + 1}`}
                    id="person"
                    value={currentPerson}
                    onChange={setCurrentPerson}
                    onAdd={() => setIsPersonPanelOpen(true)}
                    options={persons}
                    onSearch={handlePersonSearch}
                    required={formData.persons.length === 0}
                    disabled={!formData.company}
                  />
                </div>
                {currentPerson && (
                  <button
                    type="button"
                    onClick={handleAddPerson}
                    className="mb-[2px] p-2 text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors duration-200"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
            {formErrors.persons && (
              <p className="mt-1 text-sm text-red-600">{formErrors.persons}</p>
            )}

            {formData.persons.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Selected Persons</h4>
                <div className="space-y-3">
                  {formData.persons.map((personId, index) => (
                    <div
                      key={personId}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm text-gray-900">
                        Relevant Person {index + 1}: {getPersonName(personId)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemovePerson(personId)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900">Job Post Details</h3>
          <div className="mt-4 grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
                Job Title
              </label>
              <input
                type="text"
                id="jobTitle"
                value={formData.jobTitle}
                onChange={(e) => handleChange('jobTitle', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="jobPostUrl" className="block text-sm font-medium text-gray-700">
                Job Post URL
              </label>
              <input
                type="url"
                id="jobPostUrl"
                value={formData.jobPostUrl}
                onChange={(e) => handleChange('jobPostUrl', e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border ${
                  formErrors.jobPostUrl ? 'border-red-300 bg-red-50' : 'border-gray-300'
                } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                placeholder="https://"
                required
              />
              {formErrors.jobPostUrl && (
                <p className="mt-1 text-sm text-red-600">{formErrors.jobPostUrl}</p>
              )}
            </div>

            <div>
              <label htmlFor="jobNature" className="block text-sm font-medium text-gray-700">
                Job Nature
              </label>
              <select
                id="jobNature"
                value={formData.jobNature}
                onChange={(e) => handleChange('jobNature', e.target.value as 'Contract' | 'Permanent')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="Permanent">Permanent</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div>
              <label htmlFor="workplaceModel" className="block text-sm font-medium text-gray-700">
                Workplace Model
              </label>
              <select
                id="workplaceModel"
                value={formData.workplaceModel}
                onChange={(e) => handleChange('workplaceModel', e.target.value as 'Remote' | 'Onsite' | 'Hybrid')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="Onsite">Onsite</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label htmlFor="officeLocation" className="block text-sm font-medium text-gray-700">
                Office Location
              </label>
              <input
                type="text"
                id="officeLocation"
                value={formData.officeLocation}
                onChange={(e) => handleChange('officeLocation', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <SelectWithAdd
              label="Source"
              id="source"
              value={formData.source}
              onChange={(value) => handleChange('source', value)}
              onAdd={() => {}}
              options={[
                { value: 'LinkedIn', label: 'LinkedIn' },
                { value: 'Indeed', label: 'Indeed' },
                { value: 'Custom', label: 'Custom' }
              ]}
            />

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salary Details
              </label>
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <label htmlFor="salaryType" className="block text-sm text-gray-600">
                    Type
                  </label>
                  <select
                    id="salaryType"
                    value={formData.salaryType}
                    onChange={(e) => handleChange('salaryType', e.target.value as 'Monthly' | 'Hourly')}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Hourly">Hourly</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="salaryCurrency" className="block text-sm text-gray-600">
                    Currency
                  </label>
                  <select
                    id="salaryCurrency"
                    value={formData.salaryCurrency}
                    onChange={(e) => handleChange('salaryCurrency', e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  >
                    {currencies.map(currency => (
                      <option key={currency.value} value={currency.value}>
                        {currency.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="salaryAmount" className="block text-sm text-gray-600">
                    Amount
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">
                        {formData.salaryCurrency}
                      </span>
                    </div>
                    <input
                      type="text"
                      id="salaryAmount"
                      value={formData.salaryAmount}
                      onChange={(e) => handleChange('salaryAmount', e.target.value)}
                      placeholder={`e.g., ${formData.salaryType === 'Monthly' ? '5,000' : '50'}`}
                      className={`block w-full pl-12 pr-3 py-2 bg-white border ${
                        formErrors.salaryAmount ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm`}
                    />
                  </div>
                  {formErrors.salaryAmount && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.salaryAmount}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter job description..."
              />
            </div>

            <div className="col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => navigate('/leads')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Lead'}
        </button>
      </div>

      <CreateCompanyPanel
        isOpen={isCompanyPanelOpen}
        onClose={() => setIsCompanyPanelOpen(false)}
        onSubmit={handleCompanySubmit}
      />

      <CreatePersonPanel
        isOpen={isPersonPanelOpen}
        onClose={() => setIsPersonPanelOpen(false)}
        onSubmit={handlePersonSubmit}
        companyId={formData.company}
      />
    </form>
  );
}