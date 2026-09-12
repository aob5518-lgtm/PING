import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { warnStorage } from '@/utils/storage-warning';

export type LanguagePreference = 'system' | 'en' | 'zh-CN';

const en = {
  'nav.createGroup': 'Create group', 'nav.settings': 'Settings', 'nav.editProfile': 'Edit profile', 'nav.identity': 'Identity', 'nav.blockedUsers': 'Blocked Users',
  'tabs.chats': 'Chats', 'tabs.discover': 'Discover', 'tabs.me': 'Me',
  'common.done': 'Done', 'common.you': 'You', 'common.owner': 'Owner', 'common.member': 'Member', 'common.unblock': 'Unblock', 'common.block': 'Block',
  'welcome.eyebrow': 'A calmer way to connect', 'welcome.title': 'Talk freely.', 'welcome.subtitle': 'Meet thoughtful people and start real conversations — without a phone number or real-name verification.', 'welcome.create': 'Create Identity', 'welcome.privacy': 'Your identity belongs to you.',
  'identityCreate.eyebrow': 'YOUR PING IDENTITY', 'identityCreate.title': 'Let people know who you are.', 'identityCreate.subtitle': 'You can change these details any time.', 'identityCreate.displayName': 'Display name', 'identityCreate.namePlaceholder': 'Alex', 'identityCreate.username': 'Username', 'identityCreate.usernamePlaceholder': '@alex', 'identityCreate.usernameHint': 'Lowercase letters, numbers, or underscores · 3–20 characters', 'identityCreate.error': 'Enter a name and a valid username to continue.',
  'chats.kicker': 'YOUR PEOPLE', 'chats.search': 'Search conversations', 'chats.emptyTitle': 'No conversations found', 'chats.emptyText': 'Try another name or message.', 'chats.open': 'Open chat with {{name}}', 'chats.newMenu': 'Start something', 'chats.newChat': 'New Chat', 'chats.newChatCaption': 'Find someone on Ping', 'chats.newGroup': 'Create Group', 'chats.newGroupCaption': 'Bring a few people together', 'chats.created': 'Identity created', 'chats.start': 'Start a conversation', 'chats.groupCreated': 'Group created',
  'discover.kicker': 'COMPATIBILITY, NOT POPULARITY', 'discover.subtitle': 'A few people who may be worth knowing.', 'discover.search': 'Search people, IDs or interests', 'discover.section': 'People you may want to meet', 'discover.emptyTitle': 'No one found', 'discover.emptyText': 'Try an interest, name, or Ping ID.', 'discover.view': "View {{name}}'s profile", 'discover.reason': 'WHY THIS MATCH', 'discover.shared': '{{count}} shared interest', 'discover.sharedPlural': '{{count}} shared interests', 'discover.profileFit': 'Their interests match who you want to meet.', 'discover.generalFit': 'Their profile may be a useful match.',
  'profile.interests': 'Interested in', 'profile.lookingFor': 'Looking to meet', 'profile.why': 'WHY YOU MAY GET ALONG', 'profile.topicLabel': 'A CONVERSATION TO START', 'profile.topic': 'What are you building lately?', 'profile.sayHi': 'Say Hi', 'profile.review': 'You’ll review the first message before it’s sent.', 'profile.notFound': 'Profile not found.', 'profile.blocked': 'This user is blocked.', 'profile.blockUser': 'Block {{name}}', 'profile.unblockUser': 'Unblock {{name}}',
  'me.settings': 'Open settings', 'me.editProfile': 'Edit Profile', 'me.qr': 'My QR Code', 'me.identity': 'Identity', 'me.privacy': 'Privacy', 'me.settingsRow': 'Settings', 'me.footer': 'Ping 0.1 · Your identity belongs to you.', 'me.closeQr': 'Close QR code', 'me.qrText': 'Scan to open this Ping profile.',
  'settings.account': 'Account', 'settings.username': 'Username', 'settings.privacy': 'Privacy', 'settings.messageRequests': 'Message Requests', 'settings.blockedUsers': 'Blocked Users', 'settings.readReceipts': 'Read Receipts', 'settings.identity': 'Identity', 'settings.appearance': 'Appearance', 'settings.app': 'App', 'settings.language': 'Language', 'settings.light': 'Light', 'settings.dark': 'Dark', 'settings.system': 'System', 'settings.english': 'English', 'settings.chinese': '简体中文', 'settings.useAppearance': 'Use {{name}} appearance', 'settings.useLanguage': 'Use {{name}} language', 'settings.about': 'About Ping',
  'blocked.emptyTitle': 'No blocked users', 'blocked.emptyText': 'People you block will appear here.',
  'edit.title': 'Edit Profile', 'edit.bio': 'Bio', 'edit.interests': 'Interests', 'edit.interestsHint': 'Separate items with commas', 'edit.lookingFor': 'Looking to meet', 'edit.usernameTaken': 'That username is unavailable.', 'edit.invalidUsername': 'Use 3–20 lowercase letters, numbers, or underscores.', 'edit.save': 'Save Changes',
  'identity.notice': 'Ping stores this identity locally on this device.', 'identity.pingId': 'Ping ID', 'identity.localProfile': 'Local profile', 'identity.stored': 'Stored on this device',
  'group.step': 'Step {{step}} of 2', 'group.whosIn': 'Who’s in?', 'group.choose': 'Choose at least one person. You’ll be the owner.', 'group.search': 'Search people', 'group.remove': 'Remove {{name}}', 'group.select': 'Select {{name}}', 'group.continue': 'Continue · {{count}} selected', 'group.selectPeople': 'Select people', 'group.change': 'Change members', 'group.changeLabel': 'Change group members', 'group.nameTitle': 'Name this group.', 'group.nameHelp': 'Keep it clear and easy to recognize.', 'group.name': 'Group name', 'group.namePlaceholder': 'Weekend builders', 'group.members': 'Members', 'group.create': 'Create Group',
  'chat.notFound': 'Conversation not found.', 'chat.userUnavailable': 'User unavailable', 'chat.members': '{{count}} members', 'chat.back': 'Go back', 'chat.openDetails': 'Open {{name}} details', 'chat.replying': 'Replying', 'chat.cancelReply': 'Cancel reply', 'chat.message': 'Message', 'chat.send': 'Send message', 'chat.reply': 'Reply', 'chat.copy': 'Copy', 'chat.aiReply': 'Suggested Reply', 'chat.closeActions': 'Close message actions', 'chat.copied': 'Copied to clipboard', 'chat.blocked': 'You blocked this user. Unblock them to send messages.', 'chat.yourMessage': 'Your message, {{content}}', 'chat.receivedMessage': '{{name}} message, {{content}}', 'chat.longPress': 'Long press for message actions', 'chat.unknownUser': 'Unknown user', 'chat.image': 'Image preview', 'chat.suggestions': 'Suggested replies', 'chat.suggestionNote': 'Suggestions are generated locally and only fill the composer.', 'chat.closeSuggestions': 'Close suggested replies', 'chat.useReply': 'Use reply: {{reply}}', 'chat.suggestion1': 'That sounds interesting. What approach are you using?', 'chat.suggestion2': 'I’ve been thinking about the same problem.', 'chat.suggestion3': 'Tell me more.',
  'date.today': 'Today', 'date.yesterday': 'Yesterday',
} as const;

