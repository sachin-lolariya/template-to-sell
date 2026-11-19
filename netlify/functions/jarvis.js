const https = require('https');

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ALLOWED_CHAT_ID = process.env.ALLOWED_CHAT_ID;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO || 'sachin-lolariya/avengers-doomsday-countdown';

// Helper: Send Telegram Message
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
function githubRequest(endpoint, method = 'GET', body = null) {
  return new Promise((resolve) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = https.request({
      hostname: 'api.github.com',
      path: endpoint,
      method: method,
      headers: {
        'User-Agent': 'Cloud-Jarvis-Agent',
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        ...(payload ? {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        } : {})
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (err) => resolve({ status: 500, error: err.message }));
    if (payload) req.write(payload);
    req.end();
  });
}

// Helper: Gemini API
function callGemini(prompt) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 8192
      }
    });

    const pathUrl = `/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    const req = https.request({
      hostname: 'generativelanguage.googleapis.com',
      path: pathUrl,
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
          const text = json.candidates?.[0]?.content?.parts?.[0]?.text || null;
          resolve(text);
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
      [{ text: '⚡ Cloud Status' }, { text: '🌐 Live Website' }],
      [{ text: '🚀 Recent Commits' }, { text: '❓ Help' }]
    ],
    resize_keyboard: true,
    is_persistent: true
  }
};

// ==========================================
// NETLIFY SERVERLESS FUNCTION HANDLER
// ==========================================
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 200, body: 'Cloud JARVIS webhook endpoint is healthy.' };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, body: 'Bad request' };
  }

  const message = body.message || body.edited_message;
  if (!message || !message.text) {
    return { statusCode: 200, body: 'ok' };
  }

  const chatId = String(message.chat.id);
  const text = message.text.trim();

  // Security Lock: Only Sachin
  if (ALLOWED_CHAT_ID && chatId !== String(ALLOWED_CHAT_ID)) {
    await sendTelegram(chatId, `⛔ Access Denied. Cloud JARVIS is private property of Sachin Lolariya.`);
    return { statusCode: 200, body: 'forbidden' };
  }

  // 1. /start or Help
  if (text.startsWith('/start') || text === '❓ Help' || text.startsWith('/help')) {
    const welcome = `☁️ *Cloud JARVIS Online 24/7*

Good day, sir. I am running continuously in the Netlify Cloud.
*Your laptop can be completely turned off* and I will still execute all your coding and git tasks!

*Touch Buttons:*
• ⚡ *Cloud Status* - Verify cloud health, repo, and live deployment
• 🌐 *Live Website* - Open your live Netlify website
• 🚀 *Recent Commits* - View latest updates pushed to GitHub

*Natural Language Tasks:*
You can text me anything you want changed on your website:
• *"Change the banner title to AVENGERS: DOOMSDAY // CLOUD EDITION"*
• *"In style.css, make the background darker with a gold glow"*
• *"Add a new disclaimer footer to index.html"*

