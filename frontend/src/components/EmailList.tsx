import React from 'react';
import { Email, EmailStatus, Priority } from '../types';

interface EmailListProps {
  emails: Email[];
  showPagination?: boolean;
}

const EmailList: React.FC<EmailListProps> = ({ emails, showPagination = true }) => {
  const getStatusColor = (status: EmailStatus) => {
    switch (status) {
      case EmailStatus.RECEIVED:
        return 'bg-gray-100 text-gray-800';
      case EmailStatus.PROCESSING:
        return 'bg-blue-100 text-blue-800';
      case EmailStatus.ASSIGNED:
        return 'bg-yellow-100 text-yellow-800';
      case EmailStatus.IN_PROGRESS:
        return 'bg-orange-100 text-orange-800';
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
      case Priority.LOW:
        return 'bg-green-100 text-green-800';
      case Priority.MEDIUM:
        return 'bg-yellow-100 text-yellow-800';
      case Priority.HIGH:
        return 'bg-orange-100 text-orange-800';
      case Priority.URGENT:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!emails || emails.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-500">No emails found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                From
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Received
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Intent
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {emails.map((email) => (
              <tr
                key={email.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => window.location.href = `/emails/${email.id}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                    {email.from}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 truncate max-w-xs">
                    {email.subject}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(email.status)}`}>
                    {email.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(email.priority)}`}>
                    {email.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(email.receivedAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {email.intent.replace('_', ' ')}
                  </div>
                  {email.intentConfidence && (
                    <div className="text-xs text-gray-500">
                      {Math.round(email.intentConfidence * 100)}% confidence
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmailList;
