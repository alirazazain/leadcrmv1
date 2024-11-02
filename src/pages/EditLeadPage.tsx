import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EditLeadForm } from '../components/leads/EditLeadForm';

export function EditLeadPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/leads"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Leads
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Edit Lead</h1>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <EditLeadForm />
        </div>
      </div>
    </div>
  );
}