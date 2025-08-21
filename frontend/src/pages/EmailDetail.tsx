import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeftIcon,
  UserGroupIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  PaperAirplaneIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { emailApi } from '../services/api';
import { EmailStatus, Priority } from '../types';
import AiReplyGenerator from '../components/AiReplyGenerator';
import ReplyComposer from '../components/ReplyComposer';
import { teamApi } from '../services/api';

const EmailDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showAiReply, setShowAiReply] = useState(false);
  const [showReplyComposer, setShowReplyComposer] = useState(false);

  // Validate email ID - prevent fetching with invalid IDs
  const isValidEmailId = id && id !== 'new' && id !== 'undefined' && id.trim() !== '';

  const { data: email, isLoading, error } = useQuery({
    queryKey: ['email', id],
    queryFn: () => emailApi.getEmailById(id!),
    enabled: !!isValidEmailId,
  });

  const { data: teams } = useQuery({
    queryKey: ['teams'],
    queryFn: teamApi.getAllTeams,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ emailId, status }: { emailId: string; status: EmailStatus }) =>
      emailApi.updateEmailStatus(emailId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email', id] });
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    },
  });

  const updatePriorityMutation = useMutation({
    mutationFn: ({ emailId, priority }: { emailId: string; priority: Priority }) =>
      emailApi.updateEmailPriority(emailId, priority),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email', id] });
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    },
  });

  // Removed unused mutations

  if (isLoading && isValidEmailId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !email) {
    // Check if it's an invalid ID error
    if (!isValidEmailId) {
      return (
        <div className="text-center py-8">
          <div className="max-w-md mx-auto">
            <div className="text-red-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Invalid Email ID</h3>
            <p className="text-gray-600 mb-4">
              The email ID "{id}" is not valid. Please check the URL or navigate to a valid email.
            </p>
            <button
              onClick={() => navigate('/emails')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Back to Emails
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading email. Please try again.</p>
        <button
          onClick={() => navigate('/emails')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Back to Emails
        </button>
      </div>
    );
  }

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
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/emails')}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{email.subject}</h1>
            <p className="text-sm text-gray-500">From: {email.from}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(email.status)}`}>
            {email.status.replace('_', ' ')}
          </span>
          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(email.priority)}`}>
            {email.priority}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Email content */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Email Content</h3>
            </div>
            <div className="px-6 py-4">
              <div className="prose max-w-none">
                <div className="mb-4">
                  <strong>Subject:</strong> {email.subject}
                </div>
                <div className="mb-4">
                  <strong>From:</strong> {email.from}
                </div>
                <div className="mb-4">
                  <strong>To:</strong> {email.to}
                </div>
                <div className="mb-4">
                  <strong>Received:</strong> {formatDate(email.receivedAt)}
                </div>
                <div className="mb-4">
                  <strong>Body:</strong>
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm">{email.body}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Generated Reply */}
          {email.aiGeneratedReply && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">AI Generated Reply</h3>
              </div>
              <div className="px-6 py-4">
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-sm bg-blue-50 p-4 rounded-lg">{email.aiGeneratedReply}</pre>
                </div>
              </div>
            </div>
          )}

          {/* Final Reply */}
          {email.finalReply && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Final Reply</h3>
              </div>
              <div className="px-6 py-4">
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-sm bg-green-50 p-4 rounded-lg">{email.finalReply}</pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Email metadata */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Email Details</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Intent</label>
                <p className="mt-1 text-sm text-gray-900">{email.intent.replace('_', ' ')}</p>
                {email.intentConfidence && (
                  <p className="text-xs text-gray-500">{Math.round(email.intentConfidence * 100)}% confidence</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={email.status}
                  onChange={(e) => updateStatusMutation.mutate({ emailId: email.id, status: e.target.value as EmailStatus })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  {Object.values(EmailStatus).map((status) => (
                    <option key={status} value={status}>
                      {status.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <select
                  value={email.priority}
                  onChange={(e) => updatePriorityMutation.mutate({ emailId: email.id, priority: e.target.value as Priority })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  {Object.values(Priority).map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>

                             <div>
                 <label className="block text-sm font-medium text-gray-700">Assigned Team</label>
                 <select
                   value={email.assignedTeam || ''}
                   onChange={(e) => {
                     if (e.target.value) {
                       emailApi.assignEmailToTeam(email.id, e.target.value);
                       queryClient.invalidateQueries({ queryKey: ['email', id] });
                       queryClient.invalidateQueries({ queryKey: ['emails'] });
                     }
                   }}
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                 >
                   <option value="">Unassigned</option>
                   {teams?.map((team) => (
                     <option key={team.id} value={team.id}>
                       {team.name}
                     </option>
                   ))}
                 </select>
               </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Assigned User</label>
                <div className="mt-1 flex items-center">
                  <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900">{email.assignedUser || 'Unassigned'}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Received</label>
                <div className="mt-1 flex items-center">
                  <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900">{formatDate(email.receivedAt)}</span>
                </div>
              </div>

              {email.processedAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Processed</label>
                  <div className="mt-1 flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{formatDate(email.processedAt)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Email Actions</h3>
            </div>
            <div className="px-6 py-4 space-y-3">
              {/* AI Reply Generation */}
              <button
                onClick={() => setShowAiReply(true)}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <DocumentTextIcon className="h-4 w-4 mr-2" />
                Generate AI Reply
              </button>
              
              {/* Manual Reply Composition */}
              <button
                onClick={() => setShowReplyComposer(true)}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                Compose Reply
              </button>

              {/* Quick Actions */}
              <div className="pt-3 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateStatusMutation.mutate({ emailId: email.id, status: EmailStatus.ASSIGNED })}
                    className="flex justify-center py-2 px-3 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Assign
                  </button>
                  <button
                    onClick={() => updateStatusMutation.mutate({ emailId: email.id, status: EmailStatus.ESCALATED })}
                    className="flex justify-center py-2 px-3 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Escalate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Reply Generator Modal */}
      {showAiReply && (
        <AiReplyGenerator
          emailId={email.id}
          onClose={() => setShowAiReply(false)}
        />
      )}

      {/* Reply Composer Modal */}
      {showReplyComposer && (
        <ReplyComposer
          emailId={email.id}
          originalEmail={{
            from: email.from,
            subject: email.subject,
            body: email.body
          }}
          onClose={() => setShowReplyComposer(false)}
          onReplySent={() => {
            queryClient.invalidateQueries({ queryKey: ['email', id] });
            queryClient.invalidateQueries({ queryKey: ['emails'] });
          }}
        />
      )}
    </div>
  );
};

export default EmailDetail;
