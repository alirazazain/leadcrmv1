import { X, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface CreatePersonPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PersonData) => void;
  companyId: string;
}

interface PersonData {
  firstName: string;
  lastName: string;
  designation: string;
  emails: string[];
  phoneNumbers: string[];
  country: string;
  city: string;
  linkedin: string;
}

export function CreatePersonPanel({ isOpen, onClose, onSubmit, companyId }: CreatePersonPanelProps) {
  const [formData, setFormData] = useState<PersonData>({
    firstName: '',
    lastName: '',
    designation: '',
    emails: [''],
    phoneNumbers: [''],
    country: '',
    city: '',
    linkedin: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PersonData, string>>>({});

  const handleChange = (field: keyof PersonData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleArrayChange = (field: 'emails' | 'phoneNumbers', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    handleChange(field, newArray);
  };

  const addArrayItem = (field: 'emails' | 'phoneNumbers') => {
    handleChange(field, [...formData[field], '']);
  };

  const removeArrayItem = (field: 'emails' | 'phoneNumbers', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    handleChange(field, newArray);
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof PersonData, string>> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.emails[0]) {
      newErrors.emails = 'At least one email is required';
    }

    if (formData.linkedin && !formData.linkedin.startsWith('https://')) {
      newErrors.linkedin = 'LinkedIn URL must start with https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end transition-opacity duration-300">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl animate-slide-left">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Add New Person</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className={`block w-full px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200
                      ${errors.firstName ? 'border-red-300 bg-red-50' : 'border border-gray-300'}`}
                    required
                  />
                  {errors.firstName && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className={`block w-full px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200
                      ${errors.lastName ? 'border-red-300 bg-red-50' : 'border border-gray-300'}`}
                    required
                  />
                  {errors.lastName && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">
                  Designation<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="designation"
                  value={formData.designation}
                  onChange={(e) => handleChange('designation', e.target.value)}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Addresses<span className="text-red-500">*</span>
                </label>
                {formData.emails.map((email, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => handleArrayChange('emails', index, e.target.value)}
                      className="flex-1 px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Email address"
                      required={index === 0}
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('emails', index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('emails')}
                  className="inline-flex items-center px-3 py-2 text-sm text-indigo-600 hover:text-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add another email
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Numbers
                </label>
                {formData.phoneNumbers.map((phone, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => handleArrayChange('phoneNumbers', index, e.target.value)}
                      className="flex-1 px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Phone number"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('phoneNumbers', index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('phoneNumbers')}
                  className="inline-flex items-center px-3 py-2 text-sm text-indigo-600 hover:text-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add another phone number
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={(e) => handleChange('linkedin', e.target.value)}
                  className={`block w-full px-4 py-3 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200
                    ${errors.linkedin ? 'border-red-300 bg-red-50' : 'border border-gray-300'}`}
                  placeholder="https://linkedin.com/in/username"
                />
                {errors.linkedin && (
                  <p className="mt-1.5 text-sm text-red-600">{errors.linkedin}</p>
                )}
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              >
                Create Person
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}