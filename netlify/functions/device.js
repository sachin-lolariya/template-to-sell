const https = require('https');

// In-memory queue across warm serverless container invocations
let commandQueue = [];
let latestDeviceStatus = {
  battery: 'Unknown',
  isCharging: false,
  lastSeen: new Date().toISOString()
};

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: 'ok' };
  }

  const action = event.queryStringParameters?.action || 'status';

  // 1. Enqueue command (from Web HUD or Telegram)
  if (action === 'command' && event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}');
      const cmd = body.command || body.cmd;
      if (cmd) {
        commandQueue.push({
          id: Date.now().toString(),
          command: cmd,
          timestamp: new Date().toISOString()
        });
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ ok: true, queued: cmd, queueLength: commandQueue.length })
        };
      }
    } catch (e) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
    }
  }

  // 2. Poll command (called by Android Termux client every 3s)
  if (action === 'poll') {
    const nextCmd = commandQueue.shift() || null;
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ok: true,
        hasCommand: !!nextCmd,
        command: nextCmd
      })
    };
  }

  // 3. Report device status (called by Android Termux client)
  if (action === 'report' && event.httpMethod === 'POST') {
    try {
      const report = JSON.parse(event.body || '{}');
      latestDeviceStatus = {
        ...latestDeviceStatus,
        ...report,
        lastSeen: new Date().toISOString()
      };
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ ok: true, status: latestDeviceStatus })
      };
    } catch (e) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid report JSON' }) };
    }
  }

  // Default: Get device status
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      ok: true,
      device: latestDeviceStatus,
      pendingCommands: commandQueue.length
    })
  };
};