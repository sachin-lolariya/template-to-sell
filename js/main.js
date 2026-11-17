/**
 * AVENGERS: DOOMSDAY - MULTIVERSE COUNTDOWN PORTAL
 * Master JavaScript Controller with GSAP Animations & Audio Synthesis
 */

document.addEventListener("DOMContentLoaded", () => {
  initAmbientCanvas();
  initCountdownTimer();
  initGSAPAnimations();
  initRosterSystem();
  initLatverianTerminal();
  initBadgeGenerator();
  initFaqAccordion();
  initAudioSynthesizer();
  initNewsletter();
});

/* ==========================================================================
   1. AMBIENT AURORA CANVAS (Modulify Aurora Inspired)
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById("ambient-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Multiverse Particle System
  const particles = [];
  const particleCount = 45;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      color: Math.random() > 0.3 ? "rgba(16, 185, 129, " : "rgba(139, 92, 246, ",
      alpha: Math.random() * 0.5 + 0.1
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Subtle Radial Latveria Energy Fog
    const gradient = ctx.createRadialGradient(
      width * 0.5, height * 0.3, 50,
      width * 0.5, height * 0.3, width * 0.7
    );
    gradient.addColorStop(0, "rgba(16, 185, 129, 0.08)");
    gradient.addColorStop(0.5, "rgba(5, 150, 105, 0.03)");
    gradient.addColorStop(1, "rgba(6, 7, 9, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Render Particles
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ")";
      ctx.fill();
    });

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   2. REAL-TIME COUNTDOWN ENGINE
   ========================================================================== */
