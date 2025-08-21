
import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { XMarkIcon, SparklesIcon, PaperAirplaneIcon, DocumentTextIcon, ClockIcon } from '@heroicons/react/24/outline';
import { emailApi } from '../services/api';
import { AiReplyRequest, FeedbackItem } from '../types';

interface AiReplyGeneratorProps {
  emailId: string;
  onClose: () => void;
  onReplySent?: () => void; // parent callback
}

const AiReplyGenerator: React.FC<AiReplyGeneratorProps> = ({ emailId, onClose, onReplySent }) => {
  const queryClient = useQueryClient();

  const [request, setRequest] = useState<Partial<AiReplyRequest>>({
    emailId,
    tone: 'professional',
    style: 'detailed',
    includeToneFeedback: true,
    includeClarityFeedback: true,
  });

  const [subject, setSubject] = useState(`Re: Your Email`);
  const [replyContent, setReplyContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Load draft from localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem(`draft-${emailId}`);
    if (savedDraft) {
      const { subject, replyContent } = JSON.parse(savedDraft);
      setSubject(subject || `Re: Your Email`);
      setReplyContent(replyContent || '');
    }
  }, [emailId]);

  // Save draft
  useEffect(() => {
    localStorage.setItem(`draft-${emailId}`, JSON.stringify({ subject, replyContent }));
  }, [emailId, subject, replyContent]);

  const generateReplyMutation = useMutation({
    mutationFn: (request: AiReplyRequest) => emailApi.generateAiReply(request),
    onSuccess: (data) => {
      setReplyContent(data.generatedReply || '');
    },
  });

  const sendReplyMutation = useMutation({
    mutationFn: (data: { emailId: string; reply: string }) =>
      emailApi.sendReply(data.emailId, data.reply, 'current-user'),
    onSuccess: () => {
      setIsSending(false);
      localStorage.removeItem(`draft-${emailId}`); // ✅ clear draft after sending

      // ✅ Refresh parent data immediately
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      queryClient.invalidateQueries({ queryKey: ['email', emailId] });

      onReplySent?.();
      onClose();
    },
    onError: (error) => {
      setIsSending(false);
      console.error('Error sending reply:', error);
      alert('Failed to send reply. Please try again.');
    }
  });

  const handleGenerate = () => {
    if (request.emailId) {
      generateReplyMutation.mutate(request as AiReplyRequest);
    }
  };

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
    { name: 'Thank You', content: 'Thank you for contacting us. We appreciate your patience and will get back to you shortly.' },
    { name: 'Under Review', content: 'We have received your request and it is currently under review. We will provide you with an update as soon as possible.' },
    { name: 'Escalation', content: 'I understand your concern and I am escalating this matter to our senior support team. You will receive a response within 24 hours.' },
    { name: 'Resolution', content: 'I am pleased to inform you that we have resolved your issue. Please let us know if you need any further assistance.' }
  ];

  const applyTemplate = (template: string) => {
    setReplyContent(template);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <SparklesIcon className="h-6 w-6 text-primary-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Generate AI Reply</h3>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* AI Config */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                <select
                  value={request.tone}
                  onChange={(e) => setRequest({ ...request, tone: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="formal">Formal</option>
                  <option value="casual">Casual</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
                <select
                  value={request.style}
                  onChange={(e) => setRequest({ ...request, style: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="concise">Concise</option>
                  <option value="detailed">Detailed</option>
                  <option value="empathetic">Empathetic</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Context</label>
                <textarea
                  value={request.additionalContext || ''}
                  onChange={(e) => setRequest({ ...request, additionalContext: e.target.value })}
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Generated Reply Section */}
          {generateReplyMutation.data && (
            <div className="bg-gray-50 px-4 py-4 sm:px-6 space-y-4">
              {/* Feedback */}
              {(generateReplyMutation.data.toneFeedback.length > 0 || generateReplyMutation.data.clarityFeedback.length > 0) && (
                <div className="space-y-4">
                  {generateReplyMutation.data.toneFeedback.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Tone Feedback</h5>
                      {generateReplyMutation.data.toneFeedback.map((fb: FeedbackItem, idx: number) => (
                        <div key={idx} className={`p-3 rounded-lg border ${getSeverityColor(fb.severity)}`}>
                          <p className="text-sm font-medium">{fb.category}</p>
                          <p className="text-sm mt-1">{fb.suggestion}</p>
                          <p className="text-xs mt-1 opacity-75">{fb.reason}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {generateReplyMutation.data.clarityFeedback.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Clarity Feedback</h5>
                      {generateReplyMutation.data.clarityFeedback.map((fb: FeedbackItem, idx: number) => (
                        <div key={idx} className={`p-3 rounded-lg border ${getSeverityColor(fb.severity)}`}>
                          <p className="text-sm font-medium">{fb.category}</p>
                          <p className="text-sm mt-1">{fb.suggestion}</p>
                          <p className="text-xs mt-1 opacity-75">{fb.reason}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              {/* Templates */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quick Templates</label>
                <div className="grid grid-cols-2 gap-2">
                  {emailTemplates.map((template, index) => (
                    <button
                      key={index}
                      onClick={() => applyTemplate(template.content)}
                      className="flex items-center p-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <DocumentTextIcon className="h-4 w-4 text-gray-400 mr-2" />
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reply Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reply Message</label>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={8}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>

              <div className="text-right text-sm text-gray-500">{replyContent.length} characters</div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {generateReplyMutation.data ? (
              <button
                type="button"
                onClick={handleSendReply}
                disabled={isSending || !replyContent.trim()}
                className="w-full inline-flex justify-center rounded-md shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <ClockIcon className="h-4 w-4 mr-2 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="h-4 w-4 mr-2" /> Send Reply
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerate}
                disabled={generateReplyMutation.isPending}
                className="w-full inline-flex justify-center rounded-md shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {generateReplyMutation.isPending ? 'Generating...' : 'Generate Reply'}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiReplyGenerator;

