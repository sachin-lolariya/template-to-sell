const https = require('https');

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ALLOWED_CHAT_ID = process.env.ALLOWED_CHAT_ID || '1710658979';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const STATE_REPO = process.env.GITHUB_REPO || 'sachin-lolariya/avengers-doomsday-countdown';

// Bot tokens to monitor
const BOT_FLEET = [
  { name: 'Jarvis Assistant', handle: '@sachin_jarvis_ai_bot', token: process.env.TELEGRAM_BOT_TOKEN || '8902924536:AAEnWlCEA2xXP3yxU_xbFZWQpa1ylB0Eur0' },
  { name: 'Mobile & Game Builder', handle: '@sachin_appbuilder_bot', token: '8689464042:AAEpbxtWM3daawqJnwBpuJ8WOX6u3OrrpEo' }
];

// Live sites to monitor
const SITES_TO_CHECK = [
  { name: 'Avengers Doomsday Countdown', url: 'https://avengers-doomsday-countdown-pmk3.netlify.app' },
  { name: 'Mobile & Game Builder App Hub', url: 'https://sachin-app-builder-bot.netlify.app' }
];

// Helper: HTTP GET Request
function httpGet(url) {
  return new Promise((resolve) => {
    const parsed = new URL(url);
    const req = https.request({
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: 'GET',
      headers: { 'User-Agent': 'Cloud-Jarvis-Monitor' }
    }, (res) => {
      resolve({ status: res.statusCode });
    });
    req.on('error', (err) => resolve({ status: 500, error: err.message }));
    req.end();
  });
}

// Helper: Send Telegram Message
function sendTelegram(chatId, text, extra = {}) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'Markdown',
      disable_web_page_preview: false,
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
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });

    req.on('error', () => resolve(null));
    req.write(payload);
    req.end();
  });
}

// Helper: GitHub API Request
function githubRequest(endpoint) {
  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.github.com',
      path: endpoint,
      method: 'GET',
      headers: {
        'User-Agent': 'Cloud-Jarvis-Agent',
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', () => resolve({ status: 500, data: null }));
    req.end();
  });
}

// Helper: Gemini AI Prompt
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
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.candidates?.[0]?.content?.parts?.[0]?.text || null);
        } catch (e) {
          resolve(null);
        }
      });
    });

    req.on('error', () => resolve(null));
    req.write(payload);
    req.end();
  });
}

const MAIN_KEYBOARD = {
  reply_markup: {
    keyboard: [
      [{ text: '💡 Think & Suggest' }, { text: '⚡ Cloud Status' }],
      [{ text: '📂 Repositories' }, { text: '🌅 Briefing' }],
      [{ text: '🌐 Live Website' }, { text: '🚀 Recent Commits' }],
      [{ text: '❓ Help' }]
    ],
    resize_keyboard: true,
    is_persistent: true
  }
};

// ==========================================
// CORE EXECUTIVE STANDUP GENERATOR
// ==========================================
async function generateAndSendMorningBriefing(chatId) {
  // 1. Check Bot Fleet Health
  const botResults = [];
  for (const bot of BOT_FLEET) {
    const info = await new Promise((res) => {
      const req = https.request(`https://api.telegram.org/bot${bot.token}/getWebhookInfo`, (r) => {
        let d = '';
        r.on('data', c => d += c);
        r.on('end', () => {
          try { res(JSON.parse(d)); } catch (e) { res(null); }
        });
      });
      req.on('error', () => res(null));
      req.end();
    });

    if (info && info.ok) {
      const isHealthy = !info.result.last_error_message;
      botResults.push({
        name: bot.name,
        handle: bot.handle,
        status: isHealthy ? '🟢 LIVE & HEALTHY' : '🟡 ATTENTION NEEDED',
        error: info.result.last_error_message || null
      });
    } else {
      botResults.push({
        name: bot.name,
        handle: bot.handle,
        status: '🔴 OFFLINE / UNREACHABLE',
        error: 'Webhook query failed'
      });
    }
  }

  // 2. Check Live Websites
  const siteResults = [];
  for (const site of SITES_TO_CHECK) {
    const res = await httpGet(site.url);
    const isUp = res.status === 200;
    siteResults.push({
      name: site.name,
      url: site.url,
      status: isUp ? '🟢 ONLINE (200 OK)' : `🔴 HTTP ${res.status}`
    });
  }

  // 3. Scan Recent GitHub Commits
  const reposRes = await githubRequest(`/user/repos?sort=pushed&per_page=5`);
  let recentCommitsText = 'Synced';
  const latestCommitsRes = await githubRequest(`/repos/${STATE_REPO}/commits?per_page=2`);
  if (latestCommitsRes.status === 200 && Array.isArray(latestCommitsRes.data)) {
    recentCommitsText = latestCommitsRes.data.map(c => `\`${c.sha.slice(0, 7)}\` - ${c.commit.message}`).join('\n');
  }

  // 4. Autonomous Gemini Synthesis
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const prompt = `You are JARVIS, Tony Stark's executive AI assistant, delivering the Morning Standup Briefing to Sachin Lolariya.
Current Date: ${dateStr} (10:30 AM IST).

System Diagnostics:
- Bot Fleet:
${botResults.map(b => `• ${b.name} (${b.handle}): ${b.status}${b.error ? ` [Issue: ${b.error}]` : ''}`).join('\n')}

- Live Websites:
${siteResults.map(s => `• ${s.name}: ${s.status}`).join('\n')}

- Recent GitHub Activity (${STATE_REPO}):
${recentCommitsText}

Synthesize a motivating, sharp, Tony Stark-level executive morning briefing.
Structure your reply exactly as follows:
🌅 *Good Morning, Sir! Here is your 10:30 AM Executive Briefing:*

🤖 *Bot Fleet & System Status:*
(List each bot with clean status. If Mobile & Game Builder is 401/needs public visibility, note: "Needs Project Visibility set to Public in Netlify")

🌐 *Live Web Services:*
(List the status of live sites)

📊 *Recent Velocity:*
(Brief summary of latest updates)

🎯 *Recommended Focus for Today:*
(1 clear, high-priority milestone to achieve today)

💡 *JARVIS Proactive Suggestions (What We Can Do Today):*
(Give 3 exciting, creative, actionable ideas we can build today across your projects — e.g. adding new visual animations to the countdown, launching a new casual game on the builder, or optimizing mobile UX)

Keep the tone energetic, confident, loyal, and inspiring.`;

  const briefingContent = await callGemini(prompt);
  const finalMsg = briefingContent || `🌅 *Good Morning, Sir! (10:30 AM Standup)*\n\nAll cloud systems are operating. Ready for autonomous builds anytime!`;

  await sendTelegram(chatId, finalMsg, MAIN_KEYBOARD);
}

// Scheduled Function Handler
exports.handler = async (event) => {
  console.log('Running 10:30 AM IST Daily Scheduled Standup...');
  await generateAndSendMorningBriefing(ALLOWED_CHAT_ID);
  return { statusCode: 200, body: 'Daily standup delivered.' };
};