const zh: Record<keyof typeof en, string> = {
  'nav.createGroup': '创建群组', 'nav.settings': '设置', 'nav.editProfile': '编辑资料', 'nav.identity': '身份', 'nav.blockedUsers': '已屏蔽用户',
  'tabs.chats': '聊天', 'tabs.discover': '发现', 'tabs.me': '我',
  'common.done': '完成', 'common.you': '你', 'common.owner': '群主', 'common.member': '成员', 'common.unblock': '取消屏蔽', 'common.block': '屏蔽',
  'welcome.eyebrow': '更安静地建立连接', 'welcome.title': '自在交谈。', 'welcome.subtitle': '认识值得交流的人，开始真实对话——无需手机号或实名验证。', 'welcome.create': '创建身份', 'welcome.privacy': '你的身份属于你。',
  'identityCreate.eyebrow': '你的 PING 身份', 'identityCreate.title': '让别人认识你。', 'identityCreate.subtitle': '这些资料以后都可以修改。', 'identityCreate.displayName': '显示名称', 'identityCreate.namePlaceholder': '小明', 'identityCreate.username': '用户名', 'identityCreate.usernamePlaceholder': '@xiaoming', 'identityCreate.usernameHint': '3–20 位小写字母、数字或下划线', 'identityCreate.error': '请输入名称和有效用户名。',
  'chats.kicker': '你的联系人', 'chats.search': '搜索会话', 'chats.emptyTitle': '没有找到会话', 'chats.emptyText': '试试其他名称或消息。', 'chats.open': '打开与 {{name}} 的聊天', 'chats.newMenu': '开始交流', 'chats.newChat': '新建聊天', 'chats.newChatCaption': '在 Ping 上寻找用户', 'chats.newGroup': '创建群组', 'chats.newGroupCaption': '邀请几个人一起交流', 'chats.created': '身份已创建', 'chats.start': '开始一段对话', 'chats.groupCreated': '群组已创建',
  'discover.kicker': '重视契合，而非人气', 'discover.subtitle': '这些人也许值得认识。', 'discover.search': '搜索用户、ID 或兴趣', 'discover.section': '你可能想认识的人', 'discover.emptyTitle': '没有找到用户', 'discover.emptyText': '试试兴趣、名称或 Ping ID。', 'discover.view': '查看 {{name}} 的资料', 'discover.reason': '推荐原因', 'discover.shared': '{{count}} 个共同兴趣', 'discover.sharedPlural': '{{count}} 个共同兴趣', 'discover.profileFit': '对方的兴趣与你想认识的人相符。', 'discover.generalFit': '对方的资料可能与你契合。',
  'profile.interests': '感兴趣', 'profile.lookingFor': '希望认识', 'profile.why': '你们可能合得来的原因', 'profile.topicLabel': '可以这样开始聊天', 'profile.topic': '你最近在做什么？', 'profile.sayHi': '打个招呼', 'profile.review': '第一条消息会先由你确认，不会自动发送。', 'profile.notFound': '找不到该用户。', 'profile.blocked': '你已屏蔽该用户。', 'profile.blockUser': '屏蔽 {{name}}', 'profile.unblockUser': '取消屏蔽 {{name}}',
  'me.settings': '打开设置', 'me.editProfile': '编辑资料', 'me.qr': '我的二维码', 'me.identity': '身份', 'me.privacy': '隐私', 'me.settingsRow': '设置', 'me.footer': 'Ping 0.1 · 你的身份属于你。', 'me.closeQr': '关闭二维码', 'me.qrText': '扫描后打开此 Ping 资料。',
  'settings.account': '账户', 'settings.username': '用户名', 'settings.privacy': '隐私', 'settings.messageRequests': '消息请求', 'settings.blockedUsers': '已屏蔽用户', 'settings.readReceipts': '已读回执', 'settings.identity': '身份', 'settings.appearance': '外观', 'settings.app': '应用', 'settings.language': '语言', 'settings.light': '浅色', 'settings.dark': '深色', 'settings.system': '跟随系统', 'settings.english': 'English', 'settings.chinese': '简体中文', 'settings.useAppearance': '使用{{name}}外观', 'settings.useLanguage': '使用{{name}}语言', 'settings.about': '关于 Ping',
  'blocked.emptyTitle': '没有已屏蔽用户', 'blocked.emptyText': '你屏蔽的用户会显示在这里。',
  'edit.title': '编辑资料', 'edit.bio': '简介', 'edit.interests': '兴趣', 'edit.interestsHint': '请用逗号分隔', 'edit.lookingFor': '希望认识', 'edit.usernameTaken': '该用户名不可用。', 'edit.invalidUsername': '请输入 3–20 位小写字母、数字或下划线。', 'edit.save': '保存修改',
  'identity.notice': 'Ping 将此身份保存在当前设备上。', 'identity.pingId': 'Ping ID', 'identity.localProfile': '本地资料', 'identity.stored': '已保存在此设备',
  'group.step': '第 {{step}} 步，共 2 步', 'group.whosIn': '邀请谁加入？', 'group.choose': '至少选择一人，你将成为群主。', 'group.search': '搜索用户', 'group.remove': '移除 {{name}}', 'group.select': '选择 {{name}}', 'group.continue': '继续 · 已选 {{count}} 人', 'group.selectPeople': '请选择用户', 'group.change': '修改成员', 'group.changeLabel': '修改群组成员', 'group.nameTitle': '给群组起个名字。', 'group.nameHelp': '名称要清晰、容易识别。', 'group.name': '群组名称', 'group.namePlaceholder': '周末创作者', 'group.members': '成员', 'group.create': '创建群组',
  'chat.notFound': '找不到该会话。', 'chat.userUnavailable': '用户不可用', 'chat.members': '{{count}} 位成员', 'chat.back': '返回', 'chat.openDetails': '打开 {{name}} 的资料', 'chat.replying': '正在回复', 'chat.cancelReply': '取消回复', 'chat.message': '消息', 'chat.send': '发送消息', 'chat.reply': '回复', 'chat.copy': '复制', 'chat.aiReply': '建议回复', 'chat.closeActions': '关闭消息操作', 'chat.copied': '已复制到剪贴板', 'chat.blocked': '你已屏蔽该用户。取消屏蔽后才能发送消息。', 'chat.yourMessage': '你的消息：{{content}}', 'chat.receivedMessage': '{{name}} 的消息：{{content}}', 'chat.longPress': '长按打开消息操作', 'chat.unknownUser': '未知用户', 'chat.image': '图片预览', 'chat.suggestions': '建议回复', 'chat.suggestionNote': '建议由本地规则提供，只会填入输入框。', 'chat.closeSuggestions': '关闭建议回复', 'chat.useReply': '使用回复：{{reply}}', 'chat.suggestion1': '听起来很有意思，你采用了什么方法？', 'chat.suggestion2': '我也在思考同一个问题。', 'chat.suggestion3': '可以多说一点吗？',
  'date.today': '今天', 'date.yesterday': '昨天',
};

