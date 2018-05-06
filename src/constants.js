export const ORIGINAL_TWEET = '.permalink-inner.permalink-tweet-container';

export const REPLY_SELECTOR =
  '.tweet.permalink-tweet .stream-item-footer [data-tweet-stat-count]';

export const STATS_RE = /(\d+,?\d*) (replies|reply|likes?|retweets?)/;

export const KEY_MAP = {
  likes: 'likes',
  like: 'likes',
  replies: 'replies',
  reply: 'replies',
  retweets: 'retweets',
  retweet: 'retweet',
};
