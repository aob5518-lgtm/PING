import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { Conversation, Group, Message, User } from '@/types';
import { currentUser as mockCurrentUser, initialConversations, initialMessages, people } from '@/data/mock';
import { useI18n } from '@/features/i18n-context';
import { createId } from '@/utils/create-id';
import { warnStorage } from '@/utils/storage-warning';

const STORAGE = {
  identity: '@ping/identity',
  conversations: '@ping/conversations',
  messages: '@ping/messages',
  groups: '@ping/groups',
  privacy: '@ping/privacy',
  blockedUsers: '@ping/blocked-users',
} as const;

export type PrivacySettings = { messageRequests: boolean; readReceipts: boolean };
type ProfileChanges = Partial<Pick<User, 'displayName' | 'username' | 'bio' | 'avatar' | 'interests' | 'lookingFor'>>;

type AppContextValue = {
  hydrated: boolean;
  hasIdentity: boolean;
  currentUser: User;
  people: User[];
  conversations: Conversation[];
  messages: Message[];
  groups: Group[];
  privacy: PrivacySettings;
  blockedUserIds: string[];
  createIdentity: (name: string, username: string) => void;
  updateProfile: (values: ProfileChanges) => void;
  sendMessage: (conversationId: string, content: string, type?: Message['type'], replyTo?: string) => void;
  ensureDirectConversation: (userId: string) => string | null;
  createGroup: (name: string, memberIds: string[]) => string;
  setPrivacy: (values: Partial<PrivacySettings>) => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  isBlocked: (userId: string) => boolean;
};

const AppContext = createContext<AppContextValue>(undefined as unknown as AppContextValue);
const sortConversations = (items: Conversation[]) => [...items].sort((a, b) => b.updatedAt - a.updatedAt);
const parseStored = <T,>(key: string, value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try { return JSON.parse(value) as T; } catch (error) {
    warnStorage(`Could not parse ${key}; using defaults.`, error);
    return fallback;
  }
};

