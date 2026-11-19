/**
 * ============================================================================
 * AVENGERS: DOOMSDAY - OFFICIAL FAN COUNTDOWN & AMBIENT EXPERIENCE
 * High-Performance Official YouTube Stream + Real Live Chat + GSAP Animation
 * 100% Non-Commercial Fan Tribute & Copyright Compliant
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// 1. Video Timeline Constants & Global State
// ----------------------------------------------------------------------------
const VIDEO_ID = "IqQ7ApyVdSg"; // Official Dolby Cinema Avengers: Doomsday Special Look
const AMBIENT_START = 0;       // 0:00
const AMBIENT_END = 10;        // 0:10 (ambient atmospheric loop)
const LIVE_START = 92;         // 1:32 (dramatic climax sequence)
const LIVE_END = 110;          // 1:50

let currentMode = "ambient";   // 'ambient' (0-10s loop muted) | 'live' (1:32-1:50 with audio)
let ytPlayer = null;
let ytReady = false;

// ----------------------------------------------------------------------------
// 2. Official YouTube IFrame Player API Callback (100% Legal & Safe)
// ----------------------------------------------------------------------------
window.onYouTubeIframeAPIReady = function () {
  const originUrl = (window.location.origin && window.location.origin !== "null") 
    ? window.location.origin 
    : undefined;

  ytPlayer = new YT.Player("youtube-bg-player", {
    width: "100%",
    height: "100%",
    videoId: VIDEO_ID,
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      enablejsapi: 1,
      fs: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      mute: 1,
      playsinline: 1,
      rel: 0,
      showinfo: 0,
      autohide: 1,
      ...(originUrl ? { origin: originUrl } : {})
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
      onError: onPlayerError
    }
  });
};

function onPlayerReady(event) {
  ytReady = true;
  event.target.mute();
  event.target.playVideo();

  // Enforce high quality
  if (typeof event.target.setPlaybackQuality === "function") {
    event.target.setPlaybackQuality("hd1080");
  }

  // Watchdog loop for smooth, continuous looping without pauses
  let isSeeking = false;
  setInterval(() => {
    if (!ytReady || !ytPlayer || typeof ytPlayer.getCurrentTime !== "function") return;
    try {
      const cur = ytPlayer.getCurrentTime();
      if (currentMode === "ambient") {
        if (cur >= AMBIENT_END && !isSeeking) {
          isSeeking = true;
          ytPlayer.seekTo(AMBIENT_START, true);
          ytPlayer.playVideo();
          setTimeout(() => { isSeeking = false; }, 300);
        }
      } else if (currentMode === "live") {
        if (cur >= LIVE_END && !isSeeking) {
          isSeeking = true;
          ytPlayer.seekTo(LIVE_START, true);
          ytPlayer.playVideo();
          setTimeout(() => { isSeeking = false; }, 300);
        }
      }
    } catch (e) {
      isSeeking = false;
    }
  }, 150);
}

function onPlayerStateChange(event) {
  // If player ever gets paused (by browser, YouTube OSD, or seek), instantly resume playback
  if (event.data === YT.PlayerState.PAUSED) {
    if (ytPlayer && typeof ytPlayer.playVideo === "function") {
      ytPlayer.playVideo();
    }
  } else if (event.data === YT.PlayerState.ENDED) {
    const targetStart = (currentMode === "live") ? LIVE_START : AMBIENT_START;
    if (ytPlayer && typeof ytPlayer.seekTo === "function") {
      ytPlayer.seekTo(targetStart, true);
      ytPlayer.playVideo();
    }
  }
}

function onPlayerError(event) {
  console.warn("YouTube Player error code:", event.data);
  // YouTube Error 153 occurs only on file:/// local disk paths due to Chrome origin security
  if (window.location.protocol === "file:") {
    console.info("Note: For full YouTube iframe streaming and real chat synchronization, visit http://localhost:3000");
  }
}

// ----------------------------------------------------------------------------
// 3. DOM Ready Logic & Interactive Controls
// ----------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  // Bottom Controls
  const btnWatchLive = document.getElementById("btn-watch-live");
  const btnLiveChat = document.getElementById("btn-live-chat");
  const btnAudioToggle = document.getElementById("btn-audio-toggle");
  const audioIcon = document.getElementById("audio-icon");

  // Chat Drawer Elements
  const chatDrawer = document.getElementById("chat-drawer");
  const closeChat = document.getElementById("close-chat");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chat-messages");

  // Show a helpful tip if opened via file:/// instead of http://localhost:3000
  if (window.location.protocol === "file:") {
    const notice = document.createElement("div");
    notice.style.cssText = `
      position: fixed;
      top: 72px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(15, 23, 42, 0.95);
      border: 1px solid rgba(239, 68, 68, 0.4);
      color: #e2e8f0;
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      font-size: 0.78rem;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    `;
    notice.innerHTML = `
      <span style="color:#ef4444; font-weight:700;">Local Test:</span>
      <span>For full YouTube live stream & real chat, view at <a href="http://localhost:3000" style="color:#60a5fa; text-decoration:underline;">http://localhost:3000</a></span>
      <button style="background:none; border:none; color:#94a3b8; cursor:pointer; font-size:1rem; margin-left:0.5rem;" onclick="this.parentElement.remove()">×</button>
    `;
    document.body.appendChild(notice);
  }

  // --------------------------------------------------------------------------
  // A. "Watch Live" Switcher (Ambient 0-10s vs Live 1:32-1:50)
  // Clean button: NO "1:32" and NO "((•))", only pulsing beacon + "Watch Live"
  // --------------------------------------------------------------------------
  if (btnWatchLive) {
    btnWatchLive.addEventListener("click", () => {
      if (currentMode === "ambient") {
        currentMode = "live";
        btnWatchLive.classList.add("live-active");
        btnWatchLive.innerHTML = `<span class="live-beacon"></span><span>Watch Live</span>`;

        if (ytPlayer && ytReady && typeof ytPlayer.seekTo === "function") {
          ytPlayer.unMute();
          ytPlayer.setVolume(100);
          ytPlayer.seekTo(LIVE_START, true);
          ytPlayer.playVideo();
        }

        if (audioIcon) audioIcon.textContent = "🔊";
      } else {
        currentMode = "ambient";
        btnWatchLive.classList.remove("live-active");
        btnWatchLive.innerHTML = `<span class="live-beacon"></span><span>Watch Live</span>`;

        if (ytPlayer && ytReady && typeof ytPlayer.seekTo === "function") {
          ytPlayer.mute();
          ytPlayer.seekTo(AMBIENT_START, true);
          ytPlayer.playVideo();
        }

        if (audioIcon) audioIcon.textContent = "🔇";
      }
    });
  }

  // --------------------------------------------------------------------------
  // B. Audio Mute / Unmute Toggle
  // --------------------------------------------------------------------------
  if (btnAudioToggle) {
    btnAudioToggle.addEventListener("click", () => {
      if (!ytPlayer || !ytReady) return;
      try {
        if (ytPlayer.isMuted()) {
          ytPlayer.unMute();
          ytPlayer.setVolume(100);
          if (audioIcon) audioIcon.textContent = "🔊";
        } else {
          ytPlayer.mute();
          if (audioIcon) audioIcon.textContent = "🔇";
        }
      } catch (e) {
        console.warn("Audio toggle error:", e);
      }
    });
  }

  // --------------------------------------------------------------------------
  // C. Real-Time Live Chat (Real Traffic, Zero Fake Bots)
  // --------------------------------------------------------------------------
  const chatUsernameInput = document.getElementById("chat-username-input");
  let currentUser = localStorage.getItem("avc_chat_user");
  if (!currentUser) {
    currentUser = "Fan_" + Math.floor(1000 + Math.random() * 9000);
    localStorage.setItem("avc_chat_user", currentUser);
  }
  if (chatUsernameInput) {
    chatUsernameInput.value = currentUser;
    chatUsernameInput.addEventListener("input", () => {
      const val = chatUsernameInput.value.trim().slice(0, 25);
      if (val) {
        currentUser = val;
        localStorage.setItem("avc_chat_user", val);
      }
    });
  }

  let chatPollTimer = null;
  const seenMessageIds = new Set();

  function startChatPolling() {
    fetchRealMessages();
    if (!chatPollTimer) {
      chatPollTimer = setInterval(fetchRealMessages, 2500);
    }
  }

  function stopChatPolling() {
    if (chatPollTimer) {
      clearInterval(chatPollTimer);
      chatPollTimer = null;
    }
  }

  if (btnLiveChat && chatDrawer) {
    btnLiveChat.addEventListener("click", () => {
      chatDrawer.classList.toggle("open");
      if (chatDrawer.classList.contains("open")) {
        startChatPolling();
        if (chatInput) chatInput.focus();
      } else {
        stopChatPolling();
      }
    });
  }

  if (closeChat && chatDrawer) {
    closeChat.addEventListener("click", () => {
      chatDrawer.classList.remove("open");
      stopChatPolling();
    });
  }

  // Close chat when clicking outside
  document.addEventListener("click", (e) => {
    if (chatDrawer && chatDrawer.classList.contains("open")) {
      if (!chatDrawer.contains(e.target) && !btnLiveChat.contains(e.target)) {
        chatDrawer.classList.remove("open");
        stopChatPolling();
      }
    }
  });

  async function fetchRealMessages() {
    if (!window.location.protocol.startsWith("http")) {
      // Local file mode: persist real messages in localStorage
      const local = JSON.parse(localStorage.getItem("avc_real_chat") || "[]");
      renderMessages(local);
      return;
    }

    try {
      const res = await fetch("/api/chat");
      if (res.ok) {
        const data = await res.json();
        const badge = document.getElementById("chat-online-badge");
        if (badge && data.online !== undefined) {
          badge.textContent = `● ${data.online} ONLINE`;
        }
        renderMessages(data.messages || []);
      }
    } catch (e) {
      // Fallback to localStorage if offline
      const local = JSON.parse(localStorage.getItem("avc_real_chat") || "[]");
      renderMessages(local);
    }
  }

  function renderMessages(list) {
    if (!chatMessages) return;

    if (!list || list.length === 0) {
      chatMessages.innerHTML = `
        <div id="chat-empty-state" class="chat-empty-state">
          <div class="empty-icon">💬</div>
          <div class="empty-title">Real-Time Chat Active</div>
          <div class="empty-sub">No messages yet. Send a message below to start the conversation!</div>
        </div>
      `;
      seenMessageIds.clear();
      return;
    }

    const empty = document.getElementById("chat-empty-state");
    if (empty) empty.remove();

    let hasNew = false;
    list.forEach(msg => {
      if (!seenMessageIds.has(msg.id)) {
        seenMessageIds.add(msg.id);
        const isSelf = msg.user === currentUser;
        appendMessageElement(msg.user, msg.text, msg.timestamp, isSelf);
        hasNew = true;
      }
    });

    if (hasNew) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  function appendMessageElement(author, text, timestamp, isSelf = false) {
    const msgEl = document.createElement("div");
    msgEl.className = "chat-msg";
    const authorColor = isSelf ? "#34d399" : "#60a5fa";

    if (isSelf) {
      msgEl.style.borderColor = "rgba(16, 185, 129, 0.4)";
      msgEl.style.background = "rgba(16, 185, 129, 0.08)";
    }

    let timeStr = "Just now";
    if (timestamp) {
      const d = new Date(timestamp);
      if (!isNaN(d.getTime())) {
        timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    }

    msgEl.innerHTML = `
      <div class="chat-author-line">
        <span class="chat-author" style="color: ${authorColor}; font-weight: 700;">${escapeHTML(author)} ${isSelf ? '<span style="font-size: 0.65rem; color: #10b981;">(You)</span>' : ''}</span>
        <span class="chat-time">${escapeHTML(timeStr)}</span>
      </div>
      <div class="chat-text">${escapeHTML(text)}</div>
    `;

    chatMessages.appendChild(msgEl);
  }

  // Real user chat submission
  if (chatForm && chatInput && chatMessages) {
    chatForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;

      const user = currentUser || "Anonymous Fan";
      chatInput.value = "";

      if (window.location.protocol.startsWith("http")) {
        try {
          const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user, text })
          });

          if (res.ok) {
            const data = await res.json();
            if (data.message && !seenMessageIds.has(data.message.id)) {
              seenMessageIds.add(data.message.id);
              const empty = document.getElementById("chat-empty-state");
              if (empty) empty.remove();
              appendMessageElement(data.message.user, data.message.text, data.message.timestamp, true);
              chatMessages.scrollTop = chatMessages.scrollHeight;
            }
          }
        } catch (err) {
          console.error("Chat send error:", err);
        }
      } else {
        // file:/// mode local persistence
        const newMsg = {
          id: "msg_" + Date.now(),
          user,
          text,
          timestamp: new Date().toISOString()
        };
        const local = JSON.parse(localStorage.getItem("avc_real_chat") || "[]");
        local.push(newMsg);
        localStorage.setItem("avc_real_chat", JSON.stringify(local));
        renderMessages(local);
      }
    });
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  // ----------------------------------------------------------------------------
  // 4. 5-Unit Master Countdown Engine (Months, Days, Hours, Min, Sec)
  // Target: December 18, 2026, 05:00:00 UTC
  // ----------------------------------------------------------------------------
  const TARGET_DATE = new Date("2026-12-18T05:00:00Z");

  const elMonths = document.getElementById("hud-months");
  const elDays = document.getElementById("hud-days");
  const elHours = document.getElementById("hud-hours");
  const elMins = document.getElementById("hud-mins");
  const elSecs = document.getElementById("hud-secs");

  function calculateCountdown() {
    const now = new Date();
    if (now >= TARGET_DATE) {
      updateDigits("00", "00", "00", "00", "00");
      return;
    }

    // Accurate Calendar Months Delta
    let yDiff = TARGET_DATE.getUTCFullYear() - now.getUTCFullYear();
    let mDiff = TARGET_DATE.getUTCMonth() - now.getUTCMonth();
    let totalMonths = yDiff * 12 + mDiff;

    let anchorDate = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth() + totalMonths,
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds()
    ));

    if (anchorDate > TARGET_DATE) {
      totalMonths--;
      anchorDate = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth() + totalMonths,
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds()
      ));
    }

    let remMs = TARGET_DATE.getTime() - anchorDate.getTime();
    if (remMs < 0) remMs = 0;

    const days = Math.floor(remMs / (1000 * 60 * 60 * 24));
    remMs %= (1000 * 60 * 60 * 24);

    const hours = Math.floor(remMs / (1000 * 60 * 60));
    remMs %= (1000 * 60 * 60);

    const mins = Math.floor(remMs / (1000 * 60));
    remMs %= (1000 * 60);

    const secs = Math.floor(remMs / 1000);

    const pad = n => String(Math.max(0, n)).padStart(2, "0");

    updateDigits(pad(totalMonths), pad(days), pad(hours), pad(mins), pad(secs));
  }

  let lastSecVal = null;
  function updateDigits(m, d, h, mn, s) {
    if (elMonths && elMonths.textContent !== m) elMonths.textContent = m;
    if (elDays && elDays.textContent !== d) elDays.textContent = d;
    if (elHours && elHours.textContent !== h) elHours.textContent = h;
    if (elMins && elMins.textContent !== mn) elMins.textContent = mn;
    if (elSecs && elSecs.textContent !== s) {
      elSecs.textContent = s;
      if (lastSecVal !== null && typeof gsap !== "undefined") {
        gsap.fromTo(elSecs, { scale: 1.06, color: "#34d399" }, { scale: 1, color: "#ffffff", duration: 0.35, ease: "power2.out" });
      }
      lastSecVal = s;
    }
  }

  calculateCountdown();
  setInterval(calculateCountdown, 1000);

  // ----------------------------------------------------------------------------
  // 5. GSAP Cinematic Entrance & Interactive Micro-Animations (/gsap-animation)
  // ----------------------------------------------------------------------------
  if (typeof gsap !== "undefined") {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(".site-header",
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 0.2 }
    )
      .fromTo(".hero-title",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        "-=0.4"
      )
      .fromTo(".countdown-clock",
        { scale: 0.92, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.9 },
        "-=0.4"
      )
      .fromTo(".hero-bottom-bar",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.5"
      );

    // Subtle Button Micro-Interactions
    document.querySelectorAll(".btn-ctrl, .icon-ctrl-btn").forEach(btn => {
      btn.addEventListener("mouseenter", () => {
        gsap.to(btn, { scale: 1.05, duration: 0.2, ease: "power2.out" });
      });
      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, { scale: 1, duration: 0.2, ease: "power2.out" });
      });
    });
  }
});
