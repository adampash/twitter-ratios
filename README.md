# Twitter Ratios

A simple CLI to get stats for a tweet (replies, retweets, likes) via a headless browser. Can
also optionally take a screenshot of the tweet.

## Installation

```bash
yarn global add https://github.com/adampash/twitter-ratios.git

# OR

npm install -g https://github.com/adampash/twitter-ratios.git
```

## Usage

```bash
twitter-ratios <url> [options]
```
 
### Options

>  --ratios, -r  Return ratios (default)
>  --screenshot, -s  Screenshot tweet

### Examples

```bash
twitter-ratios https://twitter.com/PhilipRucker/status/899802454895861760 --ratios

twitter-ratios https://twitter.com/PhilipRucker/status/899802454895861760 --screenshot
```
