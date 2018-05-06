'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ORIGINAL_TWEET = exports.ORIGINAL_TWEET = '.permalink-inner.permalink-tweet-container';

var REPLY_SELECTOR = exports.REPLY_SELECTOR = '.tweet.permalink-tweet .stream-item-footer [data-tweet-stat-count]';

var STATS_RE = exports.STATS_RE = /(\d+,?\d*) (replies|reply|likes?|retweets?)/;

var KEY_MAP = exports.KEY_MAP = {
  likes: 'likes',
  like: 'likes',
  replies: 'replies',
  reply: 'replies',
  retweets: 'retweets',
  retweet: 'retweet'
};