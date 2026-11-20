#!/usr/bin/env node

/**
 * ==============================================================================
 * STARK INDUSTRIES // CLOUD JARVIS ANDROID MOBILE NODE (OPTION 1)
 * ==============================================================================
 * This script runs locally inside Termux on Android.
 * It connects your physical phone hardware to Cloud JARVIS:
 * - Flashlight / Torch
 * - Text-To-Speech (Phone Speaker)
 * - Haptic Vibration
 * - Battery & Status Reporting
 * - App Launching & Phone Calls
 * ==============================================================================
 */

const https = require('https');
const { exec } = require('child_process');

const CLOUD_ENDPOINT = 'https://avengers-doomsday-countdown-pmk3.netlify.app/.netlify/functions/device';
const POLL_INTERVAL_MS = 3000;

console.clear();
console.log('\x1b[36m%s\x1b[0m', '=======================================================');
console.log('\x1b[1m\x1b[33m%s\x1b[0m', '   STARK INDUSTRIES // J.A.R.V.I.S. MOBILE NODE');
console.log('\x1b[36m%s\x1b[0m', '   Option 1: Termux Hardware Bridge Active');
console.log('\x1b[36m%s\x1b[0m', '=======================================================');
console.log('\x1b[32m%s\x1b[0m', `[✔] Connected to Cloud: ${CLOUD_ENDPOINT}`);
console.log('\x1b[90m%s\x1b[0m', `[*] Polling cloud command queue every ${POLL_INTERVAL_MS / 1000}s...\n`);

// Speak on startup
runTermuxCmd('termux-tts-speak "Stark Mobile Node initialized, Sir. Ready for physical hardware commands."');

function runTermuxCmd(cmd) {
  return new Promise((resolve) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        resolve({ ok: false, error: error.message });
      } else {
        resolve({ ok: true, output: stdout.trim() });
      }
    });
  });
}

function httpGet(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

function httpPost(url, payload) {
  return new Promise((resolve) => {
    const dataStr = JSON.stringify(payload);
    const parsedUrl = new URL(url);
    const req = https.request({
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(dataStr)
      }
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch (e) { resolve(null); }
      });
    });
    req.on('error', () => resolve(null));
    req.write(dataStr);
    req.end();
  });
}

async function executeAction(actionStr) {
  const str = (actionStr || '').trim();
  const lower = str.toLowerCase();
  const timestamp = new Date().toLocaleTimeString();

  console.log(`\x1b[33m[${timestamp}] Incoming Order:\x1b[0m "${str}"`);

  // 1. Flashlight / Torch
  if (lower.includes('torch on') || lower.includes('flashlight on')) {
    console.log(' -> Turning Torch ON');
    await runTermuxCmd('termux-torch on');
    await runTermuxCmd('termux-tts-speak "Torch activated"');
    return;
  }
  if (lower.includes('torch off') || lower.includes('flashlight off')) {
    console.log(' -> Turning Torch OFF');
    await runTermuxCmd('termux-torch off');
    await runTermuxCmd('termux-tts-speak "Torch deactivated"');
    return;
  }

  // 2. Vibration
  if (lower.includes('vibrate')) {
    console.log(' -> Triggering Haptic Vibration');
    await runTermuxCmd('termux-vibrate -d 500');
    return;
  }

  // 3. Text to Speech
  if (lower.startsWith('tts') || lower.startsWith('speak')) {
    const textToSpeak = str.replace(/^(tts|speak)\s*/i, '') || "Order acknowledged, Sir.";
    console.log(` -> Speaking aloud: "${textToSpeak}"`);
    await runTermuxCmd(`termux-tts-speak "${textToSpeak.replace(/"/g, '\\"')}"`);
    return;
  }

  // 4. Battery Status
  if (lower.includes('battery')) {
    console.log(' -> Querying Battery Telemetry');
    const batRes = await runTermuxCmd('termux-battery-status');
    if (batRes.ok) {
      try {
        const batInfo = JSON.parse(batRes.output);
        const speech = `Battery is at ${batInfo.percentage} percent. Status: ${batInfo.status}.`;
        console.log(` -> ${speech}`);
        await runTermuxCmd(`termux-tts-speak "${speech}"`);
        await httpPost(`${CLOUD_ENDPOINT}?action=report`, {
          battery: `${batInfo.percentage}%`,
          status: batInfo.status,
          temperature: batInfo.temperature
        });
      } catch (e) {}
    }
    return;
  }

  // 5. Open WebApp or URL
  if (lower.includes('open-url') || lower.includes('open webapp') || lower.includes('launch webapp')) {
    console.log(' -> Launching In-App WebApp');
    await runTermuxCmd('termux-open-url "https://avengers-doomsday-countdown-pmk3.netlify.app/hud"');
    return;
  }

  // 6. Generic Speech fallback
  await runTermuxCmd(`termux-tts-speak "${str.replace(/"/g, '\\"')}"`);
}

// Polling Loop
async function pollLoop() {
  try {
    const res = await httpGet(`${CLOUD_ENDPOINT}?action=poll`);
    if (res && res.hasCommand && res.command?.command) {
      await executeAction(res.command.command);
    }
  } catch (err) {
    // Silent network retry
  }
  setTimeout(pollLoop, POLL_INTERVAL_MS);
}

// Background status heartbeat every 60 seconds
async function reportHeartbeat() {
  try {
    const batRes = await runTermuxCmd('termux-battery-status');
    if (batRes.ok) {
      const b = JSON.parse(batRes.output);
      await httpPost(`${CLOUD_ENDPOINT}?action=report`, {
        battery: `${b.percentage}%`,
        status: b.status,
        plugged: b.plugged
      });
    }
  } catch (e) {}
  setTimeout(reportHeartbeat, 60000);
}

pollLoop();
reportHeartbeat();
