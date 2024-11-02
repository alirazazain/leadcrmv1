import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, ChevronDown, Plus } from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';

interface Option {
  value: string;
  label: string;
}

interface SearchableDropdownProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onAdd?: () => void;
  options: Option[];
  onSearch: (query: string) => void;
  loading?: boolean;
  required?: boolean;
  disabled?: boolean;
}

export function SearchableDropdown({
  id,
  label,
  value,
  onChange,
  onAdd,
  options,
  onSearch,
  loading = false,
  required = false,
  disabled = false,
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  
  useClickOutside(dropdownRef, () => setIsOpen(false));

  // Debounced search
  const debouncedSearch = useCallback((query: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      onSearch(query);
    }, 300);
  }, [onSearch]);

  useEffect(() => {
    if (isOpen && searchQuery) {
      debouncedSearch(searchQuery);
    }
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, isOpen, debouncedSearch]);

  const selectedOption = options.find(opt => opt.value === value);

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(true);
      if (!searchQuery && !loading) {
        onSearch('');
      }
    }
  };

  const handleOptionSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleAddClick = () => {
    if (onAdd) {
      onAdd();
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && '*'}
      </label>
      <div className="relative">
        <div
          className={`w-full flex items-center justify-between px-3 py-2 border rounded-lg bg-white transition-colors duration-200 ${
            disabled 
              ? 'bg-gray-50 border-gray-200 cursor-not-allowed' 
              : 'border-gray-300 cursor-pointer hover:border-gray-400'
          } ${isOpen ? 'border-indigo-500 ring-1 ring-indigo-500' : ''}`}
          onClick={handleInputClick}
        >
          <span className={`block truncate ${!value ? 'text-gray-400' : 'text-gray-900'}`}>
            {selectedOption?.label || '--------'}
          </span>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
        </div>

        {isOpen && !disabled && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            
            <div className="max-h-60 overflow-y-auto">
              {loading ? (
                <div className="px-4 py-3 text-sm text-gray-500 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent"></div>
                  <span className="ml-2">Loading...</span>
                </div>
              ) : options.length > 0 ? (
                <div className="py-1">
                  {options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleOptionSelect(option.value)}
                      className="w-full px-4 py-2 text-sm text-left text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  No results found
                </div>
              )}
            </div>

            {onAdd && (
              <div className="p-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleAddClick}
                  className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}