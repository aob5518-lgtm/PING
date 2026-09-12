export type ConnectionStatus = 'UNKNOWN' | 'REQUESTED' | 'CONNECTED' | 'BLOCKED';

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  interests: string[];
  lookingFor: string[];
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  title: string;
  avatar: string;
  participantIds: string[];
  lastMessage: string;
  updatedAt: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  type: 'text' | 'image' | 'file';
  content: string;
  createdAt: string;
  status: 'sending' | 'sent' | 'read';
  replyTo?: string;
}

export interface Group {
  id: string;
  name: string;
  avatar: string;
  memberIds: string[];
  ownerId: string;
}

export interface RecommendedUser {
  user: User;
  reason: string;
  sharedInterests: string[];
  suggestedTopic: string;
}
