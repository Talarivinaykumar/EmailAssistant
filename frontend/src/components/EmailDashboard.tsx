import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  EnvelopeIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  PaperAirplaneIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { emailApi } from '../services/api';
import { Email, EmailStatus, Priority } from '../types';

interface EmailDashboardProps {
  onEmailSelect?: (email: Email) => void;
}

const EmailDashboard: React.FC<EmailDashboardProps> = ({ onEmailSelect }) => {
  const navigate = useNavigate();
  // Removed unused state variables

  const { data: emails, isLoading } = useQuery({
    queryKey: ['emails'],
    queryFn: () => emailApi.getAllEmails(),
  });

  const { data: statistics } = useQuery({
    queryKey: ['email-statistics'],
    queryFn: emailApi.getEmailStatistics,
  });

  const getStatusCount = (status: EmailStatus) => {
    return emails?.filter(email => email.status === status).length || 0;
  };

  const getPriorityCount = (priority: Priority) => {
    return emails?.filter(email => email.priority === priority).length || 0;
  };

  const getStatusColor = (status: EmailStatus) => {
    switch (status) {
      case EmailStatus.RECEIVED:
        return 'bg-blue-100 text-blue-800';
      case EmailStatus.PROCESSING:
        return 'bg-yellow-100 text-yellow-800';
      case EmailStatus.ASSIGNED:
        return 'bg-orange-100 text-orange-800';
      case EmailStatus.IN_PROGRESS:
        return 'bg-purple-100 text-purple-800';
      case EmailStatus.RESPONDED:
        return 'bg-green-100 text-green-800';
      case EmailStatus.CLOSED:
        return 'bg-gray-100 text-gray-800';
      case EmailStatus.ESCALATED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.URGENT:
        return 'bg-red-100 text-red-800';
      case Priority.HIGH:
        return 'bg-orange-100 text-orange-800';
      case Priority.MEDIUM:
        return 'bg-yellow-100 text-yellow-800';
      case Priority.LOW:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <EnvelopeIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Emails</dt>
                  <dd className="text-lg font-medium text-gray-900">{statistics?.totalEmails || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                  <dd className="text-lg font-medium text-gray-900">{statistics?.pendingEmails || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Resolved</dt>
                  <dd className="text-lg font-medium text-gray-900">{statistics?.resolvedEmails || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">High Priority</dt>
                  <dd className="text-lg font-medium text-gray-900">{getPriorityCount(Priority.HIGH) + getPriorityCount(Priority.URGENT)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Status Distribution</h3>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-3">
              {Object.values(EmailStatus).map((status) => {
                const count = getStatusCount(status);
                if (count === 0) return null;
                
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                        {status.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Priority Distribution</h3>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-3">
              {Object.values(Priority).map((priority) => {
                const count = getPriorityCount(priority);
                if (count === 0) return null;
                
                return (
                  <div key={priority} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(priority)}`}>
                        {priority}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                );
              })}
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
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <button 
               onClick={() => navigate('/emails')}
               className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
             >
               <DocumentTextIcon className="h-8 w-8 text-primary-600 mb-2" />
               <span className="text-sm font-medium text-gray-900">View All Emails</span>
             </button>
             
             <button 
               onClick={() => navigate('/teams')}
               className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
             >
               <UserGroupIcon className="h-8 w-8 text-primary-600 mb-2" />
               <span className="text-sm font-medium text-gray-900">Manage Teams</span>
             </button>
             
             <button 
               onClick={() => navigate('/dashboard')}
               className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
             >
               <ChartBarIcon className="h-8 w-8 text-primary-600 mb-2" />
               <span className="text-sm font-medium text-gray-900">View Reports</span>
             </button>
             
             <button 
               onClick={() => navigate('/emails/new')}
               className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
             >
               <PaperAirplaneIcon className="h-8 w-8 text-primary-600 mb-2" />
               <span className="text-sm font-medium text-gray-900">New Email</span>
             </button>
           </div>
         </div>
       </div>

      {/* Recent Emails */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Emails</h3>
        </div>
        <div className="px-6 py-4">
          <div className="space-y-3">
            {emails?.slice(0, 5).map((email) => (
              <div 
                key={email.id} 
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                                 onClick={() => onEmailSelect?.(email)}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(email.status)}`}>
                      {email.status.replace('_', ' ')}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(email.priority)}`}>
                      {email.priority}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 mt-1">{email.subject}</h4>
                  <p className="text-sm text-gray-500">From: {email.from}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{new Date(email.receivedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailDashboard;
