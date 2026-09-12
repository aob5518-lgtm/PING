import { Conversation, Message, RecommendedUser, User } from '@/types';

export const currentUser: User = {
  id: 'me', username: 'alex', displayName: 'Alex', avatar: 'A',
  bio: 'Building thoughtful tools for people.',
  interests: ['AI Agents', 'P2P', 'Open Source'],
  lookingFor: ['Developers', 'Designers', 'Founders'],
};

export const people: User[] = [
  { id: 'alice', username: 'alice', displayName: 'Alice Wu', avatar: 'AW', bio: 'Exploring new ways for people to gather online.', interests: ['Decentralized Social', 'AI', 'Startups'], lookingFor: ['Builders', 'Researchers'] },
  { id: 'mia', username: 'mia', displayName: 'Mia Park', avatar: 'MP', bio: 'Product designer making complex things feel calm.', interests: ['Design', 'AI', 'Products'], lookingFor: ['AI Founders', 'Creators'] },
  { id: 'sam', username: 'sam', displayName: 'Sam Rivera', avatar: 'SR', bio: 'Open source, privacy, and a quieter internet.', interests: ['Open Source', 'Privacy', 'P2P'], lookingFor: ['Maintainers', 'Developers'] },
  { id: 'david', username: 'david', displayName: 'David Kim', avatar: 'DK', bio: 'Engineer working on tools for small teams.', interests: ['Developer Tools', 'Local-first', 'Music'], lookingFor: ['Designers', 'Developers'] },
  { id: 'nora', username: 'nora', displayName: 'Nora Chen', avatar: 'NC', bio: 'Researching identity and trust on the internet.', interests: ['Identity', 'Research', 'Communities'], lookingFor: ['Researchers', 'Founders'] },
];

export const recommendations: RecommendedUser[] = [
  { user: people[0], reason: 'You both care about decentralized social.', sharedInterests: ['AI', 'Startups'], suggestedTopic: 'What would a calmer social internet look like?' },
  { user: people[1], reason: 'She is looking to meet AI founders.', sharedInterests: ['AI', 'Products'], suggestedTopic: 'How can AI products feel more human?' },
  { user: people[2], reason: 'You share 3 interests.', sharedInterests: ['Open Source', 'Privacy', 'P2P'], suggestedTopic: 'Should AI agents have their own identity?' },
  { user: people[4], reason: 'You are both exploring user-owned identity.', sharedInterests: ['Identity', 'Communities'], suggestedTopic: 'What does trust look like without real names?' },
];

const now = Date.now();
const minutesAgo = (minutes: number) => now - minutes * 60_000;
const daysAgo = (days: number) => now - days * 86_400_000;

export const initialConversations: Conversation[] = [
  { id: 'alice-chat', type: 'direct', title: 'Alice', avatar: 'AW', participantIds: ['me', 'alice'], lastMessage: 'Are you free tonight?', updatedAt: minutesAgo(8), unreadCount: 2 },
  { id: 'ai-builders', type: 'group', title: 'AI Builders', avatar: 'AI', participantIds: ['me', 'alice', 'mia', 'sam'], lastMessage: 'Jack: I think this approach could work.', updatedAt: minutesAgo(43), unreadCount: 0 },
  { id: 'david-chat', type: 'direct', title: 'David', avatar: 'DK', participantIds: ['me', 'david'], lastMessage: '👍', updatedAt: daysAgo(1), unreadCount: 0 },
];

export const initialMessages: Message[] = [
  { id: 'm1', conversationId: 'alice-chat', senderId: 'alice', type: 'text', content: 'Hey! I saw that you’re interested in decentralized social too.', createdAt: minutesAgo(12), status: 'read' },
  { id: 'm2', conversationId: 'alice-chat', senderId: 'me', type: 'text', content: 'Yes — especially products that hide the complexity.', createdAt: minutesAgo(10), status: 'read' },
  { id: 'm3', conversationId: 'alice-chat', senderId: 'alice', type: 'text', content: 'Are you free tonight?', createdAt: minutesAgo(8), status: 'read' },
  { id: 'm4', conversationId: 'alice-chat', senderId: 'alice', type: 'image', content: 'Shared image', createdAt: minutesAgo(8), status: 'read' },
  { id: 'g1', conversationId: 'ai-builders', senderId: 'mia', type: 'text', content: 'Could onboarding work without asking for email?', createdAt: minutesAgo(48), status: 'read' },
  { id: 'g2', conversationId: 'ai-builders', senderId: 'alice', type: 'text', content: 'I think this approach could work.', createdAt: minutesAgo(43), status: 'read' },
  { id: 'd1', conversationId: 'david-chat', senderId: 'david', type: 'text', content: '👍', createdAt: daysAgo(1), status: 'read' },
];
