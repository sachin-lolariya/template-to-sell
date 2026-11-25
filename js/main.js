/**
 * AETHER ATELIER // HIGH-CONVERTING CREATIVE DIRECTION & SOCIAL ARCHITECTURE
 * Core Interactive Controller & Motion Runtime
 * Powered by GSAP 3 & ScrollTrigger
 */

document.addEventListener("DOMContentLoaded", () => {
  // Register GSAP ScrollTrigger if available
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  // --------------------------------------------------------------------------
  // 1. MOBILE DRAWER NAVIGATION
  // --------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const burgerLine1 = document.getElementById("burger-line-1");
  const burgerLine2 = document.getElementById("burger-line-2");

  if (mobileMenuBtn && mobileMenu) {
    let isOpen = false;

    function toggleMenu() {
      isOpen = !isOpen;
      mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));

      if (isOpen) {
        mobileMenu.classList.remove("hidden-drawer");
        mobileMenu.classList.add("open-drawer");
        if (burgerLine1 && burgerLine2) {
          burgerLine1.style.transform = "translateY(5px) rotate(45deg)";
          burgerLine2.style.transform = "translateY(-5px) rotate(-45deg)";
        }
      } else {
        mobileMenu.classList.remove("open-drawer");
        mobileMenu.classList.add("hidden-drawer");
        if (burgerLine1 && burgerLine2) {
          burgerLine1.style.transform = "none";
          burgerLine2.style.transform = "none";
        }
      }
    }

    mobileMenuBtn.addEventListener("click", toggleMenu);

    // Auto close on clicking any link inside
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (isOpen) toggleMenu();
      });
    });
  }

  // --------------------------------------------------------------------------
  // 2. THE EDITORIAL MANIFESTO: WORD-BY-WORD SCROLL ILLUMINATION
  // --------------------------------------------------------------------------
  const manifestoSection = document.getElementById("manifesto");
  if (manifestoSection && typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    const words = manifestoSection.querySelectorAll(".wall-word");
    if (words.length > 0) {
      ScrollTrigger.create({
        trigger: manifestoSection,
        start: "top 75%",
        end: "bottom 35%",
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;
          const activeIndex = Math.floor(progress * words.length * 1.05);

          words.forEach((w, index) => {
            if (index <= activeIndex) {
              w.setAttribute("data-lit", "true");
              w.style.color = "var(--ink)";
            } else {
              w.setAttribute("data-lit", "false");
              w.style.color = "rgba(10, 13, 20, 0.18)";
            }
          });

          // Markers highlight
          manifestoSection.querySelectorAll(".marker-highlight").forEach((marker) => {
            const hasLit = marker.querySelector('[data-lit="true"]');
            if (hasLit) {
              marker.setAttribute("data-on", "true");
            } else {
              marker.setAttribute("data-on", "false");
            }
          });
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // 3. INTERACTIVE CONTENT LAB & ROI SIMULATOR
  // --------------------------------------------------------------------------
  const labData = {
    tiktok: {
      fashion: {
        badge: "TikTok · Luxury Fashion Specification",
        title: "The Atelier Unboxing & Restoration Protocol",
        desc: "Focusing on raw craftsmanship textures, ASMR sound layering, and studio restoration clips that outpace traditional branded polish.",
        views: "1.8M - 2.5M",
        cadence: "5x / Week",
        engagement: "9.4%",
        tag: "Hook 01 · 84% retention",
        text: '"Most people throw this away. Here is why we keep it."',
        img: "images/hero/bag.jpg"
      },
      tech: {
        badge: "TikTok · Deep Tech & Hardware Specification",
        title: "The Bench Test & Oscilloscope Protocol",
        desc: "Raw 12-second engineering teardowns and micro-precision tests that make complex hardware immediately viral to both hobbyists and C-suite buyers.",
        views: "850k - 1.4M",
        cadence: "4x / Week",
        engagement: "11.2%",
        tag: "Hook 02 · 91% retention",
        text: '"What happens when you run 40,000 RPM through a 2mm spindle?"',
        img: "images/hero/speaker.jpg"
      },
      beauty: {
        badge: "TikTok · Skincare & Clinical Formulation",
        title: "The Macro Dropper & pH Test Protocol",
        desc: "Hyper-macro 4K viscosity shots paired with transparent scientific proof and ingredient teardowns that trigger instant add-to-cart conversions.",
        views: "2.2M - 3.8M",
        cadence: "6x / Week",
        engagement: "12.8%",
        tag: "Hook 03 · 88% retention",
        text: '"Your serum should never turn this color after 30 days."',
        img: "images/hero/beauty.jpg"
      }
    },
    instagram: {
      fashion: {
        badge: "Instagram Reels · High-Fashion Editorial",
        title: "The Runway Behind-the-Scenes & Silhouette Study",
        desc: "Cinematic color-graded 9:16 reels focusing on garment movement, textile drape, and founder styling breakdowns.",
        views: "900k - 1.6M",
        cadence: "4x / Week",
        engagement: "7.8%",
        tag: "Reel Format · 78% saves",
        text: '"3 ways to style tailored wool without looking corporate."',
        img: "images/hero/rooftop.jpg"
      },
      tech: {
        badge: "Instagram Reels · Industrial Design",
        title: "Tactile Product Reveal & CNC Machining",
        desc: "Hypnotic machining timelapses, anodized aluminum reflections, and clean acoustic switches.",
        views: "650k - 1.1M",
        cadence: "3x / Week",
        engagement: "8.9%",
        tag: "Reel Format · 82% saves",
        text: '"Zero visible screws. How we engineered the unibody chassis."',
        img: "images/hero/concert.jpg"
      },
      beauty: {
        badge: "Instagram Reels · Clean Beauty Aesthetic",
        title: "Golden Hour Glow & Morning Ritual Routine",
        desc: "Natural sunlight skin textures, authentic bathroom shelfies, and zero airbrushing to build deep consumer trust.",
        views: "1.4M - 2.1M",
        cadence: "5x / Week",
        engagement: "10.4%",
        tag: "Reel Format · 85% saves",
        text: '"Skin texture is normal. Heavy silicones are not."',
        img: "images/hero/latte.jpg"
      }
    },
    youtube: {
      fashion: {
        badge: "YouTube Shorts · Heritage Craftsmanship",
        title: "The 60-Second Master Tailor Teardown",
        desc: "Fast-paced documentary shorts breaking down counterfeit stitching vs hand-sewn bespoke tailoring.",
        views: "1.2M - 2.8M",
        cadence: "4x / Week",
        engagement: "6.9%",
        tag: "Shorts · 92% viewed",
        text: '"How to spot cheap cashmere in under 5 seconds."',
        img: "images/hero/canal.jpg"
      },
      tech: {
        badge: "YouTube Shorts · Engineering Teardown",
        title: "The Impossible Patent Explained",
        desc: "Explaining physics-defying hardware mechanisms with 3D overlays and high-speed camera capture.",
        views: "1.5M - 3.2M",
        cadence: "3x / Week",
        engagement: "9.8%",
        tag: "Shorts · 95% viewed",
        text: '"Why Apple engineers could not solve this hinge problem."',
        img: "images/hero/speaker.jpg"
      },
      beauty: {
        badge: "YouTube Shorts · Cosmetic Chemistry",
        title: "The $120 Cream vs $14 Pure Glycerin Test",
        desc: "No-nonsense laboratory comparisons that capture search intent and algorithmic recommendation loops.",
        views: "2.5M - 4.2M",
        cadence: "4x / Week",
        engagement: "8.4%",
        tag: "Shorts · 89% viewed",
        text: '"Why cosmetic brands charge $90 for 1% active niacinamide."',
        img: "images/hero/beauty.jpg"
      }
    },
    linkedin: {
      fashion: {
        badge: "LinkedIn Video · Supply Chain & Luxury Economics",
        title: "The Direct-to-Consumer Margin Breakdown",
        desc: "Founder video essays dissecting the hidden economics of European luxury houses vs independent agile studios.",
        views: "120k - 350k",
        cadence: "2x / Week",
        engagement: "14.2%",
        tag: "B2B Reach · 640+ C-suite saves",
        text: '"Why wholesale retail is quietly dying for emerging fashion brands."',
        img: "images/hero/podcast.jpg"
      },
      tech: {
        badge: "LinkedIn Video · Hardware Architecture",
        title: "Building Deep Tech in Public",
        desc: "Honest founder updates on sensor calibration, supply chain bottlenecks, and seed-to-Series A milestones.",
        views: "180k - 480k",
        cadence: "2x / Week",
        engagement: "16.8%",
        tag: "B2B Reach · 820+ C-suite saves",
        text: '"We spent 9 months failing this drop test. Here is the exact fix."',
        img: "images/hero/podcast.jpg"
      },
      beauty: {
        badge: "LinkedIn Video · Brand Scaling & Retail Ops",
        title: "From Kitchen Formulation to 400 Sephora Doors",
        desc: "Strategic retail expansion insights and consumer loyalty economics for venture investors and CPG operators.",
        views: "150k - 400k",
        cadence: "2x / Week",
        engagement: "13.5%",
        tag: "B2B Reach · 510+ C-suite saves",
        text: '"The customer acquisition unit economics that made us profitable in year 1."',
        img: "images/hero/podcast.jpg"
      }
    }
  };

  let currentPlatform = "tiktok";
  let currentVertical = "fashion";

  function updateLabUI() {
    const data = labData[currentPlatform][currentVertical];
    if (!data) return;

    const badgeEl = document.getElementById("lab-badge");
    const titleEl = document.getElementById("lab-title");
    const descEl = document.getElementById("lab-desc");
    const viewsEl = document.getElementById("lab-views");
    const cadenceEl = document.getElementById("lab-cadence");
    const engagementEl = document.getElementById("lab-engagement");
    const cardTagEl = document.getElementById("lab-card-tag");
    const cardTextEl = document.getElementById("lab-card-text");
    const previewImgEl = document.getElementById("lab-preview-img");

    if (badgeEl) badgeEl.textContent = data.badge;
    if (titleEl) titleEl.textContent = data.title;
    if (descEl) descEl.textContent = data.desc;
    if (viewsEl) viewsEl.textContent = data.views;
    if (cadenceEl) cadenceEl.textContent = data.cadence;
    if (engagementEl) engagementEl.textContent = data.engagement;
    if (cardTagEl) cardTagEl.textContent = data.tag;
    if (cardTextEl) cardTextEl.textContent = data.text;
    if (previewImgEl) previewImgEl.src = data.img;

    // Tactile Number Animation Punch
    if (typeof gsap !== "undefined" && viewsEl && engagementEl && cadenceEl) {
      gsap.fromTo([viewsEl, engagementEl, cadenceEl], 
        { opacity: 0.35, y: 4, scale: 0.98 }, 
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "power2.out", stagger: 0.04 }
      );
    }

    // Button states
    document.querySelectorAll(".lab-platform-btn").forEach((btn) => {
      const p = btn.getAttribute("data-platform");
      if (p === currentPlatform) {
        btn.classList.add("bg-ink", "text-white");
        btn.classList.remove("bg-sand", "text-ink");
      } else {
        btn.classList.remove("bg-ink", "text-white");
        btn.classList.add("bg-sand", "text-ink");
      }
    });

    document.querySelectorAll(".lab-vertical-btn").forEach((btn) => {
      const v = btn.getAttribute("data-vertical");
      if (v === currentVertical) {
        btn.classList.add("bg-ink", "text-white");
        btn.classList.remove("bg-sand", "text-ink");
      } else {
        btn.classList.remove("bg-ink", "text-white");
        btn.classList.add("bg-sand", "text-ink");
      }
    });
  }

  document.querySelectorAll(".lab-platform-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentPlatform = btn.getAttribute("data-platform");
      updateLabUI();
    });
  });

  document.querySelectorAll(".lab-vertical-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentVertical = btn.getAttribute("data-vertical");
      updateLabUI();
    });
  });

  // --------------------------------------------------------------------------
  // 4. UNEDITED GROUP CHAT TAB CONTROLLER
  // --------------------------------------------------------------------------
  const chatThreads = {
    harriet: {
      avatarBg: "#1E3A8A",
      initials: "HM",
      name: "Harriet, Mossline Atelier",
      role: "Founder & Creative Director · with Aether Team",
      messages: [
        { sender: "client", text: "my dad is now famous for darning lol 😂 He got stopped at the Leeds farmers market this morning!!", time: "10:42 AM" },
        { sender: "aether", text: "Wait what happened?? Did the Sunday repair reel blow up?", time: "10:44 AM · Delivered" },
        { sender: "client", text: "It hit 1.4M views on TikTok and 680k on Reels! Wholesale inquiries jumped +340% in 5 days. You guys are literal magicians. 🪄✨", time: "10:47 AM" }
      ]
    },
    aiko: {
      avatarBg: "#0F766E",
      initials: "QL",
      name: "Aiko, Quiet Labs",
      role: "VP of Engineering · with Aether Team",
      messages: [
        { sender: "client", text: "Kevin now has an executive fan club on LinkedIn 😂 That 12s oscilloscope debug clip just crossed 800 saves.", time: "02:15 PM" },
        { sender: "aether", text: "Incredible! Has it translated to inbound demos yet?", time: "02:18 PM · Delivered" },
        { sender: "client", text: "We literally booked 4 enterprise VP demos this morning alone. Siemens and ABB engineers are commenting on the thread. Total gamechanger.", time: "02:24 PM" }
      ]
    },
    leila: {
      avatarBg: "#C2410C",
      initials: "SS",
      name: "Leila, Sunday Skin",
      role: "Co-Founder & CEO · with Aether Team",
      messages: [
        { sender: "client", text: "Shopify just crashed AGAIN. 4,000 serum units gone in under 72 hours! 🚨😭", time: "06:30 PM" },
        { sender: "aether", text: "The raw macro texture unboxing video hit the algorithm! Checking analytics now.", time: "06:32 PM · Delivered" },
        { sender: "client", text: "We are rushing factory production tomorrow at 7am. We need 10 more formats for the summer launch, don't let our pod sleep!", time: "06:36 PM" }
      ]
    }
  };

  const chatTabs = document.querySelectorAll(".chat-tab-btn");
  const activeAvatar = document.getElementById("active-chat-avatar");
  const activeName = document.getElementById("active-chat-name");
  const activeRole = document.getElementById("active-chat-role");
  const messagesContainer = document.getElementById("chat-messages-container");

  chatTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const chatId = tab.getAttribute("data-chat-id");
      const thread = chatThreads[chatId];
      if (!thread) return;

      // Update active tab styles
      chatTabs.forEach((t) => {
        t.setAttribute("aria-selected", "false");
        t.classList.remove("bg-paper", "shadow-sm", "border", "border-ink/5");
        t.classList.add("hover:bg-sand/60");
      });
      tab.setAttribute("aria-selected", "true");
      tab.classList.add("bg-paper", "shadow-sm", "border", "border-ink/5");
      tab.classList.remove("hover:bg-sand/60");

      // Update header
      if (activeAvatar) {
        activeAvatar.style.backgroundColor = thread.avatarBg;
        activeAvatar.textContent = thread.initials;
      }
      if (activeName) activeName.textContent = thread.name;
      if (activeRole) activeRole.textContent = thread.role;

      // Render messages with GSAP stagger animation
      if (messagesContainer) {
        messagesContainer.innerHTML = "";
        thread.messages.forEach((msg) => {
          if (msg.sender === "client") {
            const bubble = document.createElement("div");
            bubble.className = "flex items-end gap-3 max-w-[85%] opacity-0 translate-y-2 transition-all duration-300";
            bubble.innerHTML = `
              <div class="flex size-8 shrink-0 items-center justify-center rounded-full font-heading font-bold text-white text-xs" style="background-color: ${thread.avatarBg}">${thread.initials}</div>
              <div class="rounded-2xl rounded-bl-sm border border-ink/10 bg-paper p-4 shadow-sm text-sm text-ink leading-relaxed">
                ${msg.text}
                <span class="mt-1 block text-right font-mono text-[9px] text-stone">${msg.time}</span>
              </div>
            `;
            messagesContainer.appendChild(bubble);
          } else {
            const bubble = document.createElement("div");
            bubble.className = "flex flex-col items-end max-w-[85%] self-end opacity-0 translate-y-2 transition-all duration-300";
            bubble.innerHTML = `
              <div class="rounded-2xl rounded-br-sm bg-ink p-4 text-sm text-white leading-relaxed">
                ${msg.text}
                <span class="mt-1 block text-right font-mono text-[9px] text-white/50">${msg.time}</span>
              </div>
            `;
            messagesContainer.appendChild(bubble);
          }
        });

        // Stagger entrance
        const bubbles = messagesContainer.children;
        Array.from(bubbles).forEach((b, i) => {
          setTimeout(() => {
            b.classList.remove("opacity-0", "translate-y-2");
          }, i * 100);
        });
      }
    });
  });

  // --------------------------------------------------------------------------
  // 5. PRICING MONTHLY / QUARTERLY TOGGLE
  // --------------------------------------------------------------------------
  const monthlyBtn = document.getElementById("billing-monthly-btn");
  const quarterlyBtn = document.getElementById("billing-quarterly-btn");
  const pricePilot = document.getElementById("price-pilot");
  const priceVelocity = document.getElementById("price-velocity");
  const priceEnterprise = document.getElementById("price-enterprise");

  if (monthlyBtn && quarterlyBtn) {
    monthlyBtn.addEventListener("click", () => {
      monthlyBtn.classList.add("bg-ink", "text-white");
      monthlyBtn.classList.remove("text-stone");
      quarterlyBtn.classList.remove("bg-ink", "text-white");
      quarterlyBtn.classList.add("text-stone");

      if (pricePilot) pricePilot.textContent = "$4,800";
      if (priceVelocity) priceVelocity.textContent = "$8,500";
      if (priceEnterprise) priceEnterprise.textContent = "$14,000";
    });

    quarterlyBtn.addEventListener("click", () => {
      quarterlyBtn.classList.add("bg-ink", "text-white");
      quarterlyBtn.classList.remove("text-stone");
      monthlyBtn.classList.remove("bg-ink", "text-white");
      monthlyBtn.classList.add("text-stone");

      if (pricePilot) pricePilot.textContent = "$4,080";
      if (priceVelocity) priceVelocity.textContent = "$7,225";
      if (priceEnterprise) priceEnterprise.textContent = "$11,900";
    });
  }

  // --------------------------------------------------------------------------
  // 6. ACCORDION FAQ
  // --------------------------------------------------------------------------
  document.querySelectorAll(".faq-toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const isExpanded = toggle.getAttribute("aria-expanded") === "true";
      const answer = toggle.nextElementSibling;
      const chevron = toggle.querySelector(".faq-chevron");

      // Close other FAQs
      document.querySelectorAll(".faq-toggle").forEach((otherToggle) => {
        if (otherToggle !== toggle) {
          otherToggle.setAttribute("aria-expanded", "false");
          const otherAnswer = otherToggle.nextElementSibling;
          const otherChevron = otherToggle.querySelector(".faq-chevron");
          if (otherAnswer) otherAnswer.classList.remove("open");
          if (otherChevron) otherChevron.classList.remove("open");
        }
      });

      // Toggle current
      toggle.setAttribute("aria-expanded", String(!isExpanded));
      if (answer) answer.classList.toggle("open");
      if (chevron) chevron.classList.toggle("open");
    });
  });

  // --------------------------------------------------------------------------
  // 7. PROJECT INTAKE FORM & GOAL SELECTOR
  // --------------------------------------------------------------------------
  const goalPills = document.querySelectorAll(".goal-pill");
  goalPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      goalPills.forEach((p) => {
        p.classList.remove("border-ember", "bg-ember/5", "text-ember");
        const dot = p.querySelector(".rounded-full");
        if (dot) dot.classList.replace("bg-ember", "bg-transparent");
      });

      pill.classList.add("border-ember", "bg-ember/5", "text-ember");
      const dot = pill.querySelector(".rounded-full");
      if (dot) dot.classList.replace("bg-transparent", "bg-ember");
    });
  });

  const intakeForm = document.getElementById("project-intake-form");
  const intakeStatus = document.getElementById("intake-status-msg");
  if (intakeForm) {
    intakeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById("intake-submit-btn");
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = "<span>Transmitting Brief...</span>";
      }

      setTimeout(() => {
        intakeForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = "<span>Request Strategy Forecast</span>";
        }
        if (intakeStatus) {
          intakeStatus.textContent = "✓ Strategy Brief Received. Our partners will review your channels and reply within 24 hours.";
          intakeStatus.classList.remove("hidden");
        }
      }, 1200);
    });
  }

  // --------------------------------------------------------------------------
  // 8. LIVE STUDIO TIME CLOCKS (LONDON & NYC)
  // --------------------------------------------------------------------------
  function updateClocks() {
    const londonClock = document.getElementById("london-clock");
    const nycClock = document.getElementById("nyc-clock");
    const now = new Date();

    if (londonClock) {
      londonClock.textContent = now.toLocaleTimeString("en-GB", { timeZone: "Europe/London", hour12: false }) + " GMT";
    }
    if (nycClock) {
      nycClock.textContent = now.toLocaleTimeString("en-US", { timeZone: "America/New_York", hour12: true }) + " EST";
    }
  }
  updateClocks();
  setInterval(updateClocks, 1000);

  // --------------------------------------------------------------------------
  // 9. BACK TO TOP BUTTON
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById("back-to-top-btn");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // --------------------------------------------------------------------------
  // 10. CASE STUDY TELEMETRY EXPANDERS
  // --------------------------------------------------------------------------
  const caseNotesToggles = document.querySelectorAll(".case-notes-toggle");
  caseNotesToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const card = toggle.closest("article");
      const drawer = card ? card.querySelector(".case-telemetry-drawer") : null;
      const chevron = toggle.querySelector(".chevron-icon");
      if (drawer) {
        const isOpen = drawer.classList.contains("open");
        if (isOpen) {
          drawer.classList.remove("open");
          const label = toggle.querySelector("span");
          if (label) label.textContent = "View Campaign Telemetry";
          if (chevron) chevron.style.transform = "none";
        } else {
          drawer.classList.add("open");
          const label = toggle.querySelector("span");
          if (label) label.textContent = "Hide Campaign Telemetry";
          if (chevron) chevron.style.transform = "rotate(180deg)";
        }
      }
    });
  });

  // --------------------------------------------------------------------------
  // 11. FLAGSHIP CAMPAIGN AMBIENT AUDIO (WEB AUDIO API)
  // --------------------------------------------------------------------------
  const audioBtn = document.getElementById("flagship-audio-btn");
  const eqBars = document.getElementById("eq-bars");
  const audioBtnLabel = document.getElementById("audio-btn-label");
  const audioStatusPill = document.getElementById("audio-status-pill");
  let audioCtx = null;
  let isPlayingAudio = false;
  let masterGain = null;

  if (audioBtn) {
    audioBtn.addEventListener("click", () => {
      isPlayingAudio = !isPlayingAudio;
      audioBtn.setAttribute("aria-pressed", String(isPlayingAudio));

      if (isPlayingAudio) {
        try {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (!audioCtx && AudioContextClass) {
            audioCtx = new AudioContextClass();
          }
          if (audioCtx && audioCtx.state === "suspended") {
            audioCtx.resume();
          }

          if (audioCtx) {
            // Warm studio ambient drone (F# minor chord: 92.5Hz & 138.6Hz)
            masterGain = audioCtx.createGain();
            masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
            masterGain.gain.exponentialRampToValueAtTime(0.035, audioCtx.currentTime + 1.2);

            const filter = audioCtx.createBiquadFilter();
            filter.type = "lowpass";
            filter.frequency.setValueAtTime(420, audioCtx.currentTime);

            const osc1 = audioCtx.createOscillator();
            osc1.type = "sine";
            osc1.frequency.setValueAtTime(92.5, audioCtx.currentTime); // F#2

            const osc2 = audioCtx.createOscillator();
            osc2.type = "sine";
            osc2.frequency.setValueAtTime(138.6, audioCtx.currentTime); // C#3

            osc1.connect(filter);
            osc2.connect(filter);
            filter.connect(masterGain);
            masterGain.connect(audioCtx.destination);

            osc1.start();
            osc2.start();
          }
        } catch (err) {
          console.warn("AudioContext initialization note:", err);
        }

        if (eqBars) eqBars.classList.remove("eq-paused");
        if (audioBtnLabel) audioBtnLabel.textContent = "Studio Sound Live";
        if (audioStatusPill) {
          audioStatusPill.textContent = "Live";
          audioStatusPill.className = "rounded bg-volt/30 text-volt px-1.5 py-0.5 text-[9px] uppercase font-bold";
        }
      } else {
        if (masterGain && audioCtx) {
          masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
          masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);
          setTimeout(() => {
            if (audioCtx && audioCtx.state === "running") audioCtx.suspend();
          }, 450);
        }

        if (eqBars) eqBars.classList.add("eq-paused");
        if (audioBtnLabel) audioBtnLabel.textContent = "Ambient Audio Preview";
        if (audioStatusPill) {
          audioStatusPill.textContent = "Play";
          audioStatusPill.className = "rounded bg-white/20 px-1 text-[9px] uppercase font-bold text-white/90";
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 12. TACTILE 3D CARD TILT & MAGNETIC CURSOR PHYSICS
  // --------------------------------------------------------------------------
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (isFinePointer && !prefersReducedMotion && typeof gsap !== "undefined") {
    // 3D Perspective Card Tilt
    const tiltCards = document.querySelectorAll(".card-tilt");
    tiltCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, {
          rotationY: x * 6,
          rotationX: -y * 6,
          transformPerspective: 1000,
          ease: "power1.out",
          duration: 0.25
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          rotationY: 0,
          rotationX: 0,
          ease: "power2.out",
          duration: 0.5
        });
      });
    });

    // Magnetic Cursor Physics for Primary Buttons
    const magneticTargets = document.querySelectorAll(".magnetic-target");
    magneticTargets.forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const deltaX = (e.clientX - rect.left - rect.width / 2) * 0.28;
        const deltaY = (e.clientY - rect.top - rect.height / 2) * 0.28;
        gsap.to(btn, { x: deltaX, y: deltaY, duration: 0.25, ease: "power2.out" });
      });

      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.45, ease: "elastic.out(1, 0.4)" });
      });
    });
  }

  // --------------------------------------------------------------------------
  // 13. NEWSLETTER SIGNAL FEEDBACK DELIGHT
  // --------------------------------------------------------------------------
  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      const submitBtn = newsletterForm.querySelector('button[type="submit"]');
      if (input && submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "✓ Dispatched";
        submitBtn.classList.replace("bg-ink", "bg-volt");
        submitBtn.classList.add("text-ink");
        input.value = "Signal locked. Check your inbox.";
        input.disabled = true;

        setTimeout(() => {
          input.value = "";
          input.disabled = false;
          input.placeholder = "founder@company.com";
          submitBtn.disabled = false;
          submitBtn.textContent = "Join";
          submitBtn.classList.replace("bg-volt", "bg-ink");
          submitBtn.classList.remove("text-ink");
        }, 4000);
      }
    });
  }

  console.log("Aether Atelier Studio Runtime Initialized Successfully.");
});
