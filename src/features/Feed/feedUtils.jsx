// Extract hashtags from text
export const extractHashtags = (text) => {
  const hashtagRegex = /#[\w]+/g;
  return text.match(hashtagRegex) || [];
};

// Parse hashtags and return text with preserved content
export const parsePostContent = (content) => {
  const hashtags = extractHashtags(content);
  const uniqueHashtags = [...new Set(hashtags)];
  return { content, hashtags: uniqueHashtags };
};

// Format timestamp for display
export const formatTime = (timestamp) => {
  if (!timestamp?.toDate) return 'Just now';
  const date = timestamp.toDate();
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};
