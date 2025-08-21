import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  EnvelopeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { emailApi } from '../services/api';
import { EmailIntent } from '../types';
import EmailList from '../components/EmailList';
import StatCard from '../components/StatCard';
import IntentChart from '../components/IntentChart';
import EmailDashboard from '../components/EmailDashboard';
import NewEmailButton from '../components/NewEmailButton';

const Dashboard: React.FC = () => {
  // EmailDashboard will handle email selection internally

  // Fetch email statistics
  const { data: statistics, isLoading: statsLoading } = useQuery({
    queryKey: ['emailStatistics'],
    queryFn: emailApi.getEmailStatistics,
  });

  // Fetch recent emails
  const { data: recentEmails, isLoading: emailsLoading } = useQuery({
    queryKey: ['recentEmails'],
    queryFn: () => emailApi.getAllEmails(),
  });

  // Fetch high priority emails
  const { data: highPriorityEmails, isLoading: priorityLoading } = useQuery({
    queryKey: ['highPriorityEmails'],
    queryFn: emailApi.getHighPriorityPendingEmails,
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
      name: 'High Priority',
      value: highPriorityEmails?.length || 0,
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500',
    },
  ];

  const getIntentCount = (intent: EmailIntent) => {
    return statistics?.emailsByIntent?.[intent] || 0;
  };

  const intentData = [
    { name: 'Refund Request', value: getIntentCount(EmailIntent.REFUND_REQUEST) },
    { name: 'Bug Report', value: getIntentCount(EmailIntent.BUG_REPORT) },
    { name: 'Feature Inquiry', value: getIntentCount(EmailIntent.FEATURE_INQUIRY) },
    { name: 'General Support', value: getIntentCount(EmailIntent.GENERAL_SUPPORT) },
    { name: 'Billing Issue', value: getIntentCount(EmailIntent.BILLING_ISSUE) },
    { name: 'Technical Support', value: getIntentCount(EmailIntent.TECHNICAL_SUPPORT) },
    { name: 'Complaint', value: getIntentCount(EmailIntent.COMPLAINT) },
    { name: 'Feedback', value: getIntentCount(EmailIntent.FEEDBACK) },
    { name: 'Unknown', value: getIntentCount(EmailIntent.UNKNOWN) },
  ];

  if (statsLoading || emailsLoading || priorityLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of email processing and team performance
          </p>
        </div>
        <NewEmailButton />
      </div>

      {/* Statistics cards */}
      {/* <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.name} {...stat} />
        ))}
      </div> */}

      {/* Comprehensive Email Dashboard */}
      <EmailDashboard />

      {/* Charts and recent activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Intent distribution chart */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <ChartBarIcon className="h-6 w-6 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Email Intent Distribution</h3>
            </div>
            <div className="mt-4">
              <IntentChart data={intentData} />
            </div>
          </div>
        </div>

        {/* Recent high priority emails */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">High Priority Emails</h3>
            </div>
            <div className="mt-4">
              {highPriorityEmails && highPriorityEmails.length > 0 ? (
                <div className="space-y-3">
                  {highPriorityEmails.slice(0, 5).map((email) => (
                    <div
                      key={email.id}
                      className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {email.subject}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          From: {email.from}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {email.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No high priority emails at the moment.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent emails */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <EnvelopeIcon className="h-6 w-6 text-gray-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Recent Emails</h3>
            </div>
          </div>
          <div className="mt-4">
            {recentEmails && recentEmails.length > 0 ? (
              <EmailList emails={recentEmails.slice(0, 10)} showPagination={false} />
            ) : (
              <p className="text-sm text-gray-500">No emails found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
