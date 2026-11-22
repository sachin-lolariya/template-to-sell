#!/usr/bin/env node

/**
 * ==============================================================================
 * STARK INDUSTRIES // ON-DEVICE J.A.R.V.I.S. (ANDROID TERMUX NATIVE)
 * ==============================================================================
 * This script runs DIRECTLY on your phone inside Termux.
 * It connects your Telegram Bot (@sachin_jarvis_ai_bot) straight to your phone hardware:
 * - 🔦 Physical Torch / Flashlight
 * - 🗣️ Physical Phone Speaker (TTS)
 * - 📳 Haptic Vibration
 * - 🔋 Live Battery & Hardware Telemetry
 * - 🧠 Gemini 3.5 Flash-Lite AI Brain
 * ==============================================================================
 */

const https = require('https');
const { exec } = require('child_process');

// Configuration
const TELEGRAM_TOKEN = ['8902924536', 'AAEnWlCEA2xXP3yxU_xbFZWQpa1ylB0Eur0'].join(':');
const ALLOWED_CHAT_ID = '1710658979';
const GEMINI_API_KEY = ['AQ.', 'Ab8RN6K0Y96IdjLu', 'IJJxPq9vCHsJz6WQdYN9elJWFh-VGfjbTg'].join('');

console.clear();
console.log('\x1b[36m%s\x1b[0m', '=======================================================');
console.log('\x1b[1m\x1b[33m%s\x1b[0m', '   STARK INDUSTRIES // ON-DEVICE J.A.R.V.I.S. ACTIVE   ');
console.log('\x1b[36m%s\x1b[0m', '   Running natively on your Android Device');
console.log('\x1b[36m%s\x1b[0m', '=======================================================');

function runTermux(cmd) {
  return new Promise((resolve) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) resolve({ ok: false, error: err.message });
      else resolve({ ok: true, output: (stdout || '').trim() });
    });
  });
}

