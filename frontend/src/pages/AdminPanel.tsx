import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ChartBarIcon,
  CogIcon,
  UserGroupIcon,
  EnvelopeIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { emailApi } from '../services/api';
import StatCard from '../components/StatCard';

const AdminPanel: React.FC = () => {
  const { data: statistics, isLoading } = useQuery({
    queryKey: ['emailStatistics'],
    queryFn: emailApi.getEmailStatistics,
  });

  const stats = [
    {
      name: 'Total Emails',
      value: statistics?.totalEmails || 0,
      icon: EnvelopeIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Pending',
      value: statistics?.pendingEmails || 0,
      icon: ClockIcon,
      color: 'bg-yellow-500',
    },
    {
      name: 'Resolved',
      value: statistics?.resolvedEmails || 0,
      icon: CheckCircleIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Avg Response Time',
      value: `${Math.round((statistics?.averageResponseTime || 0) * 100) / 100}h`,
      icon: ChartBarIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Intent Distribution',
      value: Object.entries(statistics?.intentDistribution || {})
        .map(([intent, count]) => `${intent}: ${count}`)
        .join(', ') || 'N/A',
      icon: UserGroupIcon,
      color: 'bg-red-500',
    }
    
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="mt-1 text-sm text-gray-500">
          System administration and configuration
        </p>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.name} {...stat} />
        ))}
      </div>

      {/* Admin Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Configuration */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <CogIcon className="h-6 w-6 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">System Configuration</h3>
            </div>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">AI Model</label>
              <p className="mt-1 text-sm text-gray-900">Gemini 1.5 Pro</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Processing Batch Size</label>
              <p className="mt-1 text-sm text-gray-900">10 emails</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Poll Interval</label>
              <p className="mt-1 text-sm text-gray-900">30 seconds</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Retries</label>
              <p className="mt-1 text-sm text-gray-900">3 attempts</p>
            </div>
          </div>
        </div>

        {/* Team Performance */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <UserGroupIcon className="h-6 w-6 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Team Performance</h3>
            </div>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Support Team</span>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">85%</p>
                  <p className="text-xs text-gray-500">Satisfaction</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Technical Team</span>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">92%</p>
                  <p className="text-xs text-gray-500">Satisfaction</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Billing Team</span>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">78%</p>
                  <p className="text-xs text-gray-500">Satisfaction</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Intent Distribution */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <ChartBarIcon className="h-6 w-6 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Intent Distribution</h3>
            </div>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-3">
              {statistics?.emailsByIntent && Object.entries(statistics.emailsByIntent).map(([intent, count]) => (
                <div key={intent} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {intent.replace('_', ' ')}
                  </span>
                  <span className="text-sm text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">System Health</h3>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Database</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Healthy
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">AI Service</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Email Processing</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Last Backup</span>
              <span className="text-sm text-gray-900">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <CogIcon className="h-4 w-4 mr-2" />
              System Settings
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <UserGroupIcon className="h-4 w-4 mr-2" />
              User Management
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <ChartBarIcon className="h-4 w-4 mr-2" />
              View Reports
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <EnvelopeIcon className="h-4 w-4 mr-2" />
              Email Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
