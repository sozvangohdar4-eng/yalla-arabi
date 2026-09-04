/**
 * Local Wi-Fi HTTP Server for testing & installing Yalla Arabi on Samsung Galaxy S23 Ultra
 * Pure Node.js - No npm packages required!
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 8080;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

// Get local IPv4 addresses (Wi-Fi / LAN)
function getLocalIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push({ name, ip: iface.address });
      }
    }
  }
  return ips;
}

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const filePath = path.join(ROOT_DIR, reqPath);

  // Prevent directory traversal
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403);
    res.end('Access Denied');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found: ' + reqPath);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const localIPs = getLocalIPs();
  
  console.log('\n============================================================');
  console.log('🌴 یەڵڵا عەرەبی | Yalla Arabi Server for Samsung Galaxy S23 Ultra');
  console.log('============================================================\n');
  console.log('📱 هەنگاوەکانی دابەزاندن بۆ سەر مۆبایلی Samsung S23 Ultra:');
  console.log('------------------------------------------------------------');
  console.log('١. دڵنیابە مۆبایلەکەت و کۆمپیوتەرەکەت لەسەر هەمان وایفای (Wi-Fi)ن.');
  console.log('٢. لەناو وێبگەڕی مۆبایلەکەت (Samsung Internet یان Google Chrome)');
  console.log('   ئەم ناونیشانە بنووسە و بیکەرەوە:\n');
  
  if (localIPs.length > 0) {
    localIPs.forEach(item => {
      console.log(`   👉  http://${item.ip}:${PORT}/`);
    });
  } else {
    console.log(`   👉  http://localhost:${PORT}/`);
  }

  console.log('\n٣. کاتێک ماڵپەڕەکە کرایەوە، لە سەرەوە دوگمەی شینی "ئینستۆڵ" دابگرە،');
  console.log('   یان کلیک لەسەر سێ خاڵەکە بکە و "Install app" هەڵبژێرە.');
  console.log('٤. بەرنامەکە وەک ئەپێکی ڕاستەقینە دەکەوێتە سەر شاشەی مۆبایلەکەت');
  console.log('   و ١٠٠٪ بە بێ ئینتەرنێتیش بەردەوام کاردەکات! ✅\n');
  console.log('Server is running... (Press Ctrl+C to stop)');
  console.log('============================================================\n');
});
