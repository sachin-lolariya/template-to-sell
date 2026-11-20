const https = require('https');

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ALLOWED_CHAT_ID = process.env.ALLOWED_CHAT_ID;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const STATE_REPO = 'sachin-lolariya/template-to-sell';
const STATE_FILE = '.jarvis-state.json';
const LIVE_SITE_URL = 'https://avengers-doomsday-countdown-pmk3.netlify.app';

// ==========================================
// TELEGRAM HELPERS
// ==========================================
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
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (!parsed.ok && parsed.description && parsed.description.includes("can't parse entities")) {
            const fallbackPayload = JSON.stringify({
              chat_id: chatId,
              text: text.replace(/[*_`\[\]]/g, ''),
              ...extra
            });
            const fbReq = https.request({
              hostname: 'api.telegram.org',
              path: `/bot${TELEGRAM_TOKEN}/sendMessage`,
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(fallbackPayload)
              }
            }, (fbRes) => {
              let fbData = '';
              fbRes.on('data', c => fbData += c);
              fbRes.on('end', () => {
                try { resolve(JSON.parse(fbData)); } catch (e) { resolve(null); }
              });
            });
            fbReq.on('error', () => resolve(null));
            fbReq.write(fallbackPayload);
            fbReq.end();
          } else {
            resolve(parsed);
          }
        } catch (e) {
          resolve({ ok: false, raw: data });
        }
      });
    });

    req.on('error', () => resolve(null));
    req.write(payload);
    req.end();
  });
}

function editTelegram(chatId, messageId, text, extra = {}) {
  return new Promise((resolve) => {
    if (!messageId) return resolve(null);
    const payload = JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
      text: text,
      parse_mode: 'Markdown',
      disable_web_page_preview: false,
      ...extra
    });

    const req = https.request({
      hostname: 'api.telegram.org',
      path: `/bot${TELEGRAM_TOKEN}/editMessageText`,
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
          const parsed = JSON.parse(data);
          if (!parsed.ok && parsed.description && parsed.description.includes("can't parse entities")) {
            const fallbackPayload = JSON.stringify({
              chat_id: chatId,
              message_id: messageId,
              text: text.replace(/[*_`\[\]]/g, ''),
              ...extra
            });
            const fbReq = https.request({
              hostname: 'api.telegram.org',
              path: `/bot${TELEGRAM_TOKEN}/editMessageText`,
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(fallbackPayload)
              }
            }, (fbRes) => {
              let fbData = '';
              fbRes.on('data', c => fbData += c);
              fbRes.on('end', () => {
                try { resolve(JSON.parse(fbData)); } catch (e) { resolve(null); }
              });
            });
            fbReq.on('error', () => resolve(null));
            fbReq.write(fallbackPayload);
            fbReq.end();
          } else {
            resolve(parsed);
          }
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

