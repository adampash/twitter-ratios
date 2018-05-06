#!/usr/bin/env node

import meow from 'meow';

import { getRatiosFromUrl, getScreenshotAndRatios } from './page-actions';

const cli = meow(
  `
    A CLI for getting the stats of a tweet: replies, likes, and retweets. Can also return
    a screenshot along with those stats. Uses puppeteer as a headless browser.

    Usage
      $ twitter-ratios <url> [options]
 
    Options
      --ratios, -r  Return ratios (default)
      --screenshot, -s  Screenshot tweet
 
    Examples
      $ twitter-ratios https://twitter.com/ashleyfeinberg/status/976227867205013505 --screenshot
`,
  {
    flags: {
      ratios: {
        type: 'boolean',
        alias: 'r',
      },
      screenshot: {
        type: 'boolean',
        alias: 's',
      },
    },
  }
);

const main = async () => {
  if (cli.input.length === 0) {
    cli.showHelp();
    return;
  }
  const [url] = cli.input;
  if (cli.flags.screenshot) {
    const data = await getScreenshotAndRatios(url);
    console.log(JSON.stringify(data));
    return;
  }
  if (cli.flags.ratios || (!cli.flags.ratios && !cli.flags.screenshot)) {
    const data = await getRatiosFromUrl(url);
    console.log(JSON.stringify(data));
  }
};

main();
