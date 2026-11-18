const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

// Ensure data folder and messages file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(MESSAGES_FILE)) {
  fs.writeFileSync(MESSAGES_FILE, '[]', 'utf8');
}

// Real online visitor tracker (IP + timestamp with 60s timeout)
const activeVisitors = new Map();

function cleanVisitors() {
  const now = Date.now();
  for (const [key, lastSeen] of activeVisitors.entries()) {
    if (now - lastSeen > 60000) {
      activeVisitors.delete(key);
    }
  }
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ico': 'image/x-icon',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // Track real visitor
  const visitorIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'visitor';
  activeVisitors.set(visitorIp, Date.now());
  cleanVisitors();

  // --------------------------------------------------------------------------
  // REAL CHAT API ENDPOINTS
  // --------------------------------------------------------------------------
  if (pathname === '/api/chat' || pathname === '/api/messages') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    if (req.method === 'GET') {
      fs.readFile(MESSAGES_FILE, 'utf8', (err, data) => {
        let messages = [];
        try {
          messages = JSON.parse(data || '[]');
        } catch (e) {
          messages = [];
        }
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-cache' });
        res.end(JSON.stringify({
          success: true,
          online: Math.max(1, activeVisitors.size),
          messages: messages
        }));
      });
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk;
        if (body.length > 50000) req.destroy(); // Limit payload size
      });

      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}');
          const rawUser = String(payload.user || '').trim();
          const rawText = String(payload.text || '').trim();

          if (!rawText) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Message cannot be empty.' }));
            return;
          }

          // Sanitize
          const cleanUser = rawUser.slice(0, 30).replace(/[<>'"]/g, '') || 'Anonymous Fan';
          const cleanText = rawText.slice(0, 500);

          const newMessage = {
            id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
            user: cleanUser,
            text: cleanText,
            timestamp: new Date().toISOString()
          };

          fs.readFile(MESSAGES_FILE, 'utf8', (err, fileData) => {
            let messages = [];
            try {
              messages = JSON.parse(fileData || '[]');
            } catch (e) {
              messages = [];
            }

            messages.push(newMessage);
            // Keep last 150 real messages
            if (messages.length > 150) {
              messages = messages.slice(-150);
            }

            fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf8', () => {
              res.writeHead(201, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, message: newMessage }));
            });
          });
        } catch (parseErr) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload.' }));
        }
      });
      return;
    }
  }

  // --------------------------------------------------------------------------
  // STATIC ASSET SERVING
  // --------------------------------------------------------------------------
  let safePath = pathname;
  if (safePath === '/' || safePath === '') safePath = '/index.html';

  const fullPath = path.join(__dirname, safePath);

  // Security check: prevent directory traversal
  if (!fullPath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(fullPath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(fullPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Handle HTTP Range Requests for smooth 1080p video streaming
    const range = req.headers.range;
    if (range && (ext === '.mp4' || ext === '.webm')) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
      const chunksize = (end - start) + 1;

      const file = fs.createReadStream(fullPath, { start, end });
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stats.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });
      file.pipe(res);
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Accept-Ranges': 'bytes',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    });

    fs.createReadStream(fullPath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`[AVC Server] Real Chat API & Preview live at http://localhost:${PORT}`);
});
