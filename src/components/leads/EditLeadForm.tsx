import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { SearchableDropdown } from '../common/SearchableDropdown';
import { CreateCompanyPanel } from '../company/CreateCompanyPanel';
import { CreatePersonPanel } from '../person/CreatePersonPanel';
import { mockCompanies } from '../../data/mockCompanies';
import { useLeadStore } from '../../store/leadStore';

const sourceOptions = [
  { value: 'LinkedIn', label: 'LinkedIn' },
  { value: 'Addusjobs', label: 'Addusjobs' },
  { value: 'Adzuna', label: 'Adzuna' },
  { value: 'Angelist', label: 'Angelist' },
  { value: 'Bebee', label: 'Bebee' },
  { value: 'Career Builder', label: 'Career Builder' },
  { value: 'GlassDoor', label: 'GlassDoor' },
  { value: 'Google Careers', label: 'Google Careers' },
  { value: 'Google Jobs', label: 'Google Jobs' },
  { value: 'Custom', label: 'Custom' }
];

interface SelectedPerson {
  id: string;
  name: string;
  email: string | string[];
  designation: string;
}

export function EditLeadForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { leads, updateLead } = useLeadStore();
  const lead = leads.find(l => l.id === id);

  const [formData, setFormData] = useState({
    customSource: '',
    source: '',
    company: '',
    jobPostUrl: '',
    currentPerson: '',
    notes: ''
  });

  const [selectedPersons, setSelectedPersons] = useState<SelectedPerson[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState(mockCompanies.map(c => ({ value: c.id, label: c.name })));
  const [persons, setPersons] = useState<Array<{ value: string; label: string }>>([]);
  const [isCompanyPanelOpen, setIsCompanyPanelOpen] = useState(false);
  const [isPersonPanelOpen, setIsPersonPanelOpen] = useState(false);

  useEffect(() => {
    if (lead) {
      const company = mockCompanies.find(c => c.name === lead.companyName);
      if (company) {
        const mainPerson = company.people.find(p => p.name === lead.personName);
        const additionalPersons = lead.additionalPersons?.map(ap => {
          const person = company.people.find(p => p.name === ap.name);
          return person ? {
            id: person.id,
            name: person.name,
            email: person.email,
            designation: person.designation
          } : null;
        }).filter((p): p is SelectedPerson => p !== null) || [];

        if (mainPerson) {
          setSelectedPersons([
            {
              id: mainPerson.id,
              name: mainPerson.name,
              email: mainPerson.email,
              designation: mainPerson.designation
            },
            ...additionalPersons
          ]);
        }

        setFormData({
          source: sourceOptions.some(opt => opt.value === lead.source) ? lead.source : 'Custom',
          customSource: sourceOptions.some(opt => opt.value === lead.source) ? '' : lead.source,
          company: company.id,
          jobPostUrl: lead.jobPostUrl,
          currentPerson: '',
          notes: lead.notes
        });

        // Set available persons for the selected company
        setPersons(company.people
          .filter(p => !selectedPersons.some(sp => sp.id === p.id))
          .map(p => ({
            value: p.id,
            label: p.name
          }))
        );
      }
    }
  }, [lead]);

  const handleCompanySearch = async (query: string) => {
    setLoading(true);
    try {
      const filtered = mockCompanies
        .filter(company => 
          company.name.toLowerCase().includes(query.toLowerCase())
        )
        .map(c => ({ value: c.id, label: c.name }));
      setCompanies(filtered);
    } finally {
      setLoading(false);
    }
  };

  const handlePersonSearch = async (query: string) => {
    setLoading(true);
    try {
      const selectedCompany = mockCompanies.find(c => c.id === formData.company);
      if (selectedCompany) {
        const filtered = selectedCompany.people
          .filter(person => 
            person.name.toLowerCase().includes(query.toLowerCase()) &&
            !selectedPersons.some(sp => sp.id === person.id)
          )
          .map(p => ({ value: p.id, label: p.name }));
        setPersons(filtered);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddPerson = () => {
    const selectedCompany = mockCompanies.find(c => c.id === formData.company);
    const selectedPerson = selectedCompany?.people.find(p => p.id === formData.currentPerson);

    if (selectedPerson && !selectedPersons.some(p => p.id === selectedPerson.id)) {
      setSelectedPersons(prev => [...prev, {
        id: selectedPerson.id,
        name: selectedPerson.name,
        email: selectedPerson.email,
        designation: selectedPerson.designation
      }]);
      setFormData(prev => ({ ...prev, currentPerson: '' }));
      setPersons(prev => prev.filter(p => p.value !== selectedPerson.id));
    }
  };

  const handleRemovePerson = (personId: string) => {
    setSelectedPersons(prev => prev.filter(p => p.id !== personId));
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
    setFormData(prev => ({ ...prev, company: newCompany.id }));
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
    setFormData(prev => ({ ...prev, currentPerson: newPerson.id }));
    setIsPersonPanelOpen(false);
  };

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormErrors(prev => ({ ...prev, [field]: '' }));
    
    if (field === 'company') {
      const selectedCompany = mockCompanies.find(c => c.id === value);
      if (selectedCompany) {
        setPersons(selectedCompany.people
          .filter(p => !selectedPersons.some(sp => sp.id === p.id))
          .map(p => ({
            value: p.id,
            label: p.name
          }))
        );
        setFormData(prev => ({ ...prev, currentPerson: '', company: value }));
        setSelectedPersons([]);
        return;
      }
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.company) {
      errors.company = 'Company is required';
    }

    if (selectedPersons.length === 0) {
      errors.persons = 'At least one person is required';
    }

    if (!formData.jobPostUrl) {
      errors.jobPostUrl = 'Job Post URL is required';
    } else if (!validateUrl(formData.jobPostUrl)) {
      errors.jobPostUrl = 'Please enter a valid URL';
    }

    if (formData.source === 'Custom' && !formData.customSource) {
      errors.customSource = 'Custom source is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !id) {
      return;
    }

    const selectedCompany = mockCompanies.find(c => c.id === formData.company);

    if (!selectedCompany || selectedPersons.length === 0) {
      setFormErrors(prev => ({
        ...prev,
        company: !selectedCompany ? 'Invalid company selected' : '',
        persons: selectedPersons.length === 0 ? 'At least one person is required' : ''
      }));
      return;
    }

    const updatedLead = {
      personName: selectedPersons[0].name,
      email: selectedPersons[0].email,
      companyName: selectedCompany.name,
      location: selectedCompany.location,
      designation: selectedPersons[0].designation,
      source: formData.source === 'Custom' ? formData.customSource : formData.source,
      jobPostUrl: formData.jobPostUrl,
      notes: formData.notes,
      additionalPersons: selectedPersons.slice(1)
    };

    updateLead(id, updatedLead);
    navigate('/leads');
  };

  if (!lead) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Lead not found</h2>
        <p className="mt-2 text-gray-600">The lead you're trying to edit doesn't exist or has been removed.</p>
        <Link
          to="/leads"
          className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-500"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Leads
        </Link>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* First Row: Company and Person */}
          <div>
            <SearchableDropdown
              label="Company"
              id="company"
              value={formData.company}
              onChange={(value) => handleChange('company', value)}
              onAdd={() => setIsCompanyPanelOpen(true)}
              options={companies}
              onSearch={handleCompanySearch}
              loading={loading}
              required
            />
            {formErrors.company && (
              <p className="mt-1 text-sm text-red-600">{formErrors.company}</p>
            )}
          </div>

          <div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <SearchableDropdown
                  label="Relevant Person"
                  id="person"
                  value={formData.currentPerson}
                  onChange={(value) => handleChange('currentPerson', value)}
                  onAdd={() => setIsPersonPanelOpen(true)}
                  options={persons}
                  onSearch={handlePersonSearch}
                  loading={loading}
                  disabled={!formData.company}
                />
              </div>
              {formData.currentPerson && (
                <button
                  type="button"
                  onClick={handleAddPerson}
                  className="mb-[2px] p-2 text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors duration-200"
                >
                  <Plus className="h-5 w-5" />
                </button>
              )}
            </div>
            {formErrors.persons && (
              <p className="mt-1 text-sm text-red-600">{formErrors.persons}</p>
            )}
          </div>

          {/* Second Row: Job Post URL and Source */}
          <div>
            <label htmlFor="jobPostUrl" className="block text-sm font-medium text-gray-700">
              Job Post URL*
            </label>
            <input
              type="url"
              id="jobPostUrl"
              value={formData.jobPostUrl}
              onChange={(e) => handleChange('jobPostUrl', e.target.value)}
              placeholder="https://example.com/job"
              className={`mt-1 block w-full px-3 py-2 border ${
                formErrors.jobPostUrl ? 'border-red-300 bg-red-50' : 'border-gray-300'
              } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              required
            />
            {formErrors.jobPostUrl && (
              <p className="mt-1 text-sm text-red-600">{formErrors.jobPostUrl}</p>
            )}
          </div>

          <div>
            <label htmlFor="source" className="block text-sm font-medium text-gray-700">
              Source
            </label>
            <div className="mt-1 space-y-3">
              <select
                id="source"
                value={formData.source}
                onChange={(e) => handleChange('source', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">--------</option>
                {sourceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {formData.source === 'Custom' && (
                <div>
                  <input
                    type="text"
                    value={formData.customSource}
                    onChange={(e) => handleChange('customSource', e.target.value)}
                    placeholder="Enter custom source"
                    className={`block w-full px-3 py-2 border ${
                      formErrors.customSource ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                  {formErrors.customSource && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.customSource}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {selectedPersons.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Relevant Persons</h3>
            <div className="space-y-4">
              {selectedPersons.map((person, index) => (
                <div
                  key={person.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Relevant Person {index + 1}: {person.name}
                    </h4>
                    <p className="text-sm text-gray-500">{person.designation}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemovePerson(person.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
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
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Changes
          </button>
        </div>
      </form>

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
    </>
  );
}