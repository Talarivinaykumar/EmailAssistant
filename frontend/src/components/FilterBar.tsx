import React from 'react';
import { EmailStatus, EmailIntent, Priority } from '../types';

interface Filters {
  status: string;
  intent: string;
  priority: string;
  team: string;
  user: string;
}

interface FilterBarProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
  const handleFilterChange = (key: keyof Filters, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      status: '',
      intent: '',
      priority: '',
      team: '',
      user: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Status filter */}
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status-filter"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="">All Statuses</option>
            {Object.values(EmailStatus).map((status) => (
              <option key={status} value={status}>
                {status.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Intent filter */}
        <div>
          <label htmlFor="intent-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Intent
          </label>
          <select
            id="intent-filter"
            value={filters.intent}
            onChange={(e) => handleFilterChange('intent', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="">All Intents</option>
            {Object.values(EmailIntent).map((intent) => (
              <option key={intent} value={intent}>
                {intent.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Priority filter */}
        <div>
          <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            id="priority-filter"
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="">All Priorities</option>
            {Object.values(Priority).map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>

        {/* Team filter */}
        <div>
          <label htmlFor="team-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Team
          </label>
          <input
            type="text"
            id="team-filter"
            value={filters.team}
            onChange={(e) => handleFilterChange('team', e.target.value)}
            placeholder="Filter by team"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>

        {/* User filter */}
        <div>
          <label htmlFor="user-filter" className="block text-sm font-medium text-gray-700 mb-1">
            User
          </label>
          <input
            type="text"
            id="user-filter"
            value={filters.user}
            onChange={(e) => handleFilterChange('user', e.target.value)}
            placeholder="Filter by user"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>

        {/* Clear filters button */}
        {hasActiveFilters && (
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