export function AppProvider({ children }: PropsWithChildren) {
  const { t } = useI18n();
  const [hydrated, setHydrated] = useState(false);
  const [hasIdentity, setHasIdentity] = useState(false);
  const [currentUser, setCurrentUser] = useState(mockCurrentUser);
  const [conversations, setConversations] = useState(() => sortConversations(initialConversations));
  const [messages, setMessages] = useState(initialMessages);
  const [groups, setGroups] = useState<Group[]>([]);
  const [privacy, setPrivacyState] = useState<PrivacySettings>({ messageRequests: true, readReceipts: true });
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.multiGet(Object.values(STORAGE)).then(entries => {
      const stored = Object.fromEntries(entries);
      const storedIdentity = stored[STORAGE.identity];
      if (storedIdentity) {
        const identity = parseStored(STORAGE.identity, storedIdentity, { hasIdentity: false, profile: mockCurrentUser });
        setHasIdentity(identity.hasIdentity);
        setCurrentUser(identity.profile);
      }
      const storedConversations = stored[STORAGE.conversations];
      const storedMessages = stored[STORAGE.messages];
      const storedGroups = stored[STORAGE.groups];
      const storedPrivacy = stored[STORAGE.privacy];
      const storedBlockedUsers = stored[STORAGE.blockedUsers];
      if (storedConversations) setConversations(sortConversations(parseStored<Conversation[]>(STORAGE.conversations, storedConversations, initialConversations)));
      if (storedMessages) setMessages(parseStored<Message[]>(STORAGE.messages, storedMessages, initialMessages));
      if (storedGroups) setGroups(parseStored<Group[]>(STORAGE.groups, storedGroups, []));
      if (storedPrivacy) setPrivacyState(parseStored<PrivacySettings>(STORAGE.privacy, storedPrivacy, { messageRequests: true, readReceipts: true }));
      if (storedBlockedUsers) setBlockedUserIds(parseStored<string[]>(STORAGE.blockedUsers, storedBlockedUsers, []));
    }).catch(error => warnStorage('Could not load local app data.', error)).finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.multiSet([
      [STORAGE.identity, JSON.stringify({ hasIdentity, profile: currentUser })],
      [STORAGE.conversations, JSON.stringify(conversations)],
      [STORAGE.messages, JSON.stringify(messages)],
      [STORAGE.groups, JSON.stringify(groups)],
      [STORAGE.privacy, JSON.stringify(privacy)],
      [STORAGE.blockedUsers, JSON.stringify(blockedUserIds)],
    ]).catch(error => warnStorage('Could not save local app data.', error));
  }, [hydrated, hasIdentity, currentUser, conversations, messages, groups, privacy, blockedUserIds]);

  const createIdentity = (displayName: string, rawUsername: string) => {
    setCurrentUser(user => ({ ...user, displayName, username: rawUsername.replace(/^@/, '').toLowerCase() }));
    setHasIdentity(true);
  };

  const updateProfile = (values: ProfileChanges) => setCurrentUser(user => ({ ...user, ...values }));

  const sendMessage = (conversationId: string, content: string, type: Message['type'] = 'text', replyTo?: string) => {
    const clean = content.trim();
    const conversation = conversations.find(item => item.id === conversationId);
    const blockedDirectUser = conversation?.type === 'direct' && conversation.participantIds.some(id => id !== 'me' && blockedUserIds.includes(id));
    if (!clean || !conversation || blockedDirectUser) return;
    const timestamp = Date.now();
    setMessages(items => [...items, {
      id: createId('message'), conversationId, senderId: 'me', type,
      content: clean, createdAt: timestamp, status: 'sent', replyTo,
    }]);
    setConversations(items => sortConversations(items.map(item => item.id === conversationId ? {
      ...item, lastMessage: type === 'text' ? clean : type === 'image' ? 'Photo' : 'File',
      updatedAt: timestamp, unreadCount: 0,
    } : item)));
  };

  const ensureDirectConversation = (userId: string) => {
    if (blockedUserIds.includes(userId)) return null;
    const existing = conversations.find(item => item.type === 'direct' && item.participantIds.includes(userId));
    if (existing) return existing.id;
    const user = people.find(item => item.id === userId);
    if (!user) return null;
    const id = createId('conversation');
    const timestamp = Date.now();
    setConversations(items => sortConversations([{
      id, type: 'direct', title: user.displayName, avatar: user.avatar,
      participantIds: ['me', userId], lastMessage: t('chats.start'),
      updatedAt: timestamp, unreadCount: 0,
    }, ...items]));
    return id;
  };

  const createGroup = (name: string, memberIds: string[]) => {
    const timestamp = Date.now();
    const id = createId('group');
    const group: Group = { id, name, avatar: name.slice(0, 2), memberIds: ['me', ...memberIds], ownerId: 'me' };
    setGroups(items => [...items, group]);
    setConversations(items => sortConversations([{
      id, type: 'group', title: name, avatar: group.avatar,
      participantIds: group.memberIds, lastMessage: t('chats.groupCreated'),
      updatedAt: timestamp, unreadCount: 0,
    }, ...items]));
    return id;
  };

  const setPrivacy = (values: Partial<PrivacySettings>) => setPrivacyState(current => ({ ...current, ...values }));
  const blockUser = (userId: string) => {
    if (!people.some(user => user.id === userId)) return;
    setBlockedUserIds(ids => ids.includes(userId) ? ids : [...ids, userId]);
  };
  const unblockUser = (userId: string) => setBlockedUserIds(ids => ids.filter(id => id !== userId));
  const isBlocked = (userId: string) => blockedUserIds.includes(userId);

  const value = useMemo(() => ({
    hydrated, hasIdentity, currentUser, people, conversations, messages, groups, privacy, blockedUserIds,
    createIdentity, updateProfile, sendMessage, ensureDirectConversation, createGroup, setPrivacy, blockUser, unblockUser, isBlocked,
  }), [hydrated, hasIdentity, currentUser, conversations, messages, groups, privacy, blockedUserIds, t]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
