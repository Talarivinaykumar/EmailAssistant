import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeftIcon,
  PaperAirplaneIcon,
  ClockIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { emailApi } from '../services/api';

const NewEmail: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSending, setIsSending] = useState(false);
  const [emailData, setEmailData] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
  });

  const createEmailMutation = useMutation({
    mutationFn: (data: {
      to: string;
      cc?: string;
      bcc?: string;
      subject: string;
      body: string;
    }) =>
      emailApi.createEmail({
        from: 'support@company.com', // Default sender
        to: data.to,
        cc: data.cc,
        bcc: data.bcc,
        subject: data.subject,
        body: data.body,
      }),
    onSuccess: () => {
      setIsSending(false);
      queryClient.invalidateQueries({ queryKey: ['emails'] });
      alert('Email created successfully!');
      navigate('/emails');
    },
    onError: (error) => {
      setIsSending(false);
      console.error('Error creating email:', error);
      alert('Failed to create email. Please try again.');
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEmailData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailData.to || !emailData.subject || !emailData.body) {
      alert('Please fill in all required fields.');
      return;
    }
    setIsSending(true);
    createEmailMutation.mutate(emailData);
  };

  const handleCancel = () => {
    navigate('/emails');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCancel}
            className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Compose New Email</h1>
            <p className="text-sm text-gray-600">
              Create and send a new email to your recipients
            </p>
          </div>
        </div>
      </div>

      {/* Email Form */}
      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Recipients */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-2">
                To <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="to"
                name="to"
                value={emailData.to}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="recipient@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="cc" className="block text-sm font-medium text-gray-700 mb-2">
                CC
              </label>
              <input
                type="email"
                id="cc"
                name="cc"
                value={emailData.cc}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="cc@example.com"
              />
            </div>
            <div>
              <label htmlFor="bcc" className="block text-sm font-medium text-gray-700 mb-2">
                BCC
              </label>
              <input
                type="email"
                id="bcc"
                name="bcc"
                value={emailData.bcc}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="bcc@example.com"
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={emailData.subject}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Enter email subject"
              required
            />
          </div>

          {/* Body */}
          <div>
            <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="body"
              name="body"
              rows={12}
              value={emailData.body}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Type your email message here..."
              required
            />
          </div>

          {/* Character Count */}
          <div className="text-right text-sm text-gray-500">
            {emailData.body.length} characters
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <ClockIcon className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                  Create Email
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewEmail;
