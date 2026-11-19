const https = require('https');

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ALLOWED_CHAT_ID = process.env.ALLOWED_CHAT_ID;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const STATE_REPO = process.env.GITHUB_REPO || 'sachin-lolariya/avengers-doomsday-countdown';
const STATE_FILE = '.jarvis-state.json';

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

// Helper: Answer Telegram Callback Query
function answerCallback(queryId, text = '') {
  return new Promise((resolve) => {
    const payload = JSON.stringify({ callback_query_id: queryId, text });
    const req = https.request({
      hostname: 'api.telegram.org',
      path: `/bot${TELEGRAM_TOKEN}/answerCallbackQuery`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, () => resolve());
    req.on('error', () => resolve());
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

// State Management: Get & Set Active Repository across Serverless Invocations
async function getActiveRepo() {
  const res = await githubRequest(`/repos/${STATE_REPO}/contents/${STATE_FILE}`);
  if (res.status === 200 && res.data && res.data.content) {
    try {
      const parsed = JSON.parse(Buffer.from(res.data.content, 'base64').toString('utf-8'));
      if (parsed.activeRepo) return { repo: parsed.activeRepo, sha: res.data.sha };
    } catch (e) {}
  }
  return { repo: STATE_REPO, sha: null };
}

async function setActiveRepo(newRepo, currentSha) {
  const content = JSON.stringify({ activeRepo: newRepo, updatedAt: new Date().toISOString() }, null, 2);
  const body = {
    message: `Cloud JARVIS: Switch active repo to ${newRepo}`,
    content: Buffer.from(content).toString('base64'),
    ...(currentSha ? { sha: currentSha } : {})
  };
  return await githubRequest(`/repos/${STATE_REPO}/contents/${STATE_FILE}`, 'PUT', body);
}

// Helper: Gemini API
function callGemini(prompt) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 8192 }
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
      [{ text: '⚡ Cloud Status' }, { text: '📂 Repositories' }],
      [{ text: '🌐 Live Website' }, { text: '🚀 Recent Commits' }],
      [{ text: '❓ Help' }]
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

  // Handle Button Callbacks (Inline Keyboards)
  if (body.callback_query) {
    const query = body.callback_query;
    const chatId = String(query.message.chat.id);
    const data = query.data;

    await answerCallback(query.id);

    if (ALLOWED_CHAT_ID && chatId !== String(ALLOWED_CHAT_ID)) {
      await sendTelegram(chatId, `⛔ Access Denied.`);
      return { statusCode: 200, body: 'forbidden' };
    }

    if (data.startsWith('set_repo:')) {
      const chosenRepo = data.replace('set_repo:', '');
      const stateObj = await getActiveRepo();
      await setActiveRepo(chosenRepo, stateObj.sha);

      const msgSwitched = `✅ *Active Repository Switched!*

📂 *Current Repo:* \`${chosenRepo}\`

💡 *You can now text any code edits, features, or design changes and JARVIS will commit them directly to this repository!*`;

      await sendTelegram(chatId, msgSwitched, MAIN_KEYBOARD);
      return { statusCode: 200, body: 'ok' };
    }

    return { statusCode: 200, body: 'ok' };
  }

  // Handle Normal Text Messages
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

  const stateObj = await getActiveRepo();
  const currentRepo = stateObj.repo;

  // 1. /start or Help
  if (text.startsWith('/start') || text === '❓ Help' || text.startsWith('/help')) {
    const welcome = `☁️ *Cloud JARVIS Online 24/7*

Good day, sir. I am running continuously in the Netlify Cloud.
*Your laptop can be completely off* and I will manage and code across all your GitHub repositories!

*Quick Touch Buttons:*
• ⚡ *Cloud Status* - Health, active repo & latest commit
• 📂 *Repositories* - View & switch between your GitHub projects
• 🌐 *Live Website* - Open your live Netlify website
• 🚀 *Recent Commits* - View latest updates on current repo

*Mini-Antigravity AI (Text or Voice):*
You can text me ANY coding or design changes directly:
• *"Change the banner subtitle to 'PHASE VI // LIVE INVASION'"*
• *"In README.md, update the skills badge to include React and GSAP"*
• *"In style.css, make the countdown timer glow gold"*

I will analyze your code with Gemini AI, apply the changes, and commit directly to GitHub!`;

    await sendTelegram(chatId, welcome, MAIN_KEYBOARD);
    return { statusCode: 200, body: 'ok' };
  }

  // 2. 📂 Repositories (Multi-Project Switcher)
  if (text === '📂 Repositories' || text === '/repos') {
    const ghRes = await githubRequest(`/user/repos?sort=updated&per_page=12`);
    if (ghRes.status === 200 && Array.isArray(ghRes.data)) {
      const buttons = ghRes.data.map(r => [{
        text: (r.full_name === currentRepo ? `🟢 ${r.name} (Active)` : `📁 ${r.name}`),
        callback_data: `set_repo:${r.full_name}`
      }]);

      const inlineKeyboard = {
        reply_markup: { inline_keyboard: buttons }
      };

      await sendTelegram(chatId, `📂 *Your GitHub Repositories:*\n*Active Repository:* \`${currentRepo}\`\n\nTap any repository below to switch active context:`, inlineKeyboard);
    } else {
      await sendTelegram(chatId, `⚠️ Could not fetch repositories from GitHub (HTTP ${ghRes.status}).`, MAIN_KEYBOARD);
    }
    return { statusCode: 200, body: 'ok' };
  }

  // 3. ⚡ Cloud Status
  if (text === '⚡ Cloud Status' || text === '/status') {
    const ghRes = await githubRequest(`/repos/${currentRepo}/commits?per_page=1`);
    let lastCommit = 'Unknown';
    if (ghRes.status === 200 && Array.isArray(ghRes.data) && ghRes.data[0]) {
      lastCommit = `\`${ghRes.data[0].sha.slice(0, 7)}\` - ${ghRes.data[0].commit.message}`;
    }

    const isSiteRepo = currentRepo.includes('avengers');
    const liveLink = isSiteRepo ? '\n• *Live Website:* https://avengers-doomsday-countdown-pmk3.netlify.app' : '';

    const statusMsg = `☁️ *Cloud JARVIS Status Report:*
• *Platform:* Netlify Cloud Serverless (24/7)
• *Laptop Power:* Not required (Runs with laptop OFF)
• *Active Repository:* \`${currentRepo}\`
• *Latest Commit:* ${lastCommit}${liveLink}
• *AI Brain:* Google Gemini 2.0 Flash (Online)`;

    await sendTelegram(chatId, statusMsg, MAIN_KEYBOARD);
    return { statusCode: 200, body: 'ok' };
  }

  // 4. 🌐 Live Website
  if (text === '🌐 Live Website' || text === '/site') {
    await sendTelegram(chatId, `🌐 *Your Live Website:*
https://avengers-doomsday-countdown-pmk3.netlify.app

✨ Tap **📂 Repositories** to switch between projects anytime!`, MAIN_KEYBOARD);
    return { statusCode: 200, body: 'ok' };
  }

  // 5. 🚀 Recent Commits
  if (text === '🚀 Recent Commits' || text === '/commits') {
    const ghRes = await githubRequest(`/repos/${currentRepo}/commits?per_page=3`);
    if (ghRes.status === 200 && Array.isArray(ghRes.data)) {
      const list = ghRes.data.map(c => `• \`${c.sha.slice(0, 7)}\`: ${c.commit.message} _(${c.commit.author?.name || 'Dev'})_`).join('\n');
      await sendTelegram(chatId, `🚀 *Recent Commits in \`${currentRepo}\`:*\n\n${list}`, MAIN_KEYBOARD);
    } else {
      await sendTelegram(chatId, `⚠️ Could not fetch commits for \`${currentRepo}\`: HTTP ${ghRes.status}`, MAIN_KEYBOARD);
    }
    return { statusCode: 200, body: 'ok' };
  }

  // 6. 🧠 Mini-Antigravity AI: Autonomous Multi-Repo Code Changes
  await sendTelegram(chatId, `⚡ *Task Received:* "${text}"\n\n🧠 Cloud JARVIS is inspecting repository \`${currentRepo}\` and writing code...`, MAIN_KEYBOARD);

  try {
    // Step A: Inspect the file tree of the active repository
    let defaultBranch = 'main';
    let treeRes = await githubRequest(`/repos/${currentRepo}/git/trees/${defaultBranch}?recursive=1`);
    if (treeRes.status !== 200) {
      defaultBranch = 'master';
      treeRes = await githubRequest(`/repos/${currentRepo}/git/trees/${defaultBranch}?recursive=1`);
    }

    let fileList = [];
    if (treeRes.status === 200 && treeRes.data && Array.isArray(treeRes.data.tree)) {
      fileList = treeRes.data.tree
        .filter(item => item.type === 'blob' && !item.path.startsWith('.') && !item.path.includes('node_modules'))
        .map(item => item.path);
    }

    // Step B: Ask Gemini which file should be modified
    const plannerPrompt = `You are JARVIS, an autonomous AI web developer.
The user wants to make this change in repository "${currentRepo}": "${text}".
Here are the files available in this repository:
${fileList.slice(0, 40).map(f => '- ' + f).join('\n')}

Respond with ONLY the exact relative path of the single file that should be modified. Do not explain.`;

    let targetFile = await callGemini(plannerPrompt);
    if (targetFile) {
      targetFile = targetFile.replace(/[`"'\n\r]/g, '').trim();
    }
    if (!targetFile || targetFile.includes(' ') || !fileList.includes(targetFile)) {
      targetFile = fileList.find(f => f.endsWith('index.html') || f.endsWith('README.md') || f.endsWith('index.php')) || fileList[0] || 'README.md';
    }

    // Step C: Fetch current file content from GitHub
    const fileRes = await githubRequest(`/repos/${currentRepo}/contents/${targetFile}`);
    if (fileRes.status !== 200 || !fileRes.data || !fileRes.data.content) {
      await sendTelegram(chatId, `⚠️ Could not read file \`${targetFile}\` from repository \`${currentRepo}\`.`, MAIN_KEYBOARD);
      return { statusCode: 200, body: 'ok' };
    }

    const currentContent = Buffer.from(fileRes.data.content, 'base64').toString('utf-8');
    const fileSha = fileRes.data.sha;

    // Step D: Gemini generates the updated code
    const coderPrompt = `You are JARVIS, an expert senior developer.
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

    // Clean any accidental markdown fence
    updatedContent = updatedContent.replace(/^```[a-zA-Z]*\n?/, '').replace(/\n?```$/, '');

    // Step E: Commit and push the new content to GitHub
    const commitRes = await githubRequest(`/repos/${currentRepo}/contents/${targetFile}`, 'PUT', {
      message: `Cloud JARVIS: ${text.slice(0, 70)}`,
      content: Buffer.from(updatedContent).toString('base64'),
      sha: fileSha,
      branch: defaultBranch
    });

    if (commitRes.status === 200 || commitRes.status === 201) {
      const commitSha = commitRes.data.commit?.sha?.slice(0, 7) || 'latest';
      const isSiteRepo = currentRepo.includes('avengers');
      const liveNote = isSiteRepo ? '\n🚀 *Live Netlify Site:* https://avengers-doomsday-countdown-pmk3.netlify.app' : '';

      const successMsg = `🎉 *Task Completed & Pushed!*

📂 *Repository:* \`${currentRepo}\`
📄 *Modified:* \`${targetFile}\`
📌 *Commit:* \`${commitSha}\` - "Cloud JARVIS: ${text.slice(0, 50)}"${liveNote}

💡 _Your changes are permanently saved in GitHub!_`;

      await sendTelegram(chatId, successMsg, MAIN_KEYBOARD);
    } else {
      await sendTelegram(chatId, `❌ Failed to commit to GitHub: ${commitRes.data?.message || 'Error'}`, MAIN_KEYBOARD);
    }
  } catch (err) {
    await sendTelegram(chatId, `❌ Error processing task: ${err.message}`, MAIN_KEYBOARD);
  }

  return { statusCode: 200, body: 'ok' };
};
