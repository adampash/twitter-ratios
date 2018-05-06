import puppeteer from 'puppeteer';
import uid from 'uid';

import { KEY_MAP, ORIGINAL_TWEET, REPLY_SELECTOR, STATS_RE } from './constants';

const newBrowser = browser =>
  browser ||
  puppeteer.launch({
    ...(process.env.CHROME_EXECUTABLE_PATH
      ? { executablePath: process.env.CHROME_EXECUTABLE_PATH }
      : {}),
  });

const openPage = async ({ url, browser: tmpBrowser }) => {
  const browser = await newBrowser(tmpBrowser);
  const page = await (await newBrowser(browser)).newPage();
  await page.goto(url);
  return { page, browser };
};

const screenshotTweet = async page => {
  await page.waitFor(ORIGINAL_TWEET);
  const tweet = await page.$(ORIGINAL_TWEET);
  const screenshotPath = `${uid(10)}.png`;
  await tweet.screenshot({ path: screenshotPath });
  return screenshotPath;
};

export const getRatios = async page => {
  await page.waitFor(REPLY_SELECTOR);
  const statsStrings = await page.evaluate(() => {
    const SELECTOR =
      '.tweet.permalink-tweet .stream-item-footer [data-tweet-stat-count]';
    // eslint-disable-next-line
    const result = $(SELECTOR)
      .toArray()
      .map(s => s.innerText);
    return result;
  });
  return statsStrings.reduce((acc, text) => {
    if (STATS_RE.test(text)) {
      // eslint-disable-next-line no-unused-vars
      const [_, val, key] = text.match(STATS_RE);
      return {
        ...acc,
        [KEY_MAP[key]]: parseInt(val.replace(/\D/g, ''), 10),
      };
    }
    return acc;
  }, {});
};

export const getScreenshotAndRatios = async url => {
  const { page, browser } = await openPage({ url });
  const screenshot = await screenshotTweet(page);
  const ratios = await getRatios(page);
  await browser.close();
  return { screenshot, ratios };
};

export const getRatiosFromUrl = async url => {
  const { page, browser } = await openPage({ url });
  const stats = await getRatios(page);
  await browser.close();
  return stats;
};