function initCountdownTimer() {
  // Avengers: Doomsday Target: December 18, 2026 at 05:00:00 UTC
  const doomsdayDate = new Date(Date.UTC(2026, 11, 18, 5, 0, 0)).getTime();
  // Avengers: Secret Wars Target: December 17, 2027 at 05:00:00 UTC
  const secretWarsDate = new Date(Date.UTC(2027, 11, 17, 5, 0, 0)).getTime();

  const daysEl = document.getElementById("count-days");
  const hoursEl = document.getElementById("count-hours");
  const minsEl = document.getElementById("count-mins");
  const secsEl = document.getElementById("count-secs");
  const secretDaysEl = document.getElementById("sw-days");

  let lastSec = null;

  function update() {
    const now = new Date().getTime();
    const diff = doomsdayDate - now;

    if (diff <= 0) {
      if (daysEl) daysEl.textContent = "00";
      if (hoursEl) hoursEl.textContent = "00";
      if (minsEl) minsEl.textContent = "00";
      if (secsEl) secsEl.textContent = "00";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = n => String(n).padStart(2, "0");

    if (daysEl && daysEl.textContent !== String(days)) daysEl.textContent = String(days);
    if (hoursEl && hoursEl.textContent !== pad(hours)) hoursEl.textContent = pad(hours);
    if (minsEl && minsEl.textContent !== pad(mins)) minsEl.textContent = pad(mins);

    if (secsEl && lastSec !== secs) {
      secsEl.textContent = pad(secs);
      secsEl.classList.remove("number-shift");
      void secsEl.offsetWidth; // Trigger reflow
      secsEl.classList.add("number-shift");
      lastSec = secs;
    }

    // Secret Wars secondary clock
    if (secretDaysEl) {
      const swDiff = secretWarsDate - now;
      const swDays = Math.floor(swDiff / (1000 * 60 * 60 * 24));
      secretDaysEl.textContent = `${swDays} Days`;
    }
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   3. GSAP 3 ANIMATIONS & SCROLLTRIGGERS (/gsap-animation)
   ========================================================================== */
function initGSAPAnimations() {
  if (typeof gsap === "undefined") return;

  // Master Entrance Timeline
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.from(".badge-incursion", { opacity: 0, y: -20, duration: 0.8 })
    .from(".hero-title", { opacity: 0, scale: 0.95, y: 30, duration: 1.1 }, "-=0.4")
    .from(".hero-subtitle", { opacity: 0, y: 20, duration: 0.8 }, "-=0.6")
    .from(".countdown-wrapper", { opacity: 0, scale: 0.92, y: 40, duration: 1 }, "-=0.5")
    .from(".hero-cta", { opacity: 0, y: 20, duration: 0.6 }, "-=0.4");

  // ScrollTrigger Staggers
  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".character-card", {
      scrollTrigger: {
        trigger: ".roster-grid",
        start: "top 80%"
      },
      opacity: 0,
      y: 40,
      stagger: 0.1,
      duration: 0.8,
      ease: "power2.out"
    });

    gsap.from(".reel-card", {
      scrollTrigger: {
        trigger: ".reel-track",
        start: "top 85%"
      },
      opacity: 0,
      x: 50,
      stagger: 0.15,
      duration: 0.8,
      ease: "power2.out"
    });
  }
}

/* ==========================================================================
   4. CARDWALL ROSTER SYSTEM & DOSSIER MODAL
   ========================================================================== */
const ROSTER_DATA = [
  {
    name: "Doctor Doom",
    actor: "Robert Downey Jr.",
    threat: "omega",
    category: "doom",
    status: "Confirmed · Main Antagonist",
    desc: "Victor von Doom steps forward across the collapsing Multiverse, wielding science and sorcery to forge a new order.",
    details: "Announced by Marvel Studios at SDCC 2024. Directed by the Russo Brothers. Von Doom is central to the multiversal incursion crisis, leading straight into Battleworld."
  },
  {
    name: "Scarlet Witch",
    actor: "Elizabeth Olsen",
    threat: "nexus",
    category: "multiverse",
    status: "Reported · Incursion Nexus",
    desc: "Wanda Maximoff returns to grapple with the fractured reality and the impending multiversal collapse.",
    details: "Key rumors follow the VisionQuest developments, positioning Scarlet Witch as an indispensable reality-warping force against Doom."
  },
  {
    name: "Reed Richards",
    actor: "Pedro Pascal",
    threat: "alpha",
    category: "champions",
    status: "Confirmed · First Family",
    desc: "Mister Fantastic leads Marvel's First Family from their retro-futuristic universe into the main MCU timeline.",
    details: "Debuting in The Fantastic Four: First Steps before playing a pivotal intellect-clash role against Victor von Doom."
  },
  {
    name: "Spider-Man",
    actor: "Tom Holland",
    threat: "alpha",
    category: "champions",
    status: "Confirmed · Frontline Hero",
    desc: "Peter Parker must fight to protect reality itself in the aftermath of secret identity erasure and the multiverse crisis.",
    details: "Serves as the emotional anchor of the team facing Doom, bridging street-level grit with multiversal stakes."
  },
  {
    name: "Thor Odinson",
    actor: "Chris Hemsworth",
    threat: "omega",
    category: "champions",
    status: "Confirmed · Asgardian God",
    desc: "The God of Thunder answers the cosmic distress call as entire dimensions begin colliding.",
    details: "Carries mystical power that directly counters Doom's ancient Latverian dark magic."
  },
  {
    name: "Loki Odinson",
    actor: "Tom Hiddleston",
    threat: "nexus",
    category: "multiverse",
    status: "Reported · God of Stories",
    desc: "Holding the multiversal branches together from the center of the Yggdrasil timeline.",
    details: "Loki's pivotal role in holding the multiverse threads creates the ultimate chess match against Doctor Doom."
  }
];

function initRosterSystem() {
  const grid = document.getElementById("roster-grid");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const modal = document.getElementById("dossier-modal");
  const closeBtn = document.getElementById("close-modal");

  if (!grid) return;

  function renderCards(filter = "all") {
    grid.innerHTML = "";
    const filtered = filter === "all" ? ROSTER_DATA : ROSTER_DATA.filter(c => c.category === filter);

    filtered.forEach(c => {
      const card = document.createElement("div");
      card.className = "character-card";
      card.innerHTML = `
        <span class="card-threat threat-${c.threat}">${c.threat} Threat</span>
        <div class="card-avatar">🛡️</div>
        <h3 class="card-name">${c.name}</h3>
        <p class="card-actor">${c.actor}</p>
        <div class="card-status-badge">${c.status}</div>
        <p class="card-desc">${c.desc}</p>
      `;

      card.addEventListener("click", () => openDossier(c));
      grid.appendChild(card);
    });
  }

  function openDossier(char) {
    if (!modal) return;
    document.getElementById("modal-name").textContent = char.name;
    document.getElementById("modal-actor").textContent = `Portrayed by ${char.actor}`;
    document.getElementById("modal-status").textContent = char.status;
    document.getElementById("modal-desc").textContent = char.desc;
    document.getElementById("modal-details").textContent = char.details;
    modal.classList.add("active");
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => modal.classList.remove("active"));
    modal.addEventListener("click", e => {
      if (e.target === modal) modal.classList.remove("active");
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderCards(btn.dataset.filter);
    });
  });

  renderCards();
}

/* ==========================================================================
   5. LATVERIAN / TVA COMMAND CONSOLE (Modulify Console Inspired)
   ========================================================================== */
