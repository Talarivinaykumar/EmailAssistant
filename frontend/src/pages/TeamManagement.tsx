import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { teamApi } from '../services/api';
import { Team, TeamStatus } from '../types';

const TeamManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const { data: teams, isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: teamApi.getAllTeams,
  });

  const { data: assignmentRules } = useQuery({
    queryKey: ['assignmentRules'],
    queryFn: teamApi.getAssignmentRules,
  });

  const createTeamMutation = useMutation({
    mutationFn: teamApi.createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      setShowCreateModal(false);
    },
  });

  const updateTeamMutation = useMutation({
    mutationFn: ({ id, team }: { id: string; team: Partial<Team> }) => teamApi.updateTeam(id, team),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      setEditingTeam(null);
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: teamApi.deleteTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });

  const updateAssignmentRuleMutation = useMutation({
    mutationFn: ({ intent, teamName }: { intent: string; teamName: string }) =>
      teamApi.updateAssignmentRule(intent, teamName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignmentRules'] });
    },
  });

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage teams and assignment rules
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Team
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teams List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Teams</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {teams?.map((team) => (
              <div key={team.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{team.name}</h4>
                    <p className="text-sm text-gray-500">{team.description}</p>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        team.status === TeamStatus.ACTIVE ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {team.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {team.memberIds?.length || 0} members
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingTeam(team)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteTeamMutation.mutate(team.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assignment Rules */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Assignment Rules</h3>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              {assignmentRules && Object.entries(assignmentRules).map(([intent, teamName]) => (
                <div key={intent} className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {intent.replace('_', ' ')}
                    </label>
                  </div>
                  <select
                    value={teamName}
                    onChange={(e) => updateAssignmentRuleMutation.mutate({ intent, teamName: e.target.value })}
                    className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    {teams?.map((team) => (
                      <option key={team.id} value={team.name}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Team Modal */}
      {(showCreateModal || editingTeam) && (
        <TeamModal
          team={editingTeam}
          onClose={() => {
            setShowCreateModal(false);
            setEditingTeam(null);
          }}
          onSubmit={(teamData) => {
            if (editingTeam) {
              updateTeamMutation.mutate({ id: editingTeam.id, team: teamData });
            } else {
              // Ensure required fields are present for creation
              if (teamData.name) {
                createTeamMutation.mutate({
                  name: teamData.name,
                  description: teamData.description || '',
                  status: teamData.status || TeamStatus.ACTIVE,
                  memberIds: [],
                  handledIntents: []
                });
              }
            }
          }}
        />
      )}
    </div>
  );
};

// Team Modal Component
interface TeamModalProps {
  team?: Team | null;
  onClose: () => void;
  onSubmit: (teamData: Partial<Team>) => void;
}

const TeamModal: React.FC<TeamModalProps> = ({ team, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: team?.name || '',
    description: team?.description || '',
    status: team?.status || TeamStatus.ACTIVE,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {team ? 'Edit Team' : 'Create Team'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as TeamStatus })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    {Object.values(TeamStatus).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {team ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;
