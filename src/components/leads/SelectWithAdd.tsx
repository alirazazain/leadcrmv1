import { Plus } from 'lucide-react';

interface SelectWithAddProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
  options: { value: string; label: string }[];
  required?: boolean;
}

export function SelectWithAdd({
  label,
  id,
  value,
  onChange,
  onAdd,
  options,
  required
}: SelectWithAddProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}{required && '*'}
      </label>
      <div className="mt-1 flex">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm rounded-l-lg transition-shadow duration-200"
        >
          <option value="">--------</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 text-sm font-medium rounded-r-lg text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}