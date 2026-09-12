import React, { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';
import { Conversation, Message, User } from '@/types';
import { currentUser as mockCurrentUser, initialConversations, initialMessages, people } from '@/data/mock';

type ProfileChanges = { displayName?: string; bio?: string; avatar?: string };

type AppContextValue = {
  hasIdentity: boolean;
  currentUser: User;
  people: User[];
  conversations: Conversation[];
  messages: Message[];
  createIdentity: (name: string, username: string) => void;
  updateProfile: (values: ProfileChanges) => void;
  sendMessage: (conversationId: string, content: string, type?: Message['type'], replyTo?: string) => void;
  ensureDirectConversation: (userId: string) => string;
  createGroup: (name: string, memberIds: string[]) => string;
};

const AppContext = createContext<AppContextValue>(undefined as unknown as AppContextValue);

export function AppProvider({ children }: PropsWithChildren) {
  const [hasIdentity, setHasIdentity] = useState(false);
  const [currentUser, setCurrentUser] = useState(mockCurrentUser);
  const [conversations, setConversations] = useState(initialConversations);
  const [messages, setMessages] = useState(initialMessages);

  const createIdentity = (displayName: string, rawUsername: string) => {
    setCurrentUser(user => ({ ...user, displayName, username: rawUsername.replace(/^@/, '').toLowerCase() }));
    setHasIdentity(true);
  };

  const updateProfile = (values: ProfileChanges) => setCurrentUser(user => ({ ...user, ...values }));

  const sendMessage = (conversationId: string, content: string, type: Message['type'] = 'text', replyTo?: string) => {
    const clean = content.trim();
    if (!clean) return;
    const createdAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(items => [...items, {
      id: `message-${Date.now()}`, conversationId, senderId: 'me', type,
      content: clean, createdAt, status: 'sent', replyTo,
    }]);
    setConversations(items => items.map(item => item.id === conversationId ? {
      ...item, lastMessage: type === 'text' ? clean : type === 'image' ? 'Photo' : 'File',
      updatedAt: createdAt, unreadCount: 0,
    } : item));
  };

  const ensureDirectConversation = (userId: string) => {
    const existing = conversations.find(item => item.type === 'direct' && item.participantIds.includes(userId));
    if (existing) return existing.id;
    const user = people.find(item => item.id === userId);
    if (!user) return 'alice-chat';
    const id = `${userId}-chat`;
    setConversations(items => [{
      id, type: 'direct', title: user.displayName, avatar: user.avatar,
      participantIds: ['me', userId], lastMessage: 'Start a conversation',
      updatedAt: 'Now', unreadCount: 0,
    }, ...items]);
    return id;
  };

  const createGroup = (name: string, memberIds: string[]) => {
    const id = `group-${Date.now()}`;
    setConversations(items => [{
      id, type: 'group', title: name, avatar: name.slice(0, 2),
      participantIds: ['me', ...memberIds], lastMessage: 'Group created',
      updatedAt: 'Now', unreadCount: 0,
    }, ...items]);
    return id;
  };

  const value = useMemo(() => ({
    hasIdentity, currentUser, people, conversations, messages,
    createIdentity, updateProfile, sendMessage, ensureDirectConversation, createGroup,
  }), [hasIdentity, currentUser, conversations, messages]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
