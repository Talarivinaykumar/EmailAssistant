import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';

const NewEmailButton: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/emails/new');
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
    >
      <PlusIcon className="h-4 w-4 mr-2" />
      New Email
    </button>
  );
};

export default NewEmailButton;