I will edit the code, commit it to GitHub, and deploy it live automatically!`;

    await sendTelegram(chatId, welcome, MAIN_KEYBOARD);
    return { statusCode: 200, body: 'ok' };
  }

  // 2. ⚡ Cloud Status
  if (text === '⚡ Cloud Status' || text === '/status') {
    const ghRes = await githubRequest(`/repos/${GITHUB_REPO}/commits?per_page=1`);
    let lastCommit = 'Unknown';
    if (ghRes.status === 200 && Array.isArray(ghRes.data) && ghRes.data[0]) {
      lastCommit = `\`${ghRes.data[0].sha.slice(0, 7)}\` - ${ghRes.data[0].commit.message}`;
    }

    const statusMsg = `☁️ *Cloud JARVIS Status Report:*
• *Platform:* Netlify Cloud Serverless (24/7)
• *Laptop Power:* Not required (Laptop can be OFF)
• *Repository:* \`${GITHUB_REPO}\`
• *Latest Commit:* ${lastCommit}
• *Live URL:* [avengerscountdown.com](https://avengers-doomsday-countdown-pmk3.netlify.app)
• *AI Brain:* Google Gemini 2.0 Flash (Active)`;

    await sendTelegram(chatId, statusMsg, MAIN_KEYBOARD);
    return { statusCode: 200, body: 'ok' };
  }

  // 3. 🌐 Live Website
  if (text === '🌐 Live Website' || text === '/site') {
    await sendTelegram(chatId, `🌐 *Your Live Website:*
https://avengers-doomsday-countdown-pmk3.netlify.app

✨ Every time you ask Cloud JARVIS to make changes, Netlify automatically updates this live site in 15 seconds!`, MAIN_KEYBOARD);
    return { statusCode: 200, body: 'ok' };
  }

  // 4. 🚀 Recent Commits
  if (text === '🚀 Recent Commits' || text === '/commits') {
    const ghRes = await githubRequest(`/repos/${GITHUB_REPO}/commits?per_page=3`);
    if (ghRes.status === 200 && Array.isArray(ghRes.data)) {
      const list = ghRes.data.map(c => `• \`${c.sha.slice(0, 7)}\`: ${c.commit.message} _(${c.commit.author.name})_`).join('\n');
      await sendTelegram(chatId, `🚀 *Recent GitHub Commits:*\n\n${list}`, MAIN_KEYBOARD);
    } else {
      await sendTelegram(chatId, `⚠️ Could not fetch commits: HTTP ${ghRes.status}`, MAIN_KEYBOARD);
    }
    return { statusCode: 200, body: 'ok' };
  }

  // 5. 🧠 Natural Language Code Changes (Autonomous Cloud Agent)
  await sendTelegram(chatId, `⚡ *Task Received:* "${text}"\n\n🧠 Cloud JARVIS is analyzing repository files and writing code changes...`, MAIN_KEYBOARD);

  try {
    // Step A: Determine target file
    const plannerPrompt = `You are JARVIS, an autonomous AI web developer.
The user wants to make this change to their website: "${text}".
The repository contains the following files:
- index.html (Main landing page, hero, countdown, banners)
- css/style.css (Main styles, colors, animations)
- js/main.js (Countdown timer logic, sound, interactive features)
- includes/header.php
- includes/hero.php

Respond with ONLY the exact relative path of the single file that should be modified (e.g. "index.html" or "css/style.css" or "js/main.js"). Do not explain.`;

    let targetFile = await callGemini(plannerPrompt);
    if (targetFile) {
      targetFile = targetFile.replace(/[`"'\n\r]/g, '').trim();
    }
    if (!targetFile || targetFile.includes(' ')) {
      targetFile = 'index.html'; // default fallback
    }

    // Step B: Fetch current file content from GitHub
    const fileRes = await githubRequest(`/repos/${GITHUB_REPO}/contents/${targetFile}`);
    if (fileRes.status !== 200 || !fileRes.data || !fileRes.data.content) {
      await sendTelegram(chatId, `⚠️ Could not read file \`${targetFile}\` from GitHub repository.`, MAIN_KEYBOARD);
      return { statusCode: 200, body: 'ok' };
    }

    const currentContent = Buffer.from(fileRes.data.content, 'base64').toString('utf-8');
    const fileSha = fileRes.data.sha;

    // Step C: Ask Gemini to generate the updated code
    const coderPrompt = `You are JARVIS, an expert senior web developer.
The user wants to make this change: "${text}".

Here is the current content of "${targetFile}":
\`\`\`
${currentContent}
\`\`\`

Return the COMPLETE updated file content. Do NOT include markdown code fences (no \`\`\` or \`\`\`html or \`\`\`css). Output ONLY the raw updated file content from line 1 to the end so it can be saved directly.`;

    let updatedContent = await callGemini(coderPrompt);
    if (!updatedContent) {
      await sendTelegram(chatId, `⚠️ Gemini AI was unable to generate code changes for this task.`, MAIN_KEYBOARD);
      return { statusCode: 200, body: 'ok' };
    }

    // Clean any accidental markdown fence at start/end
    updatedContent = updatedContent.replace(/^```[a-zA-Z]*\n?/, '').replace(/\n?```$/, '');

    // Step D: Commit the new content directly to GitHub
    const commitRes = await githubRequest(`/repos/${GITHUB_REPO}/contents/${targetFile}`, 'PUT', {
      message: `Cloud JARVIS: ${text.slice(0, 70)}`,
      content: Buffer.from(updatedContent).toString('base64'),
      sha: fileSha
    });

    if (commitRes.status === 200 || commitRes.status === 201) {
      const commitSha = commitRes.data.commit?.sha?.slice(0, 7) || 'latest';
      const successMsg = `🎉 *Task Completed & Pushed!*

📄 *Modified:* \`${targetFile}\`
📌 *Commit:* \`${commitSha}\` - "Cloud JARVIS: ${text.slice(0, 50)}"
🚀 *Netlify Deploy:* Building live automatically!

🌐 *View Live Site:*
https://avengers-doomsday-countdown-pmk3.netlify.app

💡 _When you get back to your laptop, just run \`git pull\` to download these changes!_`;

      await sendTelegram(chatId, successMsg, MAIN_KEYBOARD);
    } else {
      await sendTelegram(chatId, `❌ Failed to commit to GitHub: ${commitRes.data?.message || 'Error'}`, MAIN_KEYBOARD);
    }
  } catch (err) {
    await sendTelegram(chatId, `❌ Error processing task: ${err.message}`, MAIN_KEYBOARD);
  }

  return { statusCode: 200, body: 'ok' };
};
