const express = require('express');
const path = require('path');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/screenshot', async (req, res) => {
  const { html } = req.body || {};
  if (!html) {
    return res.status(400).json({ error: 'Missing html content with an element that has id="capture".' });
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    const template = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <style>
    body { margin: 0; padding: 16px; background: #f6f8fb; font-family: Arial, sans-serif; }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;

    await page.setContent(template, { waitUntil: 'networkidle0' });
    const element = await page.$('#capture');

    if (!element) {
      return res.status(400).json({ error: 'No element with id="capture" found in provided HTML.' });
    }

    const buffer = await element.screenshot({ omitBackground: true });
    const image = `data:image/png;base64,${buffer.toString('base64')}`;

    res.json({ image });
  } catch (error) {
    console.error('Failed to create screenshot', error);
    res.status(500).json({ error: 'Failed to generate screenshot' });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
