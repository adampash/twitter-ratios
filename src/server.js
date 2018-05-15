import bodyParser from 'body-parser';
import express from 'express';
import puppeteer from 'puppeteer';

import { getRatios, openPage, screenshotTweet } from './page-actions';

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

  app.post('/ratios', async (req, res) => {
    let page;
    try {
      const { url } = req.body;
      const { page: newPage } = await openPage({
        url,
        closeOnError: false,
        browser,
      });
      page = newPage;
      const ratios = await getRatios(page);
      await page.close();
      res.json(ratios);
    } catch (e) {
      if (page) await page.close();
      res.json({ error: true, msg: e.message });
    }
  });

  app.post('/screenshot', async (req, res) => {
    let page;
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

  console.log('Starting server on port 3000');
  const server = app.listen(3000);
  return { server, browser };
};

export default startServer;