function initLatverianTerminal() {
  const output = document.getElementById("terminal-output");
  const input = document.getElementById("terminal-input");
  const chips = document.querySelectorAll(".cmd-chip");

  if (!output || !input) return;

  const COMMANDS = {
    help: `AVAILABLE COMMANDS:
- DOOM       : Access Victor von Doom Intelligence Dossier
- TIMELINE   : Marvel Phase 6 Multiverse Roadmap
- SECRETWARS : Battleworld & Incursion Briefing
- INCURSION  : Current Multiversal Stability Status
- CLEAR      : Purge terminal display buffer`,
    doom: `[CLASSIFIED DOSSIER - LATVERIAN MONARCH]
SUBJECT: Victor von Doom
IDENTITY CONFIRMED: Robert Downey Jr.
OBJECTIVE: Total order through multiversal unification.
MAGIC / TECH RATING: Class 10+ Sorcery & Nanotech Mastery.
STATUS: Preparing for multiversal collision.`,
    timeline: `[PHASE 6 ROADMAP INTEL]
1. Fantastic Four: First Steps -> July 2025
2. Avengers: Doomsday           -> Dec 18, 2026
3. Avengers: Secret Wars        -> Dec 17, 2027
4. Marvel Studios' X-Men        -> May 05, 2028`,
    secretwars: `[INCURSION EVENT ARCHIVE]
Following Doomsday, conflicting realities collapse into Battleworld.
The final confrontation between God Emperor Doom and surviving Multiverse Champions.`,
    incursion: `[WARNING: INCURSION ALERT LEVEL 9]
Point of Origin: Earth-616 & Earth-838 proximity warning.
Time to Zero Collision: Synchronized to Live Clock above.
Stability: CRITICAL.`
  };

  function printLine(text, color = "#34d399") {
    const p = document.createElement("div");
    p.className = "terminal-log";
    p.style.color = color;
    p.textContent = text;
    output.appendChild(p);
    output.scrollTop = output.scrollHeight;
  }

  function handleCommand(cmd) {
    const cleanCmd = cmd.trim().toLowerCase();
    printLine(`> ${cmd}`, "#f59e0b");

    if (cleanCmd === "clear") {
      output.innerHTML = "";
      printLine("LATVERIA / TVA SECURE TERMINAL v4.28 ONLINE. Type 'help' for commands.");
      return;
    }

    if (COMMANDS[cleanCmd]) {
      printLine(COMMANDS[cleanCmd]);
    } else if (cleanCmd !== "") {
      printLine(`Unknown command: '${cmd}'. Type 'help' for protocol instructions.`, "#ef4444");
    }
  }

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      handleCommand(input.value);
      input.value = "";
    }
  });

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      const cmd = chip.dataset.cmd;
      input.value = cmd;
      handleCommand(cmd);
      input.value = "";
    });
  });
}

/* ==========================================================================
   6. INTERACTIVE "WILL RETURN" BADGE GENERATOR
   ========================================================================== */
function initBadgeGenerator() {
  const input = document.getElementById("fan-name-input");
  const nameDisplay = document.getElementById("preview-fan-name");
  const copyBtn = document.getElementById("copy-badge-btn");

  if (!input || !nameDisplay) return;

  input.addEventListener("input", e => {
    const val = e.target.value.trim();
    nameDisplay.textContent = val ? val : "YOU";
  });

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const name = nameDisplay.textContent;
      const text = `${name.toUpperCase()} WILL RETURN IN AVENGERS: DOOMSDAY`;
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = "Copied to Clipboard!";
        setTimeout(() => { copyBtn.textContent = "Copy Badge Text"; }, 2000);
      });
    });
  }
}

/* ==========================================================================
   7. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const items = document.querySelectorAll(".faq-item");
  items.forEach(item => {
    const btn = item.querySelector(".faq-question");
    if (btn) {
      btn.addEventListener("click", () => {
        const isActive = item.classList.contains("active");
        items.forEach(i => i.classList.remove("active"));
        if (!isActive) item.classList.add("active");
      });
    }
  });
}

/* ==========================================================================
   8. WEB AUDIO SYNTHESIZER (Sci-Fi Ambient Drone & Clicks)
   ========================================================================== */
function initAudioSynthesizer() {
  const soundBtn = document.getElementById("sound-toggle");
  if (!soundBtn) return;

  let audioCtx = null;
  let oscillator = null;
  let gainNode = null;
  let isPlaying = false;

  soundBtn.addEventListener("click", () => {
    if (!isPlaying) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        oscillator = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();

        // Deep sci-fi resonant sub drone
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(55, audioCtx.currentTime); // A1 note
        gainNode.gain.setValueAtTime(0.06, audioCtx.currentTime);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();

        isPlaying = true;
        soundBtn.classList.add("active");
        soundBtn.innerHTML = `<span>🔊</span> Sound: ON`;
      } catch (e) {
        console.warn("Audio Context blocked by browser policy.");
      }
    } else {
      if (oscillator) oscillator.stop();
      if (audioCtx) audioCtx.close();
      isPlaying = false;
      soundBtn.classList.remove("active");
      soundBtn.innerHTML = `<span>🔈</span> Sound: OFF`;
    }
  });
}

/* ==========================================================================
   9. NEWSLETTER SUBSCRIPTION
   ========================================================================== */
function initNewsletter() {
  const form = document.getElementById("alerts-form");
  const feedback = document.getElementById("form-feedback");

  if (!form || !feedback) return;

  form.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("alert-email").value;
    if (email) {
      feedback.textContent = `Protocol Confirmed. Incursion alerts will be dispatched to ${email}.`;
      feedback.className = "form-feedback success";
      form.reset();
    }
  });
}
