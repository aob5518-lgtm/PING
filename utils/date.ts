export function formatMessageTime(timestamp: number, locale?: string) {
  return new Date(timestamp).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
}

export function formatConversationTime(timestamp: number, now = Date.now(), locale?: string, yesterdayLabel = 'Yesterday') {
  const date = new Date(timestamp);
  const today = new Date(now);
  const sameDay = date.getFullYear() === today.getFullYear()
    && date.getMonth() === today.getMonth()
    && date.getDate() === today.getDate();
  if (sameDay) return formatMessageTime(timestamp, locale);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const wasYesterday = date.getFullYear() === yesterday.getFullYear()
    && date.getMonth() === yesterday.getMonth()
    && date.getDate() === yesterday.getDate();
  if (wasYesterday) return yesterdayLabel;
  return date.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
}

export function formatMessageDay(timestamp?: number, now = Date.now(), locale?: string, todayLabel = 'Today', yesterdayLabel = 'Yesterday') {
  if (!timestamp) return todayLabel;
  const date = new Date(timestamp);
  const today = new Date(now);
  const sameDay = date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate();
  return sameDay ? todayLabel : formatConversationTime(timestamp, now, locale, yesterdayLabel);
}
