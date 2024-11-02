import { useState } from 'react';
import { SearchableDropdown } from '../common/SearchableDropdown';
import { CreatePersonPanel } from '../person/CreatePersonPanel';
import { Person } from '../../types';
import { Trash2 } from 'lucide-react';

interface PersonSelectorProps {
  index: number;
  companyId: string;
  value: string;
  persons: Array<{ value: string; label: string }>;
  onPersonSelect: (personId: string) => void;
  onPersonCreate: (person: Person) => void;
  onRemove: () => void;
  loading: boolean;
  onSearch: (query: string) => void;
  error?: string;
  canRemove: boolean;
}

export function PersonSelector({
  index,
  companyId,
  value,
  persons,
  onPersonSelect,
  onPersonCreate,
  onRemove,
  loading,
  onSearch,
  error,
  canRemove
}: PersonSelectorProps) {
  const [isPersonPanelOpen, setIsPersonPanelOpen] = useState(false);

  const handlePersonSubmit = (personData: any) => {
    const newPerson: Person = {
      id: crypto.randomUUID(),
      name: `${personData.firstName} ${personData.lastName}`,
      email: personData.emails,
      designation: personData.designation,
      phoneNumbers: personData.phoneNumbers,
      linkedin: personData.linkedin
    };
    
    onPersonCreate(newPerson);
    setIsPersonPanelOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <SearchableDropdown
            label={`Relevant Person ${index + 1}`}
            id={`person-${index}`}
            value={value}
            onChange={onPersonSelect}
            onAdd={() => setIsPersonPanelOpen(true)}
            options={persons}
            onSearch={onSearch}
            loading={loading}
            required={index === 0}
            disabled={!companyId}
          />
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="mt-7 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        )}
      </div>

      <CreatePersonPanel
        isOpen={isPersonPanelOpen}
        onClose={() => setIsPersonPanelOpen(false)}
        onSubmit={handlePersonSubmit}
        companyId={companyId}
      />
    </div>
  );
}