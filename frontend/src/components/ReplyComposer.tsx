import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { XMarkIcon, PaperAirplaneIcon, DocumentTextIcon, ClockIcon } from '@heroicons/react/24/outline';
import { emailApi } from '../services/api';

interface ReplyComposerProps {
  emailId: string;
  originalEmail: {
    from: string;
    subject: string;
    body?: string;
  };
  onClose: () => void;
  onReplySent?: () => void;
}

const ReplyComposer: React.FC<ReplyComposerProps> = ({ emailId, originalEmail, onClose, onReplySent }) => {
  const [replyContent, setReplyContent] = useState('');
  const [subject, setSubject] = useState(`Re: ${originalEmail.subject}`);
  const [isSending, setIsSending] = useState(false);

  const sendReplyMutation = useMutation({
    mutationFn: (data: { emailId: string; reply: string }) => 
      emailApi.sendReply(data.emailId, data.reply, 'current-user'),
    onSuccess: () => {
      setIsSending(false);
      onReplySent?.();
      onClose();
    },
    onError: (error) => {
      setIsSending(false);
      console.error('Error sending reply:', error);
      alert('Failed to send reply. Please try again.');
    }
  });

  const handleSendReply = () => {
    if (!replyContent.trim()) {
      alert('Please enter a reply message.');
      return;
    }
    
    setIsSending(true);
    sendReplyMutation.mutate({
      emailId,
      reply: replyContent
    });
  };

  const emailTemplates = [
    {
      name: 'Thank You',
      content: 'Thank you for contacting us. We appreciate your patience and will get back to you shortly.'
    },
    {
      name: 'Under Review',
      content: 'We have received your request and it is currently under review. We will provide you with an update as soon as possible.'
    },
    {
      name: 'Escalation',
      content: 'I understand your concern and I am escalating this matter to our senior support team. You will receive a response within 24 hours.'
    },
    {
      name: 'Resolution',
      content: 'I am pleased to inform you that we have resolved your issue. Please let us know if you need any further assistance.'
    }
  ];

  const applyTemplate = (template: string) => {
    setReplyContent(template);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <PaperAirplaneIcon className="h-6 w-6 text-primary-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Compose Reply</h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Original Email Preview */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Original Email</h4>
                <div className="text-sm text-gray-600">
                  <p><strong>From:</strong> {originalEmail.from}</p>
                  <p><strong>Subject:</strong> {originalEmail.subject}</p>
                  {originalEmail.body && (
                    <p><strong>Content:</strong> {originalEmail.body.substring(0, 100)}...</p>
                  )}
                </div>
              </div>

              {/* Reply Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Enter subject..."
                />
              </div>

              {/* Email Templates */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Templates
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {emailTemplates.map((template, index) => (
                    <button
                      key={index}
                      onClick={() => applyTemplate(template.content)}
                      className="flex items-center p-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <DocumentTextIcon className="h-4 w-4 text-gray-400 mr-2" />
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reply Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reply Message
                </label>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={8}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Type your reply here..."
                />
              </div>

              {/* Character Count */}
              <div className="text-right text-sm text-gray-500">
                {replyContent.length} characters
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSendReply}
              disabled={isSending || !replyContent.trim()}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <ClockIcon className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                  Send Reply
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplyComposer;
