const express = require('express');
const fetch = require('node-fetch');

const app = express();
const port = 3001;
const targetBaseUrl = process.env.OPEN_WEARABLES_BASE_URL || 'https://backend-production-21d7.up.railway.app';
const apiKey = process.env.OPEN_WEARABLES_API_KEY;

app.use(express.json());

app.use(async (req, res) => {
  if (!apiKey) {
    res.status(500).json({ error: 'Missing OPEN_WEARABLES_API_KEY' });
    return;
  }

  const targetUrl = `${targetBaseUrl}${req.originalUrl}`;
  const response = await fetch(targetUrl, {
    method: req.method,
    headers: {
      'X-Open-Wearables-API-Key': apiKey,
      ...(req.headers['content-type'] ? { 'content-type': req.headers['content-type'] } : {}),
    },
    body: ['GET', 'HEAD'].includes(req.method.toUpperCase()) ? undefined : JSON.stringify(req.body),
  });

  const body = await response.text();
  res.status(response.status);
  res.set('Content-Type', response.headers.get('content-type') || 'application/json');
  res.send(body);
});

app.listen(port, () => {
  console.log(`Proxy listening on http://localhost:${port}`);
});