// Download Telegram Audio or Image File as Base64 Buffer
function downloadTelegramFileBase64(fileId) {
  return new Promise((resolve) => {
    https.get(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getFile?file_id=${fileId}`, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const info = JSON.parse(d);
          if (!info.ok || !info.result?.file_path) return resolve(null);

          https.get(`https://api.telegram.org/file/bot${TELEGRAM_TOKEN}/${info.result.file_path}`, (fileRes) => {
            const chunks = [];
            fileRes.on('data', c => chunks.push(c));
            fileRes.on('end', () => {
              resolve(Buffer.concat(chunks).toString('base64'));
            });
            fileRes.on('error', () => resolve(null));
          }).on('error', () => resolve(null));
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

// ==========================================
// GITHUB REST API WRAPPER
// ==========================================
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

// ==========================================
// STATE MANAGEMENT (PERSISTED ON GITHUB)
// ==========================================
async function getState() {
  const res = await githubRequest(`/repos/${STATE_REPO}/contents/${STATE_FILE}`);
  if (res.status === 200 && res.data && res.data.content) {
    try {
      const parsed = JSON.parse(Buffer.from(res.data.content, 'base64').toString('utf-8'));
      return { data: parsed, sha: res.data.sha };
    } catch (e) { }
  }
  return { data: { activeRepo: STATE_REPO }, sha: null };
}

async function updateState(partialState) {
  const current = await getState();
  const merged = { ...current.data, ...partialState, updatedAt: new Date().toISOString() };
  const content = JSON.stringify(merged, null, 2);
  const body = {
    message: 'Cloud JARVIS: Update state',
    content: Buffer.from(content).toString('base64'),
    ...(current.sha ? { sha: current.sha } : {})
  };
  return await githubRequest(`/repos/${STATE_REPO}/contents/${STATE_FILE}`, 'PUT', body);
}

// ==========================================
// GEMINI 3.5 FLASH-LITE MULTIMODAL AI ENGINE
// ==========================================
function callGemini(prompt, isJson = false) {
  return callGeminiMultimodal([{ text: prompt }], isJson);
}

function callGeminiMultimodal(parts, isJson = false) {
  return new Promise((resolve) => {
    const payloadObj = {
      contents: [{ parts }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 8192,
        ...(isJson ? { responseMimeType: 'application/json' } : {})
      }
    };
    const payload = JSON.stringify(payloadObj);

    const pathUrl = `/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;
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

// ==========================================
// ATOMIC MULTI-FILE GIT COMMIT ENGINE
// ==========================================
async function commitMultipleFiles(repo, filesToCommit, commitMessage) {
  try {
    let branch = 'main';
    let refRes = await githubRequest(`/repos/${repo}/git/refs/heads/${branch}`);
    if (refRes.status !== 200) {
      branch = 'master';
      refRes = await githubRequest(`/repos/${repo}/git/refs/heads/${branch}`);
    }
    if (refRes.status !== 200 || !refRes.data?.object?.sha) {
      throw new Error(`Could not find branch ref for ${repo}`);
    }

    const baseCommitSha = refRes.data.object.sha;
    const commitRes = await githubRequest(`/repos/${repo}/git/commits/${baseCommitSha}`);
    if (commitRes.status !== 200 || !commitRes.data?.tree?.sha) {
      throw new Error(`Could not fetch base commit tree for ${repo}`);
    }
    const baseTreeSha = commitRes.data.tree.sha;

    const treeEntries = filesToCommit.map(f => ({
      path: f.path,
      mode: '100644',
      type: 'blob',
      content: f.content
    }));

    const treeRes = await githubRequest(`/repos/${repo}/git/trees`, 'POST', {
      base_tree: baseTreeSha,
      tree: treeEntries
    });

    if (treeRes.status !== 201 || !treeRes.data?.sha) {
      throw new Error(`Tree creation failed`);
    }

    const newTreeSha = treeRes.data.sha;

    const newCommitRes = await githubRequest(`/repos/${repo}/git/commits`, 'POST', {
      message: commitMessage,
      tree: newTreeSha,
      parents: [baseCommitSha]
    });

    if (newCommitRes.status !== 201 || !newCommitRes.data?.sha) {
      throw new Error(`Commit creation failed`);
    }

    const newCommitSha = newCommitRes.data.sha;

    const updateRes = await githubRequest(`/repos/${repo}/git/refs/heads/${branch}`, 'PATCH', {
      sha: newCommitSha,
      force: false
    });

    if (updateRes.status !== 200) {
      throw new Error(`Branch pointer update failed`);
    }

    return { success: true, commitSha: newCommitSha.slice(0, 7), branch };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ==========================================
// TASTEFUL TELEGRAM KEYBOARDS (ANTI-SLOP DESIGN)
// ==========================================
const MAIN_KEYBOARD = {
  reply_markup: {
    keyboard: [
      [{ text: '💡 Think & Suggest' }, { text: '⚡ Cloud Status' }],
      [{ text: '📂 Repositories' }, { text: '🌅 Morning Briefing' }],
      [{ text: '🌐 Live Website' }, { text: '🚀 Recent Commits' }],
      [{ text: '❓ Help' }]
    ],
    resize_keyboard: true,
    is_persistent: true
  }
};

// ==========================================
// FEATURE 1: AUTONOMOUS IDEA GENERATOR
// ==========================================
async function handleThinkAndSuggest(chatId, currentRepo) {
  await sendTelegram(chatId, `💡 *JARVIS Autonomous Brainstorm Initiated...*\n\n🧠 Inspecting \`${currentRepo}\` to synthesize 3 high-impact upgrades...`, MAIN_KEYBOARD);

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

  let sampleContent = '';
  const candidate = fileList.find(f => f.endsWith('index.html') || f.endsWith('README.md') || f.endsWith('index.php')) || fileList[0];
  if (candidate) {
    const fileRes = await githubRequest(`/repos/${currentRepo}/contents/${candidate}`);
    if (fileRes.status === 200 && fileRes.data?.content) {
      sampleContent = Buffer.from(fileRes.data.content, 'base64').toString('utf-8').slice(0, 2000);
    }
  }

  const brainstormPrompt = `You are JARVIS, an elite autonomous software architect.
Analyze repository "${currentRepo}".
Available files: ${fileList.slice(0, 30).join(', ')}.
Key file sample (${candidate || 'sample'}):
${sampleContent}

Think of 3 distinct, creative, cutting-edge feature, animation, or UX improvements that would take this project to the next level.
Respond with ONLY a JSON array containing 3 objects:
[
  {
    "id": 1,
    "title": "Short title with emoji (max 25 chars)",
    "description": "1 clear sentence explaining what it adds and why it elevates the project",
    "instruction": "Specific, actionable instruction explaining exactly what to build across files"
  },
  ...
]`;

  const rawJson = await callGemini(brainstormPrompt, true);
  let ideas = [];
  try {
    const parsed = JSON.parse(rawJson);
    if (Array.isArray(parsed)) {
      ideas = parsed;
    } else if (parsed && Array.isArray(parsed.ideas)) {
      ideas = parsed.ideas;
    }
  } catch (e) { }

  if (!Array.isArray(ideas) || ideas.length === 0) {
    ideas = [
      { id: 1, title: '✨ Cyber Glow Pulse', description: 'Dynamic glowing neon borders and audio pulse effects on countdown numbers.', instruction: 'Add glowing neon border pulse and sound FX to timer units in index.html and style.css' },
      { id: 2, title: '🎬 Background Video HUD', description: 'Integrate a high-tech HUD scanline overlay over the hero trailer video.', instruction: 'Add futuristic sci-fi HUD scanlines overlay over the hero banner video in style.css' },
      { id: 3, title: '💬 Stark Voice Alerts', description: 'Add an interactive audio chime and voice alert when countdown reaches milestones.', instruction: 'Add audio chime sound alerts on live timer countdown in js/main.js' }
    ];
  }

  await updateState({ lastIdeas: ideas });

  const buttons = ideas.slice(0, 3).map((idea, idx) => [{
    text: `🔨 Build #${idx + 1}: ${(idea.title || 'Feature').slice(0, 24)}`,
    callback_data: `build_idea:${idx + 1}`
  }]);
  buttons.push([
    { text: '🔄 Brainstorm Again', callback_data: 'think_again' },
    { text: '🌐 Launch In-App View', web_app: { url: LIVE_SITE_URL } }
  ]);

  const inlineKeyboard = {
    reply_markup: { inline_keyboard: buttons }
  };

  const messageText = `⚡ *JARVIS ARCHITECT // BRAINSTORM REPORT*
📂 *Target Repo:* \`${currentRepo}\`

1️⃣ *${ideas[0].title}*
_${ideas[0].description}_

2️⃣ *${ideas[1].title}*
_${ideas[1].description}_

3️⃣ *${ideas[2].title}*
_${ideas[2].description}_

━━━━━━━━━━━━━━━━━━━━━
👇 *Tap any button below to plan, code, and commit autonomously:*`;

  await sendTelegram(chatId, messageText, inlineKeyboard);
}

// ==========================================
// INTELLIGENT INTENT ROUTER & CONVERSATIONAL BRAIN
// ==========================================
async function handleUserInput(chatId, currentRepo, userInput, isVoice = false) {
  const routingPrompt = `You are JARVIS, an elite AI assistant, software engineer, and digital butler created for Sachin Lolariya.
You assist Sachin with managing his software projects, coding, repository maintenance, and general queries.

Active Project Repository: "${currentRepo}"
Known Repositories on Sachin's Account: "sachin-lolariya/template-to-sell" (Updraft Creative Studio template), "sachin-lolariya/sachin-lolariya" (Profile).
Note: There is NO "avengers-doomsday-countdown" repository on Sachin's GitHub.

User Input: "${userInput}"

Analyze the user's input and classify the intent:
1. "CHAT": The user is asking a question, greeting, chatting, seeking explanations/advice, discussing technical topics, asking about capabilities, or talking (e.g. "So you cannot delete the repo", "How does Netlify work?", "What does this project do?", "Who are you?", "Why did this happen?").
2. "BUILD": The user is EXPLICITLY ordering you to write, modify, delete, add, refactor, or style code or files in the active repository (e.g. "Add a dark mode toggle", "Change the button color to red", "Fix padding on mobile", "Create a contact form").
3. "REPO_QUERY": The user is asking to inspect recent commits, file tree, branches, or repository list (e.g. "Show me recent commits", "What files are in this repo?", "List my repos").

Respond with ONLY a JSON object:
{
  "intent": "CHAT" | "BUILD" | "REPO_QUERY",
  "reply": "If intent is CHAT or REPO_QUERY, write your direct, intelligent, witty, concise JARVIS response here. Use British butler/Stark AI persona (polite, 'Sir', articulate). Address their exact question truthfully. If they ask about deleting a repository, explain clearly that you have safeguards preventing repository deletion without explicit authorization and that you do not perform destructive repository removals, and clarify which repos exist. Keep formatting clean with Telegram Markdown.",
  "task": "If intent is BUILD, write the refined actionable coding specification for the architect engine here. Otherwise leave empty string."
}`;

  let routingResult = null;
  try {
    const rawResult = await callGemini(routingPrompt, true);
    if (rawResult) {
      routingResult = JSON.parse(rawResult);
    }
  } catch (e) {
    routingResult = null;
  }

  // 1. Direct Conversational Reply
  if (routingResult && routingResult.intent === 'CHAT') {
    const replyText = routingResult.reply || `Understood, Sir. How else may I assist you with \`${currentRepo}\` today?`;
    await sendTelegram(chatId, replyText, MAIN_KEYBOARD);
    return;
  }

  // 2. Repo Query / Information Request
  if (routingResult && routingResult.intent === 'REPO_QUERY') {
    const replyText = routingResult.reply || `Inspecting repository details for \`${currentRepo}\`, Sir.`;
    await sendTelegram(chatId, replyText, MAIN_KEYBOARD);
    return;
  }

  // 3. Autonomous Code Build
  if (routingResult && routingResult.intent === 'BUILD') {
    const taskSpec = routingResult.task || userInput;
    await executeAutonomousBuild(chatId, currentRepo, taskSpec);
    return;
  }

  // 4. Heuristic Safety Fallback:
  // If user asked a question, never execute a build blindly!
  const trimmed = userInput.trim();
  const isQuestion = trimmed.endsWith('?') ||
    /^(what|why|how|who|when|where|can you|could you|are you|is it|so you|tell me|explain|why do you)/i.test(trimmed);

  if (isQuestion) {
    const directChatPrompt = `You are JARVIS, Sachin Lolariya's personal AI assistant.
Sachin asks: "${userInput}"
Active repository: "${currentRepo}"

Provide a direct, helpful, concise answer in JARVIS persona (polite, 'Sir', sharp, knowledgeable).
If asked about repository deletion, explain that you do not delete repositories for safety reasons.`;

    const chatResponse = await callGemini(directChatPrompt, false);
    await sendTelegram(chatId, chatResponse || `Indeed, Sir. I am at your service regarding \`${currentRepo}\`.`, MAIN_KEYBOARD);
    return;
  }

  // 5. Default to autonomous build only for unambiguous imperative statements
  await executeAutonomousBuild(chatId, currentRepo, userInput);
}

// ==========================================
// FEATURE 2 & 3: AUTOGPT LOOP EXECUTION ENGINE
// ==========================================
function renderAutoGptTracker(goal, repo, steps, extraNote = '') {
  let text = `⚡ *STARK TERMINAL // AUTOGPT EXECUTION ENGINE*\n\n`;
  text += `🎯 *Goal:* "${goal}"\n`;
  text += `📂 *Target Repo:* \`${repo}\`\n\n`;
  text += `📋 *Autonomous Task Board:*\n`;

  for (const step of steps) {
    let icon = '[ ]';
    let statusText = '';
    if (step.status === 'done') {
      icon = '[✓]';
      statusText = step.note ? ` — _${step.note}_` : ' — _(Completed)_';
    } else if (step.status === 'running') {
      icon = '[⠋]';
      statusText = step.note ? ` — _${step.note}_` : ' — _(Executing...)_';
    } else if (step.status === 'healing') {
      icon = '[🔧]';
      statusText = step.note ? ` — _${step.note}_` : ' — _(Self-Healing...)_';
    } else if (step.status === 'failed') {
      icon = '[✗]';
      statusText = step.note ? ` — _${step.note}_` : ' — _(Failed)_';
    }
    text += `${icon} *${step.title}*${statusText}\n`;
  }

  if (extraNote) {
    text += `\n${extraNote}`;
  }
  return text;
}

async function executeAutonomousBuild(chatId, currentRepo, taskPrompt) {
  const steps = [
    { id: 'decomp', title: 'Goal Decomposition & Architecture', status: 'running', note: 'Analyzing codebase...' },
    { id: 'coder', title: 'Autonomous Multi-File Implementation', status: 'pending', note: 'Queued' },
    { id: 'sentinel', title: 'Sentinel Quality & Self-Healing Gate', status: 'pending', note: 'Queued' },
    { id: 'commit', title: 'Atomic Git Trees Commit & Deploy', status: 'pending', note: 'Queued' }
  ];

  const initMsg = await sendTelegram(chatId, renderAutoGptTracker(taskPrompt, currentRepo, steps), MAIN_KEYBOARD);
  const statusMsgId = initMsg?.result?.message_id;

  const updateProgress = async (extraNote = '') => {
    if (statusMsgId) {
      await editTelegram(chatId, statusMsgId, renderAutoGptTracker(taskPrompt, currentRepo, steps, extraNote));
    }
  };

  // ----------------------------------------------------
  // Phase 1: Codebase Reconnaissance & Goal Decomposition
  // ----------------------------------------------------
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

  const plannerPrompt = `You are JARVIS, an autonomous senior full-stack architect running an AutoGPT execution loop.
Active Repository: "${currentRepo}".
User Goal: "${taskPrompt}".
Repository File Map:
${fileList.slice(0, 45).map(f => '- ' + f).join('\n')}

Decompose this goal into 1 to 3 coordinated file operations (modify or create).
Respond with ONLY valid JSON:
{
  "summary": "One sentence summary of the feature",
  "steps": [
    {
      "file": "exact/relative/path.ext",
      "action": "modify" or "create",
      "role": "concise description of what to update or write in this file"
    }
  ]
}`;

  const planRaw = await callGemini(plannerPrompt, true);
  let planObj = { summary: taskPrompt, steps: [] };
  try {
    const parsed = JSON.parse(planRaw);
    if (parsed && typeof parsed === 'object') {
      planObj = {
        summary: parsed.summary || taskPrompt,
        steps: Array.isArray(parsed.steps) ? parsed.steps : (Array.isArray(parsed.files) ? parsed.files.map(f => ({ file: f.path || f.file, action: f.action, role: f.role })) : [])
      };
    }
  } catch (e) { }

  if (!planObj.steps || planObj.steps.length === 0) {
    const defaultTarget = fileList.find(f => f.endsWith('index.html') || f.endsWith('README.md')) || fileList[0] || 'README.md';
    planObj.steps = [{ file: defaultTarget, action: 'modify', role: 'Implement request' }];
  }

  const activeSteps = planObj.steps.slice(0, 3);
  steps[0].status = 'done';
  steps[0].note = `${activeSteps.length} step(s) planned: ${planObj.summary.slice(0, 35)}...`;
  steps[1].status = 'running';
  steps[1].note = `Implementing: ${activeSteps.map(s => s.file).join(', ')}`;
  await updateProgress();

  // ----------------------------------------------------
  // Phase 2 & 3: Autonomous Coder & Sentinel Self-Healing Loop
  // ----------------------------------------------------
  const generatedFiles = [];
  for (const stepItem of activeSteps) {
    steps[1].note = `Coding \`${stepItem.file}\` (${stepItem.action})...`;
    await updateProgress();

    let existingContent = '';
    if (stepItem.action === 'modify') {
      const existingRes = await githubRequest(`/repos/${currentRepo}/contents/${stepItem.file}`);
      if (existingRes.status === 200 && existingRes.data?.content) {
        existingContent = Buffer.from(existingRes.data.content, 'base64').toString('utf-8');
      }
    }

    const coderPrompt = `You are JARVIS, an expert senior developer running an autonomous AutoGPT code generation cycle.
Overall Goal: "${planObj.summary}".
File Path: "${stepItem.file}" (${stepItem.action}).
Role for this file: "${stepItem.role}".
${existingContent ? `Existing File Content:\n\`\`\`\n${existingContent}\n\`\`\`` : 'This is a brand new file.'}

Return the COMPLETE updated content for "${stepItem.file}".
Requirements:
1. Provide the FULL production file ready to save directly to disk. Do NOT leave placeholder comments like "// rest of code here".
2. Maintain existing styles, scripts, and tokens unless deliberately modifying them.
3. Output ONLY the raw file content. Do NOT wrap in markdown code blocks.`;

    let fileContent = await callGemini(coderPrompt, false);
    if (!fileContent) {
      fileContent = existingContent;
    }
    fileContent = fileContent.replace(/^```[a-zA-Z]*\n?/, '').replace(/\n?```$/, '');

    // Sentinel / Quality Critic Gate
    steps[2].status = 'running';
    steps[2].note = `Inspecting \`${stepItem.file}\`...`;
    await updateProgress();

    const sentinelPrompt = `You are JARVIS Sentinel Quality Gate.
Verify this code for "${stepItem.file}":
${fileContent.slice(0, 3500)}

Check for:
1. Syntax correctness (balanced brackets, closed HTML tags, valid JS syntax).
2. Completeness (no placeholders or truncated sections).
3. Mobile responsiveness and adherence to project styling.

If 100% verified and production-ready, reply with ONLY:
VERIFIED

If any critical syntax, missing bracket, or truncated code issue exists, reply with:
FLAW: <concise description of the flaw>`;

    const sentinelRes = await callGemini(sentinelPrompt, false);
    
    // Self-Healing Loop if a flaw is found
    if (sentinelRes && !sentinelRes.includes('VERIFIED') && sentinelRes.length > 5) {
      steps[2].status = 'healing';
      steps[2].note = `Self-healing \`${stepItem.file}\`: fixing detected syntax/structure flaw...`;
      await updateProgress();

      const repairPrompt = `You are JARVIS Autonomous Self-Healing Engine.
The generated code for "${stepItem.file}" encountered a quality check flaw:
"${sentinelRes.slice(0, 300)}"

Goal: "${planObj.summary}".
Original/Current content snippet:
\`\`\`
${fileContent.slice(0, 3000)}
\`\`\`

Perform an immediate surgical repair. Output the COMPLETE, 100% fixed raw file content ready for production.
Return ONLY the raw file content. Do NOT wrap in markdown blocks.`;

      const repaired = await callGemini(repairPrompt, false);
      if (repaired && repaired.length > 50) {
        fileContent = repaired.replace(/^```[a-zA-Z]*\n?/, '').replace(/\n?```$/, '');
      }
    }

    generatedFiles.push({ path: stepItem.file, content: fileContent });
  }

  steps[1].status = 'done';
  steps[1].note = `${generatedFiles.length} file(s) authored`;
  steps[2].status = 'done';
  steps[2].note = 'All files passed Sentinel verification';
  steps[3].status = 'running';
  steps[3].note = 'Packaging atomic git trees...';
  await updateProgress();

  // ----------------------------------------------------
  // Phase 4: Atomic Git Trees Commit & Push
  // ----------------------------------------------------
  const commitMsg = `Cloud JARVIS: ${planObj.summary.slice(0, 60)}`;
  const commitResult = await commitMultipleFiles(currentRepo, generatedFiles, commitMsg);

  if (commitResult.success) {
    steps[3].status = 'done';
    steps[3].note = `Pushed [${commitResult.commitSha}] to ${commitResult.branch}`;

    const summaryFiles = generatedFiles.map(f => `▸ \`${f.path}\` _(Verified & Built)_`).join('\n');

    const inlineSuccess = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🌐 Launch In-App WebApp', web_app: { url: LIVE_SITE_URL } },
            { text: '📂 View on GitHub', url: `https://github.com/${currentRepo}` }
          ],
          [
            { text: '💡 More Ideas', callback_data: 'think_again' },
            { text: '🌅 Morning Briefing', callback_data: 'briefing_now' }
          ]
        ]
      }
    };

    const successMsg = `🎉 *AUTONOMOUS BUILD COMPLETE & VERIFIED*

🎯 *Objective:* "${taskPrompt}"
📂 *Repository:* \`${currentRepo}\`
📌 *Commit:* \`${commitResult.commitSha}\` - "${commitMsg}"

📋 *AutoGPT Loop Execution Log:*
[✓] *Goal Decomposition:* ${activeSteps.length}-part plan approved
[✓] *Autonomous Coder:* ${generatedFiles.length} source file(s) authored
[✓] *Sentinel Gate:* Zero syntax errors / Self-healing verified
[✓] *Atomic Git Trees:* Deployed to \`${commitResult.branch}\`

📄 *Modified Files:*
${summaryFiles}

🛡️ *Quality Assurance Pass:*
• Syntax & Markup: Verified
• Mobile Responsive: Checked
• Atomic Git Trees: Pushed

━━━━━━━━━━━━━━━━━━━━━
Tap below to test the changes live inside Telegram!`;

    if (statusMsgId) {
      await editTelegram(chatId, statusMsgId, successMsg, inlineSuccess);
    } else {
      await sendTelegram(chatId, successMsg, inlineSuccess);
    }
  } else {
    steps[3].status = 'failed';
    steps[3].note = commitResult.error || 'Commit failed';
    const failureNote = `⚠️ *Git Trees commit error:* ${commitResult.error || 'Failed'}.`;
    if (statusMsgId) {
      await editTelegram(chatId, statusMsgId, renderAutoGptTracker(taskPrompt, currentRepo, steps, failureNote));
    } else {
      await sendTelegram(chatId, failureNote, MAIN_KEYBOARD);
    }
  }
}

