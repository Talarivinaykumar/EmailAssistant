import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { emailApi } from '../services/api';

import EmailList from '../components/EmailList';
import FilterBar from '../components/FilterBar';
import NewEmailButton from '../components/NewEmailButton';

const EmailListPage: React.FC = () => {
  const [filters, setFilters] = useState({
    status: '',
    intent: '',
    priority: '',
    team: '',
    user: '',
  });

  const { data: emails, isLoading, error } = useQuery({
    queryKey: ['emails', filters],
    queryFn: () => emailApi.getAllEmails(filters),
  });

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading emails. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage all incoming emails
          </p>
        </div>
        <NewEmailButton />
      </div>

      {/* Filters */}
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />

      {/* Email list */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Emails ({emails?.length || 0})
            </h3>
          </div>
          <EmailList emails={emails || []} />
        </div>
      </div>
    </div>
  );
};

export default EmailListPage;
