#!/usr/bin/env node

import meow from 'meow';

import { getRatiosFromUrl, getScreenshotAndRatios } from './page-actions';
import startServer from './server';

const cli = meow(
  `
    A CLI for getting the stats of a tweet: replies, likes, and retweets. Can also return
    a screenshot along with those stats. Uses puppeteer as a headless browser.

    Usage
      $ twitter-ratios <url> [options]
 
    Options
      --ratios, -r  Return ratios (default)
      --screenshot, -s  Screenshot tweet
      --server Start server, use same browser instance for calls
 
    Examples
      $ twitter-ratios https://twitter.com/PhilipRucker/status/899802454895861760 --screenshot
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
      server: {
        type: 'boolean',
      },
    },
  }
);

const main = async () => {
  if (cli.input.length === 0 && !cli.flags.server) {
    cli.showHelp();
    return;
  }
  const [url] = cli.input;
  if (cli.flags.screenshot) {
    const data = await getScreenshotAndRatios(url);
    console.log(JSON.stringify(data));
    return;
  }
  if (cli.flags.server) {
    const { server, browser } = startServer();
    process.on('SIGTERM', async () => {
      console.log('SIGTERM: closing gracefully');
      await browser.close();
      console.log('browser closed');
      server.close();
      console.log('server closed; exiting');
      process.exit(0);
    });
    process.on('SIGINT', async () => {
      console.log('SIGINT: closing gracefully');
      await browser.close();
      console.log('browser closed');
      server.close();
      console.log('server closed; exiting');
      process.exit(0);
    });
  }
  if (cli.flags.ratios || (!cli.flags.ratios && !cli.flags.screenshot)) {
    const data = await getRatiosFromUrl(url);
    console.log(JSON.stringify(data));
  }
};

main();
