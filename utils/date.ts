export function formatMessageTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatConversationTime(timestamp: number, now = Date.now()) {
  const date = new Date(timestamp);
  const today = new Date(now);
  const sameDay = date.getFullYear() === today.getFullYear()
    && date.getMonth() === today.getMonth()
    && date.getDate() === today.getDate();
  if (sameDay) return formatMessageTime(timestamp);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const wasYesterday = date.getFullYear() === yesterday.getFullYear()
    && date.getMonth() === yesterday.getMonth()
    && date.getDate() === yesterday.getDate();
  if (wasYesterday) return 'Yesterday';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function formatMessageDay(timestamp?: number, now = Date.now()) {
  if (!timestamp) return 'Today';
  const short = formatConversationTime(timestamp, now);
  return short.includes(':') ? 'Today' : short;
}