export type TranslationKey = keyof typeof en;
const LANGUAGE_KEY = '@ping/language-preference';
const systemLanguage = (): 'en' | 'zh-CN' => Intl.DateTimeFormat().resolvedOptions().locale.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';

type I18nValue = { preference: LanguagePreference; language: 'en' | 'zh-CN'; locale: string; setPreference: (value: LanguagePreference) => void; t: (key: TranslationKey, values?: Record<string, string | number>) => string };
const I18nContext = createContext<I18nValue>(undefined as unknown as I18nValue);

export function I18nProvider({ children }: PropsWithChildren) {
  const [preference, setPreferenceState] = useState<LanguagePreference>('system');
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { AsyncStorage.getItem(LANGUAGE_KEY).then(value => {
    if (value === 'system' || value === 'en' || value === 'zh-CN') setPreferenceState(value);
  }).catch(error => warnStorage('Could not load language preference.', error)).finally(() => setHydrated(true)); }, []);
  const setPreference = (value: LanguagePreference) => { setPreferenceState(value); AsyncStorage.setItem(LANGUAGE_KEY, value).catch(error => warnStorage('Could not save language preference.', error)); };
  const language = preference === 'system' ? systemLanguage() : preference;
  const value = useMemo<I18nValue>(() => ({ preference, language, locale: language === 'zh-CN' ? 'zh-CN' : 'en-US', setPreference, t: (key, values) => {
    let text: string = (language === 'zh-CN' ? zh : en)[key];
    Object.entries(values ?? {}).forEach(([name, replacement]) => { text = text.replaceAll(`{{${name}}}`, String(replacement)); });
    return text;
  } }), [language, preference]);
  if (!hydrated) return null;
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() { return useContext(I18nContext); }
