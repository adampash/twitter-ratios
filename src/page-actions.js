import puppeteer from 'puppeteer';
import uid from 'uid';

import { KEY_MAP, ORIGINAL_TWEET, REPLY_SELECTOR, STATS_RE } from './constants';

const newBrowser = browser =>
  browser ||
  puppeteer.launch({
    ...(process.env.CHROME_EXECUTABLE_PATH
      ? {
          executablePath: process.env.CHROME_EXECUTABLE_PATH,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        }
      : {}),
    timeout: 10000, // must launch in 10 seconds
  });

export const openPage = async ({
  url,
  browser: tmpBrowser,
  closeOnError = true,
}) => {
  const browser = await newBrowser(tmpBrowser);
  try {
    const page = await (await newBrowser(browser)).newPage();
    const response = await page.goto(url);
    if (response.headers().status.split(/\n/)[0] !== '200') {
      throw new Error('Page not found');
    }
    return { page, browser };
  } catch (e) {
    if (closeOnError) browser.close();
    throw e;
  }
};

export const screenshotTweet = async page => {
  await page.waitForSelector(ORIGINAL_TWEET, { timeout: 5000 });
  const tweet = await page.$(ORIGINAL_TWEET);

  // wait 6 seconds to give media time to load
  await page.waitFor(6000);

  const screenshotPath = `${uid(10)}.png`;
  await tweet.screenshot({ path: screenshotPath });
  return screenshotPath;
};

export const getRatios = async page => {
  await page.waitForSelector(REPLY_SELECTOR, { timeout: 10000 });
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
  try {
    const screenshot = await screenshotTweet(page);
    const ratios = await getRatios(page);
    await browser.close();
    return { screenshot, ratios };
  } catch (e) {
    console.log(`Error:`, e);
    browser.close();
    return {};
  }
};

export const getRatiosFromUrl = async url => {
  const { page, browser } = await openPage({ url });
  try {
    const stats = await getRatios(page);
    await browser.close();
    return stats;
  } catch (e) {
    console.log(`Error:`, e);
    browser.close();
    return {};
  }
};
