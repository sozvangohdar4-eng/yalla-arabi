const express = require('express');
const path = require('path');
const https = require('https');

const app = express();
const PORT = 3000;

// Serve static assets from the root directory
app.use(express.static(__dirname));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// In-memory audio cache to deliver instant audio for frequently used Iraqi phrases
const audioCache = new Map();

// Arabic Audio Speech (TTS) Proxy Endpoint
app.get('/api/tts', (req, res) => {
  const rawText = req.query.text || '';
  if (!rawText) {
    return res.status(400).send('Missing text parameter');
  }

  // Sanitize text: remove Kurdish annotations, parentheses, emojis
  const cleanText = rawText
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/➔.*/g, '')
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu, '')
    .replace(/[،؟!.،]/g, ' ')
    .trim() || rawText;

  if (audioCache.has(cleanText)) {
    const cached = audioCache.get(cleanText);
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': cached.length,
      'Cache-Control': 'public, max-age=604800, immutable'
    });
    return res.send(cached);
  }

  const encoded = encodeURIComponent(cleanText);
  const targetUrl = `https://dict.youdao.com/dictvoice?audio=${encoded}&le=ar`;

  const externalReq = https.get(targetUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  }, (extRes) => {
    if (extRes.statusCode !== 200) {
      return res.status(502).send('Upstream audio service error');
    }

    const chunks = [];
    extRes.on('data', (chunk) => chunks.push(chunk));
    extRes.on('end', () => {
      const buffer = Buffer.concat(chunks);
      if (buffer.length > 500) {
        if (audioCache.size > 500) {
          const firstKey = audioCache.keys().next().value;
          audioCache.delete(firstKey);
        }
        audioCache.set(cleanText, buffer);
      }

      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': buffer.length,
        'Cache-Control': 'public, max-age=604800, immutable'
      });
      res.send(buffer);
    });
  });

  externalReq.on('error', (err) => {
    console.error('TTS Proxy Error:', err);
    res.status(500).send('TTS Proxy failed');
  });
});

// Single Page Application fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