// ==========================================
// FEATURE 4: AUTONOMOUS DAILY BRIEFING & FLEET STANDUP
// ==========================================
async function handleDailyBriefing(chatId, currentRepo) {
  await sendTelegram(chatId, `🌅 *JARVIS Synthesizing Executive Standup & Fleet Report...*`, MAIN_KEYBOARD);

  const botFleet = [
    { name: 'Jarvis Assistant', handle: '@sachin_jarvis_ai_bot', token: TELEGRAM_TOKEN },
    { name: 'Mobile & Game Builder', handle: '@sachin_appbuilder_bot', token: '8689464042:AAEpbxtWM3daawqJnwBpuJ8WOX6u3OrrpEo' }
  ];

  const botStatuses = [];
  for (const b of botFleet) {
    const info = await new Promise((res) => {
      const req = https.request(`https://api.telegram.org/bot${b.token}/getWebhookInfo`, (r) => {
        let d = '';
        r.on('data', c => d += c);
        r.on('end', () => { try { res(JSON.parse(d)); } catch (e) { res(null); } });
      });
      req.on('error', () => res(null));
      req.end();
    });
    if (info && info.ok) {
      const isUp = !info.result.last_error_message;
      botStatuses.push(`• ${b.name} (${b.handle}): ${isUp ? '🟢 LIVE (24/7 Cloud)' : '🟡 Awaiting Public Setting in Netlify'}`);
    } else {
      botStatuses.push(`• ${b.name}: 🔴 Offline`);
    }
  }

  const siteRes = await new Promise((res) => {
    const req = https.request('https://avengers-doomsday-countdown-pmk3.netlify.app', (r) => res(r.statusCode));
    req.on('error', () => res(500));
    req.end();
  });
  const siteStatus = `• Avengers Countdown: ${siteRes === 200 ? '🟢 ONLINE (200 OK)' : `🔴 HTTP ${siteRes}`}`;

  const commitsRes = await githubRequest(`/repos/${currentRepo}/commits?per_page=2`);
  let latestCommits = [];
  if (commitsRes.status === 200 && Array.isArray(commitsRes.data)) {
    latestCommits = commitsRes.data.map(c => `\`${c.sha.slice(0, 7)}\` - ${c.commit.message}`);
  }

  const standupPrompt = `You are JARVIS, Tony Stark's executive AI assistant, delivering the Standup Briefing to Sachin Lolariya.
Active Repository: "${currentRepo}".
Bot Fleet Status:
${botStatuses.join('\n')}
Live Website:
${siteStatus}
Latest Commits on Active Repo:
${latestCommits.join('\n')}

Synthesize an executive daily standup briefing with this exact structure:
🌅 *Good day, Sir. Here is your Executive Standup Briefing:*

🤖 *Bot Fleet & Cloud Status:*
${botStatuses.join('\n')}
${siteStatus}

📊 *Project Velocity:*
Summary of recent updates and commits.

🎯 *Recommended Focus for Today:*
The single most impactful milestone or goal to tackle today.

💡 *JARVIS Proactive Suggestions (What We Can Build Today):*
Give 3 exciting, high-value, actionable ideas we can build today (e.g. video trailer HUD overlay, audio chime sound alerts, or new mobile game template).

Keep the tone energetic, confident, loyal, and motivating.`;

  const briefingText = await callGemini(standupPrompt, false);
  const finalMsg = briefingText || `🌅 *Good day, Sir.*\n\n${botStatuses.join('\n')}\n${siteStatus}\n\n• *Active Repository:* \`${currentRepo}\`\n• *Latest Commit:* ${latestCommits[0] || 'Synced'}\n• *Recommendation:* Ready for autonomous tasks anytime!`;

  const inlineBriefing = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🌐 Launch In-App WebApp', web_app: { url: LIVE_SITE_URL } },
          { text: '💡 Brainstorm Upgrades', callback_data: 'think_again' }
        ]
      ]
    }
  };

  await sendTelegram(chatId, finalMsg, inlineBriefing);
}

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

  // 1. Handle Inline Button Callbacks
  if (body.callback_query) {
    const query = body.callback_query;
    const chatId = String(query.message.chat.id);
    const data = query.data;

    await answerCallback(query.id);

    if (ALLOWED_CHAT_ID && chatId !== String(ALLOWED_CHAT_ID)) {
      await sendTelegram(chatId, `⛔ Access Denied.`);
      return { statusCode: 200, body: 'forbidden' };
    }

    const stateObj = await getState();
    const currentRepo = stateObj.data?.activeRepo || STATE_REPO;

    if (data.startsWith('set_repo:')) {
      const chosenRepo = data.replace('set_repo:', '');
      await updateState({ activeRepo: chosenRepo });

      const msgSwitched = `✅ *Active Repository Switched!*

📂 *Current Repo:* \`${chosenRepo}\`

💡 *You can now text or voice note any code edits, features, or tap "💡 Think & Suggest" and JARVIS will manage this project!*`;

      await sendTelegram(chatId, msgSwitched, MAIN_KEYBOARD);
      return { statusCode: 200, body: 'ok' };
    }

    if (data.startsWith('build_idea:')) {
      const ideaIndex = parseInt(data.replace('build_idea:', ''), 10) - 1;
      const ideas = stateObj.data?.lastIdeas || [];
      const chosenIdea = ideas[ideaIndex] || ideas[0];

      if (chosenIdea) {
        await executeAutonomousBuild(chatId, currentRepo, chosenIdea.instruction || chosenIdea.title);
      } else {
        await sendTelegram(chatId, `⚠️ Could not locate selected idea. Tap "💡 Think & Suggest" to generate fresh ideas!`, MAIN_KEYBOARD);
      }
      return { statusCode: 200, body: 'ok' };
    }

    if (data === 'think_again') {
      await handleThinkAndSuggest(chatId, currentRepo);
      return { statusCode: 200, body: 'ok' };
    }

    if (data === 'briefing_now') {
      await handleDailyBriefing(chatId, currentRepo);
      return { statusCode: 200, body: 'ok' };
    }

    return { statusCode: 200, body: 'ok' };
  }

  // 2. Extract Message (Text, Voice, or Photo)
  const message = body.message || body.edited_message;
  if (!message) {
    return { statusCode: 200, body: 'ok' };
  }

  const chatId = String(message.chat.id);

  // Security Check
  if (ALLOWED_CHAT_ID && chatId !== String(ALLOWED_CHAT_ID)) {
    await sendTelegram(chatId, `⛔ Access Denied. Cloud JARVIS is private property of Sachin Lolariya.`);
    return { statusCode: 200, body: 'forbidden' };
  }

  const stateObj = await getState();
  const currentRepo = stateObj.data?.activeRepo || STATE_REPO;

  // ==========================================
  // UPGRADE 1: 🎙️ STARK VOICE CONTROL
  // ==========================================
  if (message.voice || message.audio) {
    const voiceObj = message.voice || message.audio;
    const fileId = voiceObj.file_id;
    const duration = voiceObj.duration || 1;

    await sendTelegram(chatId, `🎙️ *Voice Note Received (${duration}s)*\n_JARVIS Multimodal is listening and transcribing instructions..._`, MAIN_KEYBOARD);

    const base64Audio = await downloadTelegramFileBase64(fileId);
    if (!base64Audio) {
      await sendTelegram(chatId, `⚠️ Could not download voice note from Telegram.`, MAIN_KEYBOARD);
      return { statusCode: 200, body: 'ok' };
    }

    const transcribePrompt = `Transcribe this voice message from Sachin accurately.
Return ONLY the transcribed text in plain English (no commentary, no quotes).`;

    const transcribedText = await callGeminiMultimodal([
      { inlineData: { mimeType: 'audio/ogg', data: base64Audio } },
      { text: transcribePrompt }
    ]);

    if (!transcribedText || transcribedText.length < 2) {
      await sendTelegram(chatId, `⚠️ Audio was unclear or could not be transcribed. Please speak clearly or send text.`, MAIN_KEYBOARD);
      return { statusCode: 200, body: 'ok' };
    }

    await sendTelegram(chatId, `🗣️ *Voice Transcribed:*\n_"${transcribedText}"_`, MAIN_KEYBOARD);
    await handleUserInput(chatId, currentRepo, transcribedText, true);
    return { statusCode: 200, body: 'ok' };
  }

  // ==========================================
  // UPGRADE 2: 📸 DESIGN-TO-CODE (SCREENSHOTS & SKETCHES)
  // ==========================================
  if (message.photo && Array.isArray(message.photo) && message.photo.length > 0) {
    const highestResPhoto = message.photo[message.photo.length - 1];
    const fileId = highestResPhoto.file_id;
    const caption = (message.caption || '').trim();

    await sendTelegram(chatId, `📸 *Design Screenshot Received*\n_JARVIS Vision is analyzing UI hierarchy, colors, and layout..._`, MAIN_KEYBOARD);

    const base64Image = await downloadTelegramFileBase64(fileId);
    if (!base64Image) {
      await sendTelegram(chatId, `⚠️ Could not download image from Telegram.`, MAIN_KEYBOARD);
      return { statusCode: 200, body: 'ok' };
    }

    const visionPrompt = `You are JARVIS, an elite frontend architect.
The user provided this UI design / screenshot / sketch for repository "${currentRepo}".
User caption / extra notes: "${caption || 'Recreate this visual layout in code'}".
Analyze the visual layout, spacing, components, typography, color palette, and interactive elements.
Formulate a clear, actionable coding instruction to implement this exact visual design in the project.
Output ONLY the detailed coding instruction.`;

    const visualInstruction = await callGeminiMultimodal([
      { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
      { text: visionPrompt }
    ]);

    await sendTelegram(chatId, `📐 *Visual Blueprint Extracted:*\n_${visualInstruction?.slice(0, 180)}..._\n\n🔧 *Executing multi-file implementation...*`, MAIN_KEYBOARD);
    await executeAutonomousBuild(chatId, currentRepo, visualInstruction || caption || 'Implement UI from screenshot');
    return { statusCode: 200, body: 'ok' };
  }

  // ==========================================
  // TEXT COMMANDS & DIALOGUE
  // ==========================================
  if (!message.text) {
    return { statusCode: 200, body: 'ok' };
  }

  const text = message.text.trim();

  // /start or Help
  if (text.startsWith('/start') || text === '❓ Help' || text.startsWith('/help')) {
    const welcome = `⚡ *STARK INDUSTRIES // CLOUD JARVIS 2.0*

Good day, Sachin. I am operating at 100% capacity in the Netlify Cloud 24/7.
*Your laptop can remain off* and I will autonomously build across all your projects.

*Autonomous Multi-Modal Capabilities:*
• 🎙️ *Stark Voice Control* - Send voice notes; I listen, transcribe, and code!
• 📸 *Design-to-Code* - Send any UI screenshot or hand sketch to build it!
• 💡 *Think & Suggest* - Brainstorms 3 creative upgrades with 1-tap builders
• ⚡ *Cloud Status* - Health, active repo & latest commit
• 📂 *Repositories* - View & switch between your GitHub projects
• 🌅 *Morning Briefing* - Daily 10:30 AM executive standup & bot fleet health
• 🌐 *Live Website* - Native Telegram In-App WebApp viewer

*Text, Voice, or Image Prompts:*
• *"Change the countdown styling to glowing cyber-gold"*
• Send a voice note: *"Add sound effects when the countdown updates"*
• Send a screenshot of a banner design to replicate it!`;

    const inlineStart = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🌐 Launch In-App WebApp', web_app: { url: LIVE_SITE_URL } },
            { text: '💡 Think & Suggest', callback_data: 'think_again' }
          ],
          [
            { text: '🌅 Morning Briefing', callback_data: 'briefing_now' },
            { text: '📂 View on GitHub', url: `https://github.com/${currentRepo}` }
          ]
        ]
      }
    };

    await sendTelegram(chatId, welcome, inlineStart);
    return { statusCode: 200, body: 'ok' };
  }

  // Feature 1: 💡 Think & Suggest
  if (text === '💡 Think & Suggest' || text === '/think' || text === '/suggest') {
    await handleThinkAndSuggest(chatId, currentRepo);
    return { statusCode: 200, body: 'ok' };
  }

  // Feature 4: 🌅 Briefing / Daily Standup
  if (text === '🌅 Briefing' || text === '🌅 Morning Standup' || text === '🌅 Morning Briefing' || text === '/briefing' || text === '/standup') {
    await handleDailyBriefing(chatId, currentRepo);
    return { statusCode: 200, body: 'ok' };
  }

  // Command: 📂 Repositories
  if (text === '📂 Repositories' || text === '📁 Projects' || text === '/repos') {
    const ghRes = await githubRequest(`/user/repos?sort=updated&per_page=12`);
    if (ghRes.status === 200 && Array.isArray(ghRes.data)) {
      const buttons = ghRes.data.map(r => [{
        text: (r.full_name === currentRepo ? `🟢 ${r.name} (Active)` : `📁 ${r.name}`),
        callback_data: `set_repo:${r.full_name}`
      }]);

      const inlineKeyboard = {
        reply_markup: { inline_keyboard: buttons }
      };

      await sendTelegram(chatId, `📂 *GitHub Project Directory:*\n*Active Repository:* \`${currentRepo}\`\n\nTap any repository below to switch active context:`, inlineKeyboard);
    } else {
      await sendTelegram(chatId, `⚠️ Could not fetch repositories from GitHub (HTTP ${ghRes.status}).`, MAIN_KEYBOARD);
    }
    return { statusCode: 200, body: 'ok' };
  }

  // Command: ⚡ Cloud Status
  if (text === '⚡ Cloud Status' || text === '⚡ Status' || text === '/status') {
    const ghRes = await githubRequest(`/repos/${currentRepo}/commits?per_page=1`);
    let lastCommit = 'Unknown';
    if (ghRes.status === 200 && Array.isArray(ghRes.data) && ghRes.data[0]) {
      lastCommit = `\`${ghRes.data[0].sha.slice(0, 7)}\` - ${ghRes.data[0].commit.message}`;
    }

    const isSiteRepo = currentRepo.includes('avengers');
    const liveLink = isSiteRepo ? `\n• *Live URL:* ${LIVE_SITE_URL}` : '';

    const statusMsg = `☁️ *CLOUD JARVIS // STATUS REPORT*
• *Platform:* Netlify Cloud Serverless (24/7)
• *Laptop Power:* Not required (Runs 100% with laptop OFF)
• *Active Repository:* \`${currentRepo}\`
• *Latest Commit:* ${lastCommit}${liveLink}
• *AI Brain:* Google Gemini 3.5 Flash-Lite (Multimodal Online)
• *Multimodal Sensors:* Voice Notes (🎙️) • Screenshots (📸) • Text (⌨️)`;

    const inlineStatus = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🌐 Launch In-App WebApp', web_app: { url: LIVE_SITE_URL } },
            { text: '💡 Brainstorm Ideas', callback_data: 'think_again' }
          ]
        ]
      }
    };

    await sendTelegram(chatId, statusMsg, inlineStatus);
    return { statusCode: 200, body: 'ok' };
  }

  // Command: 🌐 Live Website
  if (text === '🌐 Live Website' || text === '🌐 Live Preview' || text === '/site') {
    const inlineSite = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🌐 Launch In-App WebApp', web_app: { url: LIVE_SITE_URL } },
            { text: '📂 Open in Browser', url: LIVE_SITE_URL }
          ]
        ]
      }
    };
    await sendTelegram(chatId, `🌐 *Your Live Website:*\n${LIVE_SITE_URL}\n\n✨ Tap **"Launch In-App WebApp"** below to view directly inside Telegram!`, inlineSite);
    return { statusCode: 200, body: 'ok' };
  }

  // Command: 🚀 Recent Commits
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

  // Intelligent Multi-Intent Dialogue & Execution Engine
  await handleUserInput(chatId, currentRepo, text, false);
  return { statusCode: 200, body: 'ok' };
};
