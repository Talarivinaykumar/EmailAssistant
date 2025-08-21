export interface Email {
  id: string;
  messageId: string;
  from: string;
  to: string;
  subject: string;
  body?: string;
  status: EmailStatus;
  intent: EmailIntent;
  intentConfidence: number;
  assignedTeam?: string;
  assignedUser?: string;
  priority: Priority;
  receivedAt: string;
  processedAt?: string;
  aiGeneratedReply?: string;
  finalReply?: string;
  metadata?: EmailMetadata;
}

export interface EmailMetadata {
  language?: string;
  sentiment?: string;
  sentimentScore?: number;
  urgency?: string;
  customerTier?: string;
  processingTime?: string;
}

export interface EmailRequest {
  from: string;
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
  htmlBody?: string;
  attachments?: string[];
  messageId?: string;
}

export interface AiReplyRequest {
  emailId: string;
  tone?: string;
  style?: string;
  additionalContext?: string;
  includeToneFeedback?: boolean;
  includeClarityFeedback?: boolean;
}

export interface AiReplyResponse {
  emailId: string;
  generatedReply: string;
  tone: string;
  style: string;
  toneFeedback: FeedbackItem[];
  clarityFeedback: FeedbackItem[];
  confidenceScore: number;
  modelUsed: string;
  processingTimeMs: number;
}

export interface FeedbackItem {
  category: string;
  suggestion: string;
  reason: string;
  severity: 'low' | 'medium' | 'high';
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  memberIds: string[];
  handledIntents: EmailIntent[];
  status: TeamStatus;
  createdAt: string;
  updatedAt: string;
  totalEmailsHandled?: number;
  averageResponseTime?: number;
  customerSatisfactionScore?: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  teamIds: string[];
  expertise: EmailIntent[];
  createdAt: string;
  lastLoginAt?: string;
  totalEmailsHandled?: number;
  averageResponseTime?: number;
  customerSatisfactionScore?: number;
  currentWorkload?: number;
}

export interface EmailStatistics {
  totalEmails: number;
  pendingEmails: number;
  resolvedEmails: number;
  emailsByIntent: Record<EmailIntent, number>;
  emailsByStatus: Record<EmailStatus, number>;
  averageResponseTime: number;
  intentDistribution: Record<string, number>;
}

export enum EmailStatus {
  RECEIVED = 'RECEIVED',
  PROCESSING = 'PROCESSING',
  INTENT_DETECTED = 'INTENT_DETECTED',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESPONDED = 'RESPONDED',
  CLOSED = 'CLOSED',
  ESCALATED = 'ESCALATED'
}

export enum EmailIntent {
  REFUND_REQUEST = 'REFUND_REQUEST',
  BUG_REPORT = 'BUG_REPORT',
  FEATURE_INQUIRY = 'FEATURE_INQUIRY',
  GENERAL_SUPPORT = 'GENERAL_SUPPORT',
  BILLING_ISSUE = 'BILLING_ISSUE',
  TECHNICAL_SUPPORT = 'TECHNICAL_SUPPORT',
  COMPLAINT = 'COMPLAINT',
  FEEDBACK = 'FEEDBACK',
  UNKNOWN = 'UNKNOWN'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export enum TeamStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  AGENT = 'AGENT',
  VIEWER = 'VIEWER'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BUSY = 'BUSY',
  OFFLINE = 'OFFLINE'
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
