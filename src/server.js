import PQueue from 'p-queue';
import bodyParser from 'body-parser';
import express from 'express';
import puppeteer from 'puppeteer';

import { getRatios, openPage, screenshotTweet } from './page-actions';

const logger = require('logger').createLogger();
const queue = new PQueue({ concurrency: 1 });
let pagesOpened = 0;
let browser;

const launchBrowser = () =>
  puppeteer.launch({
    ...(process.env.CHROME_EXECUTABLE_PATH
      ? {
          executablePath: process.env.CHROME_EXECUTABLE_PATH,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        }
      : {}),
    timeout: 10000, // must launch in 10 seconds
  });

const relaunchBrowser = async () => {
  if (browser) await browser.close();
  browser = await launchBrowser();
};

const startServer = async () => {
  const app = express();
  app.use(bodyParser.json());

  await relaunchBrowser();

  const countPages = async fn => {
    if (pagesOpened > 10) {
      try {
        logger.info('closing and reopening browser');
        await relaunchBrowser();
        pagesOpened = 0;
      } catch (e) {
        logger.info(`Error restarting browser:`, e);
      }
    }
    pagesOpened += 1;
    fn();
  };

  app.get('/ping', (req, res) => {
    res.send('pong');
  });

  const queueCount = () =>
    `queue len: ${queue.size}; queue pending: ${queue.pending}`;
  app.get('/queue', (req, res) => {
    res.send(queueCount());
  });

  const runRatios = async (req, res, url) => {
    await queue.add(
      countPages(async () => {
        let page;
        try {
          const { page: newPage } = await openPage({
            url,
            closeOnError: false,
            browser,
          });
          page = newPage;
          const ratios = await getRatios(page);
          logger.info(`ratios`, ratios);
          await page.close();
          res.json(ratios);
        } catch (e) {
          if (page) await page.close();
          logger.info('error!', e);
          if (e.message.trim() === 'Error: not opened') {
            logger.info(
              'Browser closed unexpectedly; reopening, running again'
            );
            await relaunchBrowser();
            runRatios(req, res, url);
          }
          res.json({ error: true, msg: e.message });
        }
      })
    );
  };
  const runScreenshot = async (req, res, url) => {
    await queue.add(
      countPages(async () => {
        let page;
        try {
          const { page: newPage } = await openPage({
            url,
            closeOnError: false,
            browser,
          });
          page = newPage;
          const ratios = await getRatios(page);
          const screenshot = await screenshotTweet(page);
          await page.close();
          res.json({ screenshot: `${process.cwd()}/${screenshot}`, ratios });
        } catch (e) {
          if (page) await page.close();
          if (e.message.trim() === 'Error: not opened') {
            logger.info(
              'Browser closed unexpectedly; reopening, running again'
            );
            await relaunchBrowser();
            runRatios(req, res, url);
          }
          res.json({ error: true, msg: e.message });
        }
      })
    );
  };

  app.post('/ratios', (req, res) => runRatios(req, res, req.body.url));
  app.get('/ratios', (req, res) => runRatios(req, res, req.query.url));

  app.post('/screenshot', (req, res) => runScreenshot(req, res, req.body.url));
  app.get('/screenshot', (req, res) => runScreenshot(req, res, req.query.url));

  app.get('/restart-browser', async (req, res) => {
    await relaunchBrowser()
    res.send("Browser restarted")
  })

  logger.info('Starting server on port 3000');
  const server = app.listen(3000);
  return { server, browser };
};

export default startServer;
