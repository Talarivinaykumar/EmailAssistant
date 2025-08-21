import axios, { AxiosResponse } from 'axios';
import {
  Email,
  EmailRequest,
  AiReplyRequest,
  AiReplyResponse,
  Team,
  User,
  EmailStatistics,
  EmailStatus,
  Priority
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to convert EmailResponse to Email
const convertEmailResponseToEmail = (emailResponse: any): Email => ({
  id: emailResponse.id,
  messageId: emailResponse.messageId,
  from: emailResponse.from,
  to: emailResponse.to,
  subject: emailResponse.subject,
  body: emailResponse.body,
  status: emailResponse.status,
  intent: emailResponse.intent,
  intentConfidence: emailResponse.intentConfidence,
  assignedTeam: emailResponse.assignedTeam,
  assignedUser: emailResponse.assignedUser,
  priority: emailResponse.priority,
  receivedAt: emailResponse.receivedAt,
  processedAt: emailResponse.processedAt,
  aiGeneratedReply: emailResponse.aiGeneratedReply,
  finalReply: emailResponse.finalReply,
  metadata: emailResponse.metadata
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Email APIs
export const emailApi = {
  // Process incoming email
  processIncomingEmail: (request: EmailRequest): Promise<Email> => {
    return api.post('/emails', request).then((response: AxiosResponse<any>) => 
      convertEmailResponseToEmail(response.data)
    );
  },

  // Get all emails with optional filtering
  getAllEmails: (params?: {
    status?: string;
    team?: string;
    user?: string;
    intent?: string;
  }): Promise<Email[]> => {
    return api.get('/emails', { params }).then((response: AxiosResponse<any[]>) => 
      response.data.map(convertEmailResponseToEmail)
    );
  },

  // Get email by ID
  getEmailById: (id: string): Promise<Email> => {
    return api.get(`/emails/${id}`).then((response: AxiosResponse<any>) => 
      convertEmailResponseToEmail(response.data)
    );
  },

  // Get emails by status
  getEmailsByStatus: (status: EmailStatus): Promise<Email[]> => {
    return api.get(`/emails/status/${status}`).then((response: AxiosResponse<any[]>) => 
      response.data.map(convertEmailResponseToEmail)
    );
  },

  // Get emails by team
  getEmailsByTeam: (teamId: string): Promise<Email[]> => {
    return api.get(`/emails/team/${teamId}`).then((response: AxiosResponse<any[]>) => 
      response.data.map(convertEmailResponseToEmail)
    );
  },

  // Get emails by user
  getEmailsByUser: (userId: string): Promise<Email[]> => {
    return api.get(`/emails/user/${userId}`).then((response: AxiosResponse<any[]>) => 
      response.data.map(convertEmailResponseToEmail)
    );
  },

  // Get high priority pending emails
  getHighPriorityPendingEmails: (): Promise<Email[]> => {
    return api.get('/emails/priority/high').then((response: AxiosResponse<any[]>) => 
      response.data.map(convertEmailResponseToEmail)
    );
  },

  // Assign email to team
  assignEmailToTeam: (emailId: string, teamId: string): Promise<Email> => {
    return api.put(`/emails/${emailId}/assign/team/${teamId}`).then((response: AxiosResponse<any>) => 
      convertEmailResponseToEmail(response.data)
    );
  },

  // Assign email to user
  assignEmailToUser: (emailId: string, userId: string): Promise<Email> => {
    return api.put(`/emails/${emailId}/assign/user/${userId}`).then((response: AxiosResponse<any>) => 
      convertEmailResponseToEmail(response.data)
    );
  },

  // Update email status
  updateEmailStatus: (emailId: string, status: EmailStatus): Promise<Email> => {
    return api.put(`/emails/${emailId}/status/${status}`).then((response: AxiosResponse<any>) => 
      convertEmailResponseToEmail(response.data)
    );
  },

  // Update email priority
  updateEmailPriority: (emailId: string, priority: Priority): Promise<Email> => {
    return api.put(`/emails/${emailId}/priority/${priority}`).then((response: AxiosResponse<any>) => 
      convertEmailResponseToEmail(response.data)
    );
  },

  // Add note to email
  addNoteToEmail: (emailId: string, note: string, userId?: string): Promise<Email> => {
    return api.post(`/emails/${emailId}/notes`, note, {
      params: { userId: userId || 'system' }
    }).then((response: AxiosResponse<any>) => 
      convertEmailResponseToEmail(response.data)
    );
  },

  // Create new email
  createEmail: (emailRequest: EmailRequest): Promise<Email> => {
    return api.post('/emails', emailRequest).then((response: AxiosResponse<any>) => 
      convertEmailResponseToEmail(response.data)
    );
  },

  // Send reply to email
  sendReply: (emailId: string, reply: string, userId?: string): Promise<Email> => {
    return api.post(`/emails/${emailId}/reply`, reply, {
      params: { userId: userId || 'system' }
    }).then((response: AxiosResponse<any>) => 
      convertEmailResponseToEmail(response.data)
    );
  },

  // Generate AI reply
  generateAiReply: (request: AiReplyRequest): Promise<AiReplyResponse> => {
    return api.post('/emails/ai/reply', request).then((response: AxiosResponse<AiReplyResponse>) => response.data);
  },

  // Get email statistics
  getEmailStatistics: (): Promise<EmailStatistics> => {
    return api.get('/emails/statistics').then((response: AxiosResponse<EmailStatistics>) => response.data);
  },
};

// Team APIs
export const teamApi = {
  // Get all teams
  getAllTeams: (): Promise<Team[]> => {
    return api.get('/teams').then((response: AxiosResponse<Team[]>) => response.data);
  },

  // Get team by ID
  getTeamById: (id: string): Promise<Team> => {
    return api.get(`/teams/${id}`).then((response: AxiosResponse<Team>) => response.data);
  },

  // Get team by name
  getTeamByName: (name: string): Promise<Team> => {
    return api.get(`/teams/name/${name}`).then((response: AxiosResponse<Team>) => response.data);
  },

  // Get teams by status
  getTeamsByStatus: (status: string): Promise<Team[]> => {
    return api.get(`/teams/status/${status}`).then((response: AxiosResponse<Team[]>) => response.data);
  },

  // Get teams by manager
  getTeamsByManager: (managerId: string): Promise<Team[]> => {
    return api.get(`/teams/manager/${managerId}`).then((response: AxiosResponse<Team[]>) => response.data);
  },

  // Get teams by member
  getTeamsByMember: (memberId: string): Promise<Team[]> => {
    return api.get(`/teams/member/${memberId}`).then((response: AxiosResponse<Team[]>) => response.data);
  },

  // Create team
  createTeam: (team: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>): Promise<Team> => {
    return api.post('/teams', team).then((response: AxiosResponse<Team>) => response.data);
  },

  // Update team
  updateTeam: (id: string, team: Partial<Team>): Promise<Team> => {
    return api.put(`/teams/${id}`, team).then((response: AxiosResponse<Team>) => response.data);
  },

  // Delete team
  deleteTeam: (id: string): Promise<void> => {
    return api.delete(`/teams/${id}`).then(() => {});
  },

  // Get assignment rules
  getAssignmentRules: (): Promise<Record<string, string>> => {
    return api.get('/teams/assignment-rules').then((response: AxiosResponse<Record<string, string>>) => response.data);
  },

  // Update assignment rule
  updateAssignmentRule: (intent: string, teamName: string): Promise<void> => {
    return api.put(`/teams/assignment-rules/${intent}`, null, {
      params: { teamName }
    }).then(() => {});
  },
};

// User APIs (placeholder - would be implemented based on backend)
export const userApi = {
  // Get current user
  getCurrentUser: (): Promise<User> => {
    return api.get('/users/me').then((response: AxiosResponse<User>) => response.data);
  },

  // Get all users
  getAllUsers: (): Promise<User[]> => {
    return api.get('/users').then((response: AxiosResponse<User[]>) => response.data);
  },

  // Get user by ID
  getUserById: (id: string): Promise<User> => {
    return api.get(`/users/${id}`).then((response: AxiosResponse<User>) => response.data);
  },

  getStatistics: async () => {
    const res = await axios.get('/api/admin/statistics');
    return res.data;
  },
};

export default api;
