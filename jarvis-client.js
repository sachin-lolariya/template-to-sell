#!/usr/bin/env node

/**
 * ==============================================================================
 * STARK INDUSTRIES // CLOUD JARVIS ANDROID MOBILE NODE (OPTION 1)
 * ==============================================================================
 * Runs locally inside Termux on Android.
 * Connects physical phone hardware to Cloud JARVIS via Realtime Neural Stream:
 * - 🔦 Flashlight / Torch (termux-torch)
 * - 🗣️ Phone Speaker Voice (termux-tts-speak)
 * - 📳 Haptic Vibration (termux-vibrate)
 * - 🔋 Battery & Hardware Status (termux-battery-status)
 * - 🌐 App / URL Launcher (termux-open-url)
 * ==============================================================================
 */

const https = require('https');
const { exec } = require('child_process');

const CHANNEL_TOPIC = 'sachin-jarvis-phone-1710658979';
const STREAM_URL = `https://ntfy.sh/${CHANNEL_TOPIC}/raw`;

console.clear();
console.log('\x1b[36m%s\x1b[0m', '=======================================================');
console.log('\x1b[1m\x1b[33m%s\x1b[0m', '   STARK INDUSTRIES // J.A.R.V.I.S. MOBILE NODE');
console.log('\x1b[36m%s\x1b[0m', '   Option 1: Real-time Android Hardware Bridge Active');
console.log('\x1b[36m%s\x1b[0m', '=======================================================');
console.log('\x1b[32m%s\x1b[0m', `[✔] Channel: ${CHANNEL_TOPIC}`);
console.log('\x1b[90m%s\x1b[0m', `[*] Real-time streaming connection active (0ms latency)...\n`);

// Announce on phone speaker
runTermuxCmd('termux-tts-speak "Stark Mobile Node initialized, Sir. Ready for hardware commands."');

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

async function executeAction(actionStr) {
  const str = (actionStr || '').trim();
  if (!str) return;
  const lower = str.toLowerCase();
  const timestamp = new Date().toLocaleTimeString();

  console.log(`\x1b[33m[${timestamp}] ⚡ Incoming Order:\x1b[0m "${str}"`);

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
    await runTermuxCmd('termux-vibrate -d 600');
    return;
  }

  // 3. Text to Speech (Speak on phone speaker)
  if (lower.startsWith('tts') || lower.startsWith('speak') || lower.includes('speak on phone')) {
    const textToSpeak = str
      .replace(/^speak on phone:?\s*/i, '')
      .replace(/^speak:?\s*/i, '')
      .replace(/^tts:?\s*/i, '') || "Order acknowledged, Sir.";
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
      } catch (e) {
        await runTermuxCmd('termux-tts-speak "Battery check complete."');
      }
    }
    return;
  }

  // 5. Open WebApp / URL
  if (lower.includes('open-url') || lower.includes('open webapp') || lower.includes('launch webapp')) {
    console.log(' -> Launching In-App WebApp');
    await runTermuxCmd('termux-open-url "https://avengers-doomsday-countdown-pmk3.netlify.app/hud"');
    return;
  }

  // Fallback speech
  await runTermuxCmd(`termux-tts-speak "${str.replace(/"/g, '\\"')}"`);
}

// Real-time Stream Subscriber (Instant 0ms latency)
function listenRealtime() {
  console.log('\x1b[32m%s\x1b[0m', '📡 Realtime listener connecting...');
  const req = https.get(STREAM_URL, (res) => {
    res.on('data', async (chunk) => {
      const lines = chunk.toString().split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed) {
          await executeAction(trimmed);
        }
      }
    });
    res.on('end', () => {
      console.log('Stream disconnected, reconnecting in 2s...');
      setTimeout(listenRealtime, 2000);
    });
  });

  req.on('error', (err) => {
    console.log('Connection retry in 3s:', err.message);
    setTimeout(listenRealtime, 3000);
  });
}

listenRealtime();