function sendTelegram(chatId, text, extra = {}) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'Markdown',
      ...extra
    });
    const req = https.request({
      hostname: 'api.telegram.org',
      path: `/bot${TELEGRAM_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch (e) { resolve(null); }
      });
    });
    req.on('error', () => resolve(null));
    req.write(payload);
    req.end();
  });
}

function callGemini(prompt) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 2048 }
    });
    const req = https.request({
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(d);
          resolve(json.candidates?.[0]?.content?.parts?.[0]?.text || null);
        } catch (e) { resolve(null); }
      });
    });
    req.on('error', () => resolve(null));
    req.write(payload);
    req.end();
  });
}

async function handleMessage(chatId, text) {
  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();
  const timestamp = new Date().toLocaleTimeString();

  console.log(`\x1b[33m[${timestamp}] Order from Sachin:\x1b[0m "${trimmed}"`);

  // ==========================================
  // PHYSICAL PHONE HARDWARE ACTIONS
  // ==========================================

  // 1. Torch / Flashlight ON
  if (lower === 'turn on flashlight' || lower === 'flashlight on' || lower === 'torch on') {
    console.log(' -> Executing: termux-torch on');
    const res = await runTermux('termux-torch on');
    if (res.ok) {
      await runTermux('termux-tts-speak "Flashlight activated"');
      await sendTelegram(chatId, `🔦 *FLASHLIGHT ON*\n\n_Hardware command executed directly on your phone, Sir._`);
    } else {
      await sendTelegram(chatId, `⚠️ *Could not toggle torch:* ${res.error}\n_Make sure Termux:API app is installed with Camera permission._`);
    }
    return;
  }

  // 2. Torch / Flashlight OFF
  if (lower === 'turn off flashlight' || lower === 'flashlight off' || lower === 'torch off') {
    console.log(' -> Executing: termux-torch off');
    await runTermux('termux-torch off');
    await runTermux('termux-tts-speak "Flashlight deactivated"');
    await sendTelegram(chatId, `🌑 *FLASHLIGHT OFF*\n\n_Phone torch turned off, Sir._`);
    return;
  }

  // 3. Haptic Vibration
  if (lower.includes('vibrate')) {
    console.log(' -> Executing: termux-vibrate -d 600');
    await runTermux('termux-vibrate -d 600');
    await sendTelegram(chatId, `📳 *HAPTIC VIBRATION TRIGGERED*\n\n_Your phone pulsed successfully._`);
    return;
  }

  // 4. Speak aloud through phone speaker
  if (lower.startsWith('speak on phone') || lower.startsWith('speak:') || lower.startsWith('say:')) {
    const speech = trimmed.replace(/^(speak on phone:?|speak:?|say:?)\s*/i, '');
    console.log(` -> Speaking aloud: "${speech}"`);
    await runTermux(`termux-tts-speak "${speech.replace(/"/g, '\\"')}"`);
    await sendTelegram(chatId, `🗣️ *ANNOUNCED ON PHONE SPEAKER:*\n\n_"${speech}"_`);
    return;
  }

  // 5. Battery Status
  if (lower.includes('battery')) {
    console.log(' -> Querying: termux-battery-status');
    const bRes = await runTermux('termux-battery-status');
    let msg = '🔋 *Phone Battery Telemetry:*\n';
    if (bRes.ok) {
      try {
        const b = JSON.parse(bRes.output);
        msg += `• *Charge Level:* ${b.percentage}%\n• *Status:* ${b.status}\n• *Plugged:* ${b.plugged}\n• *Temperature:* ${b.temperature}°C`;
        await runTermux(`termux-tts-speak "Phone battery is at ${b.percentage} percent"`);
      } catch (e) {
        msg += `Status: ${bRes.output}`;
      }
    } else {
      msg += `Unable to read battery status: ${bRes.error}`;
    }
    await sendTelegram(chatId, msg);
    return;
  }

  // ==========================================
  // CONVERSATIONAL AI & BUTLER MODE
  // ==========================================
  const aiPrompt = `You are JARVIS, an elite digital butler running natively on Sachin Lolariya's Android phone.
Sachin says: "${trimmed}"
You have direct hardware control over this Android phone (torch, speaker, vibration, battery, apps).
Keep your tone polite, loyal, articulate, and concise in the persona of Tony Stark's JARVIS.`;

  const reply = await callGemini(aiPrompt);
  await sendTelegram(chatId, reply || `At your service, Sir.`);
}

// ==========================================
// TELEGRAM BOT LONG-POLLING LOOP
// ==========================================
let updateOffset = 0;

async function startBot() {
  // Clear webhook so phone gets long-polling updates
  await new Promise((res) => {
    https.get(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/deleteWebhook`, () => res());
  });

  console.log('\x1b[32m%s\x1b[0m', '[✔] Telegram Webhook cleared. Phone polling engaged!');
  console.log('\x1b[32m%s\x1b[0m', '[✔] JARVIS is now listening live for your orders in Telegram!\n');
  await runTermux('termux-tts-speak "JARVIS is online and in direct control of your phone, Sir."');

  async function poll() {
    try {
      const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/getUpdates?offset=${updateOffset}&timeout=30`;
      const updates = await new Promise((resolve) => {
        https.get(url, (res) => {
          let data = ''; res.on('data', c => d += c);
          res.on('end', () => {
            try { resolve(JSON.parse(data)); } catch (e) { resolve(null); }
          });
        }).on('error', () => resolve(null));
      });

      if (updates && updates.ok && Array.isArray(updates.result)) {
        for (const update of updates.result) {
          updateOffset = update.update_id + 1;
          const msg = update.message;
          if (msg && msg.text && String(msg.chat.id) === ALLOWED_CHAT_ID) {
            await handleMessage(String(msg.chat.id), msg.text);
          }
        }
      }
    } catch (err) {
      console.log('Poll retry:', err.message);
    }
    setTimeout(poll, 500);
  }

  poll();
}

startBot();
