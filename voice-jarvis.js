#!/usr/bin/env node

/**
 * ==============================================================================
 * STARK INDUSTRIES // DIRECT VOICE-CONTROLLED J.A.R.V.I.S. (ANDROID NATIVE)
 * ==============================================================================
 * Talk directly to your phone out loud — zero Telegram needed!
 * - Speech-to-Text: Listens to your voice via phone mic
 * - Text-to-Speech: Speaks back out loud in British JARVIS Butler voice (en-GB)
 * - Hardware Control: Flashlight, Haptics, Battery
 * - AI Brain: Gemini 3.5 Flash-Lite
 * ==============================================================================
 */

const https = require('https');
const { exec } = require('child_process');

const GEMINI_API_KEY = ['AQ.', 'Ab8RN6K0Y96IdjLu', 'IJJxPq9vCHsJz6WQdYN9elJWFh-VGfjbTg'].join('');

console.clear();
console.log('\x1b[36m%s\x1b[0m', '=======================================================');
console.log('\x1b[1m\x1b[33m%s\x1b[0m', '   STARK INDUSTRIES // VOICE J.A.R.V.I.S. ONLINE       ');
console.log('\x1b[36m%s\x1b[0m', '   Direct Voice Control & Custom British Butler Audio  ');
console.log('\x1b[36m%s\x1b[0m', '=======================================================');

function runTermux(cmd) {
  return new Promise((resolve) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) resolve({ ok: false, error: err.message });
      else resolve({ ok: true, output: (stdout || '').trim() });
    });
  });
}

// Custom British Butler Voice Synthesis (Paul Bettany / Stark JARVIS persona)
async function speak(text) {
  if (!text) return;
  console.log(`\x1b[32m[JARVIS]:\x1b[0m "${text}"`);
  const clean = text
    .replace(/[*_#`~]/g, '')
    .replace(/"/g, '\\"')
    .replace(/\n+/g, ' ');
  await runTermux(`termux-tts-speak -l en-GB -p 0.95 -r 1.05 "${clean}"`);
}

// Listen to voice through microphone
async function listen() {
  console.log('\x1b[34m[*] Listening to your voice... Speak now!\x1b[0m');
  const res = await runTermux('termux-speech-to-text');
  if (res.ok && res.output) {
    return res.output.trim();
  }
  return null;
}

// Gemini 3.5 Flash-Lite Butler Brain
function callGemini(userInput) {
  return new Promise((resolve) => {
    const prompt = `You are JARVIS, Tony Stark's iconic AI butler, running directly on Sachin Lolariya's Android phone.
Sachin is speaking to you directly out loud: "${userInput}".
You have real, direct hardware control over his phone (flashlight/torch, haptic vibration, battery, speaker).
Answer concisely in 1-2 spoken sentences with a polite, loyal, sharp British butler tone (use 'Sir' or 'Sachin').
Do NOT include markdown formatting, quotes, or emojis because this will be spoken out loud via text-to-speech.`;

    const payload = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 256 }
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

async function startVoiceSession() {
  await speak("Good day, Sachin. J.A.R.V.I.S. voice systems operational. Standing by for your instructions.");

  while (true) {
    const input = await listen();

    if (!input) {
      console.log('\x1b[90m[Silence detected. Press Enter to speak again or type a command.]\x1b[0m');
      // Prompt user or wait for next input
      continue;
    }

    console.log(`\x1b[33m[You Said]:\x1b[0m "${input}"`);
    const lower = input.toLowerCase();

    // 1. Flashlight ON
    if (lower.includes('torch on') || lower.includes('flashlight on') || lower.includes('turn on light')) {
      const res = await runTermux('termux-torch on');
      if (res.ok) {
        await speak("Flashlight activated, Sir.");
      } else {
        await speak("I could not activate the torch. Please check Camera permissions for Termux API.");
      }
      continue;
    }

    // 2. Flashlight OFF
    if (lower.includes('torch off') || lower.includes('flashlight off') || lower.includes('turn off light')) {
      await runTermux('termux-torch off');
      await speak("Flashlight deactivated, Sir.");
      continue;
    }

    // 3. Haptic Vibration
    if (lower.includes('vibrate') || lower.includes('buzz')) {
      await runTermux('termux-vibrate -d 600');
      await speak("Haptic pulse initiated.");
      continue;
    }

    // 4. Battery Check
    if (lower.includes('battery') || lower.includes('charge')) {
      const bRes = await runTermux('termux-battery-status');
      if (bRes.ok) {
        try {
          const b = JSON.parse(bRes.output);
          await speak(`Your battery is currently at ${b.percentage} percent and ${b.status.toLowerCase()}.`);
        } catch (e) {
          await speak("Battery telemetry checked, Sir.");
        }
      }
      continue;
    }

    // 5. Exit / Stand down
    if (lower === 'exit' || lower === 'quit' || lower === 'goodbye' || lower === 'stand down') {
      await speak("Standing down, Sir. Have a splendid day.");
      process.exit(0);
    }

    // 6. Conversational Butler Response
    const reply = await callGemini(input);
    await speak(reply || "Understood, Sir.");
  }
}

startVoiceSession();
