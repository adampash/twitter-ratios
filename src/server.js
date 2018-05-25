import PQueue from 'p-queue';
import bodyParser from 'body-parser';
import express from 'express';
import puppeteer from 'puppeteer';

import { getRatios, openPage, screenshotTweet } from './page-actions';

const queue = new PQueue({ concurrency: 8 });

const startServer = () => {
  const app = express();
  app.use(bodyParser.json());
  const browser = puppeteer.launch({
    ...(process.env.CHROME_EXECUTABLE_PATH
      ? {
          executablePath: process.env.CHROME_EXECUTABLE_PATH,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        }
      : {}),
    timeout: 10000, // must launch in 10 seconds
  });

  app.get('/ping', (req, res) => {
    res.send('pong');
  });

  const queueCount = () => `queue len: ${queue.size}; queue pending: ${queue.pending}`
  app.get('/queue', (req, res) => {
    res.send(queueCount());
  });

  const runRatios = async (req, res, url) => {
    let page;
    await queue.add(async () => {
      try {
        console.log('running ratio...');
        console.log(`queueCount()`, queueCount());
        // const { url } = req.body;
        const { page: newPage } = await openPage({
          url,
          closeOnError: false,
          browser,
        });
        page = newPage;
        const ratios = await getRatios(page);
        console.log(`ratios`, ratios);
        await page.close();
        res.json(ratios);
      } catch (e) {
        if (page) await page.close();
        console.log('error!', e);
        res.json({ error: true, msg: e.message });
      }
    });
  };

  app.post('/ratios', (req, res) => runRatios(req, res, req.body.url));
  app.get('/ratios', (req, res) => runRatios(req, res, req.query.url));

  app.post('/screenshot', async (req, res) => {
    let page;
    await queue.add(async () => {
      try {
        const { url } = req.body;
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
        res.json({ error: true, msg: e.message });
      }
    });
  });

  console.log('Starting server on port 3001');
  const server = app.listen(3001);
  return { server, browser };
};

export default startServer;
