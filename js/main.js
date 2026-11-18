/**
 * AVENGERS: DOOMSDAY - CINEMA REEL CONTROLLER
 * Inspired by Modulify Cinema Reel & VOIDEN Templates
 * Built with GreenSock GSAP 3 & Web Audio Synthesizer
 */

document.addEventListener("DOMContentLoaded", () => {
  const state = {
    current: 0,
    total: 4,
    isAnimating: false,
    soundEnabled: false,
    audioCtx: null,
    oscillator: null,
    gainNode: null
  };

  const slides = document.querySelectorAll(".reel-slide");
  const progressFill = document.querySelector(".reel-progress-fill");
  const indexerCurrent = document.querySelector(".current-index");
  const btnPrev = document.getElementById("reel-prev");
  const btnNext = document.getElementById("reel-next");
  const drawer = document.getElementById("dossier-drawer");
  const drawerToggle = document.getElementById("dossier-toggle");
  const closeDrawer = document.getElementById("close-drawer");
  const exploreBtns = document.querySelectorAll(".btn-explore");

  // =========================================================================
  // 1. REEL SLIDE TRANSITIONS (GSAP 3)
  // =========================================================================
  function goToSlide(index) {
    if (state.isAnimating || index === state.current) return;
    if (index < 0 || index >= state.total) return;

    state.isAnimating = true;
    const currentSlide = slides[state.current];
    const nextSlide = slides[index];

    playClickSound();

    // GSAP Exit Animation
    gsap.to(currentSlide, {
      opacity: 0,
      scale: 0.95,
      y: -20,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        currentSlide.classList.remove("active");
        nextSlide.classList.add("active");

        // GSAP Entrance Animation
        gsap.fromTo(
          nextSlide,
          { opacity: 0, scale: 1.05, y: 30 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            onComplete: () => {
              state.isAnimating = false;
            }
          }
        );

        // Content Stagger Reveal
        const contentElements = nextSlide.querySelectorAll(".slide-meta-row, .slide-title, .slide-tagline, .countdown-hud, .credits-grid, .slide-buttons");
        gsap.fromTo(
          contentElements,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: "power2.out" }
        );
      }
    });

    state.current = index;
    updateUI();
  }

  function updateUI() {
    const pad = n => String(n + 1).padStart(2, "0");
    if (indexerCurrent) indexerCurrent.textContent = pad(state.current);
    if (progressFill) {
      const pct = ((state.current + 1) / state.total) * 100;
      progressFill.style.width = `${pct}%`;
    }
  }

  // Navigation Event Listeners
  if (btnNext) btnNext.addEventListener("click", () => goToSlide((state.current + 1) % state.total));
  if (btnPrev) btnPrev.addEventListener("click", () => goToSlide((state.current - 1 + state.total) % state.total));

  // Wheel / Trackpad Scroll Navigation
  let wheelTimeout;
  window.addEventListener("wheel", e => {
    if (drawer && drawer.classList.contains("active")) return;
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
      if (e.deltaY > 30) {
        goToSlide((state.current + 1) % state.total);
      } else if (e.deltaY < -30) {
        goToSlide((state.current - 1 + state.total) % state.total);
      }
    }, 40);
  }, { passive: true });

  // Keyboard Arrow Navigation
  window.addEventListener("keydown", e => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      goToSlide((state.current + 1) % state.total);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      goToSlide((state.current - 1 + state.total) % state.total);
    } else if (e.key === "Escape" && drawer) {
      drawer.classList.remove("active");
    }
  });

  // Touch Drag Support
  let touchStartY = 0;
  window.addEventListener("touchstart", e => {
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  window.addEventListener("touchend", e => {
    if (drawer && drawer.classList.contains("active")) return;
    const touchEndY = e.changedTouches[0].screenY;
    if (touchStartY - touchEndY > 50) {
      goToSlide((state.current + 1) % state.total);
    } else if (touchEndY - touchStartY > 50) {
      goToSlide((state.current - 1 + state.total) % state.total);
    }
  }, { passive: true });

  // =========================================================================
  // 2. REAL-TIME COUNTDOWN ENGINE
  // =========================================================================
  const doomsdayTarget = new Date(Date.UTC(2026, 11, 18, 5, 0, 0)).getTime();
  const daysEl = document.getElementById("hud-days");
  const hoursEl = document.getElementById("hud-hours");
  const minsEl = document.getElementById("hud-mins");
  const secsEl = document.getElementById("hud-secs");
  const utcClockEl = document.getElementById("utc-clock-time");

  function updateClocks() {
    const now = new Date();
    const diff = doomsdayTarget - now.getTime();

    // UTC Header Readout
    if (utcClockEl) {
      const h = String(now.getUTCHours()).padStart(2, "0");
      const m = String(now.getUTCMinutes()).padStart(2, "0");
      const s = String(now.getUTCSeconds()).padStart(2, "0");
      utcClockEl.textContent = `${h}:${m}:${s} UTC`;
    }

    if (diff <= 0) {
      if (daysEl) daysEl.textContent = "00";
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
    if (secsEl && secsEl.textContent !== pad(secs)) secsEl.textContent = pad(secs);
  }

  updateClocks();
  setInterval(updateClocks, 1000);

  // =========================================================================
  // 3. DOSSIER DRAWER MODAL
  // =========================================================================
  function openDossier() {
    if (!drawer) return;
    drawer.classList.add("active");
    gsap.fromTo(
      ".drawer-container",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
    );
  }

  function closeDossier() {
    if (!drawer) return;
    drawer.classList.remove("active");
  }

  if (drawerToggle) drawerToggle.addEventListener("click", openDossier);
  if (closeDrawer) closeDrawer.addEventListener("click", closeDossier);
  exploreBtns.forEach(btn => btn.addEventListener("click", openDossier));

  // =========================================================================
  // 4. "WILL RETURN" BADGE GENERATOR
  // =========================================================================
  const badgeInput = document.getElementById("fan-name-input");
  const badgeNameDisplay = document.getElementById("badge-name-display");
  const copyBadgeBtn = document.getElementById("copy-badge-btn");

  if (badgeInput && badgeNameDisplay) {
    badgeInput.addEventListener("input", e => {
      const val = e.target.value.trim();
      badgeNameDisplay.textContent = val ? val.toUpperCase() : "YOU";
    });
  }

  if (copyBadgeBtn && badgeNameDisplay) {
    copyBadgeBtn.addEventListener("click", () => {
      const text = `${badgeNameDisplay.textContent} WILL RETURN IN AVENGERS: DOOMSDAY`;
      navigator.clipboard.writeText(text).then(() => {
        copyBadgeBtn.textContent = "COPIED!";
        setTimeout(() => { copyBadgeBtn.textContent = "COPY BADGE"; }, 2000);
      });
    });
  }

  // =========================================================================
  // 5. CINEMATIC AMBIENT AUDIO SYNTHESIZER (Web Audio API)
  // =========================================================================
  const audioBtn = document.getElementById("audio-toggle");

  function playClickSound() {
    if (!state.soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {}
  }

  if (audioBtn) {
    audioBtn.addEventListener("click", () => {
      if (!state.soundEnabled) {
        try {
          state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          state.oscillator = state.audioCtx.createOscillator();
          state.gainNode = state.audioCtx.createGain();

          state.oscillator.type = "sine";
          state.oscillator.frequency.setValueAtTime(65.41, state.audioCtx.currentTime); // C2 drone
          state.gainNode.gain.setValueAtTime(0.04, state.audioCtx.currentTime);

          state.oscillator.connect(state.gainNode);
          state.gainNode.connect(state.audioCtx.destination);
          state.oscillator.start();

          state.soundEnabled = true;
          audioBtn.classList.add("active");
          audioBtn.textContent = "SOUND: ON";
        } catch (e) {
          console.warn("Audio Context blocked.");
        }
      } else {
        if (state.oscillator) state.oscillator.stop();
        if (state.audioCtx) state.audioCtx.close();
        state.soundEnabled = false;
        audioBtn.classList.remove("active");
        audioBtn.textContent = "SOUND: OFF";
      }
    });
  }

  // Trigger initial slide reveal
  const initialContent = slides[0].querySelectorAll(".slide-meta-row, .slide-title, .slide-tagline, .countdown-hud, .credits-grid, .slide-buttons");
  gsap.fromTo(
    initialContent,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, stagger: 0.08, duration: 0.8, delay: 0.2, ease: "power3.out" }
  );
});
