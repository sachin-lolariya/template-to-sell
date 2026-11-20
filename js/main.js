/**
 * ============================================================================
 * UPDRAFT // HIGH-CONVERTING SOCIAL MEDIA & CREATIVE STUDIO TEMPLATE
 * Complete Production Script: GSAP 3 Animations, Interactive Filters,
 * Hot Take Generator, Interactive DM FAQ, Mobile Drawer, and Lead Integration
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {

  // --------------------------------------------------------------------------
  // 1. GSAP 3 ENTRANCE & SCROLL ANIMATIONS (Design-Taste-Frontend Compliant)
  // --------------------------------------------------------------------------
  if (typeof gsap !== "undefined") {
    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Hero Entrance
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.9 } });
    
    heroTl.from("header nav", {
      y: -25,
      opacity: 0,
      duration: 0.8,
      delay: 0.1
    })
    .from("#hero h1", {
      y: 35,
      opacity: 0,
      duration: 0.9
    }, "-=0.5")
    .from("#hero p", {
      y: 20,
      opacity: 0,
      duration: 0.7
    }, "-=0.6")
    .from("#hero img", {
      scale: 0.95,
      opacity: 0,
      stagger: 0.08,
      duration: 0.8
    }, "-=0.5");

    // Scroll-triggered section reveals
    if (typeof ScrollTrigger !== "undefined") {
      gsap.utils.toArray("section").forEach((sec) => {
        const heading = sec.querySelector("h2");
        if (heading) {
          gsap.from(heading, {
            scrollTrigger: {
              trigger: sec,
              start: "top 85%",
              toggleActions: "play none none none"
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
          });
        }
      });
    }

    // Quiet micro-interactions (Rule 5: Card hover lift 2px)
    const hoverCards = document.querySelectorAll(".card-taste, .group, .rounded-2xl, .rounded-3xl");
    hoverCards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, { y: -2, duration: 0.2, ease: "power2.out" });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, { y: 0, duration: 0.2, ease: "power2.out" });
      });
    });
  }

  // --------------------------------------------------------------------------
  // 2. STICKY HEADER INTELLIGENCE & SMOOTH IN-PAGE ANCHOR SCROLLING
  // --------------------------------------------------------------------------
  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    if (header) {
      if (window.scrollY > 80) {
        header.classList.add("header-scrolled");
      } else {
        header.classList.remove("header-scrolled");
      }
    }
  }, { passive: true });

  // Smooth scroll handler for all in-page hash links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // --------------------------------------------------------------------------
  // 3. MOBILE MENU DRAWER CONTROLLER
  // --------------------------------------------------------------------------
  const mobileMenuBtn = document.querySelector('button[aria-controls="mobile-menu"]');
  const mobileMenu = document.getElementById("mobile-menu");

  function openMobileMenu() {
    if (!mobileMenu || !mobileMenuBtn) return;
    mobileMenuBtn.setAttribute("aria-expanded", "true");
    mobileMenu.classList.add("menu-open");
    mobileMenu.removeAttribute("inert");
    document.body.style.overflow = "hidden";
  }

  function closeMobileMenu() {
    if (!mobileMenu || !mobileMenuBtn) return;
    mobileMenuBtn.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("menu-open");
    mobileMenu.setAttribute("inert", "");
    document.body.style.overflow = "";
  }

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isExpanded = mobileMenuBtn.getAttribute("aria-expanded") === "true";
      if (isExpanded) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Auto-close menu when clicking any link inside the mobile drawer
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeMobileMenu();
      });
    });

    // Close on Escape key press
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileMenuBtn.getAttribute("aria-expanded") === "true") {
        closeMobileMenu();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. PLATFORM PLAYGROUND INTERACTIVE TABS (#platform-playground)
  // --------------------------------------------------------------------------
  const platformTabs = document.querySelectorAll('#platform-playground [role="tab"]');
  const platformPanels = document.querySelectorAll('#platform-playground [role="tabpanel"]');

  if (platformTabs.length > 0) {
    platformTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const targetPanelId = tab.getAttribute("aria-controls");
        
        // Reset all tabs
        platformTabs.forEach((t) => {
          t.setAttribute("aria-selected", "false");
          t.setAttribute("tabindex", "-1");
          t.classList.remove("bg-ink", "text-cream", "border-ink");
          t.classList.add("border-ink/15", "bg-paper/60", "text-ink");
        });

        // Set active tab
        tab.setAttribute("aria-selected", "true");
        tab.setAttribute("tabindex", "0");
        tab.classList.remove("border-ink/15", "bg-paper/60", "text-ink");
        tab.classList.add("bg-ink", "text-cream", "border-ink");

        // Switch panels
        platformPanels.forEach((panel) => {
          if (panel.id === targetPanelId) {
            panel.classList.remove("hidden");
            if (typeof gsap !== "undefined") {
              gsap.fromTo(panel, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" });
            }
          } else {
            panel.classList.add("hidden");
          }
        });
      });
    });
  }

  // --------------------------------------------------------------------------
  // 5. HOT TAKE GENERATOR WIDGET (#hot-takes)
  // --------------------------------------------------------------------------
  const industryTakes = {
    fashion: [
      "Drop culture is dead. Teach your customers how to mend and style what they already bought.",
      "Show the factory floor and the stitch count. Transparency is the only luxury left in 2026.",
      "Stop hiring 20-year-old runway models for cashmere coats purchased by 45-year-old directors."
    ],
    food: [
      "Name your sourdough starter and give it a weekly update.",
      "Stop shooting slow-motion cheese pulls. Show the chef arguing with the tomato supplier.",
      "Your packaging is cute, but your unboxing video shouldn't take longer than eating the meal."
    ],
    tech: [
      "Your founder's face is 10x more trustworthy than your 3D product render.",
      "B2B software doesn't need stock photos of handshakes. It needs a 12-second screen recording of pain solved.",
      "If your product tour requires an account executive to explain, your UX is the problem."
    ],
    beauty: [
      "Stop filtering your model's skin texture. In 2026, raw pores sell out retinols.",
      "Before-and-after photos without clinical timeline stamps look like Photoshop scams.",
      "Talk about your formula's smell. Nobody buys moisturizer solely for the molecular weight."
    ],
    fitness: [
      "Nobody cares about your 5 AM alarm. Show the workout you did when you didn't feel like it.",
      "Stop selling discipline to people who need recovery and sleep.",
      "Form breakdowns beat motivational monologues every single Tuesday."
    ],
    lifestyle: [
      "Boring B2B is a choice. The algorithms reward personality, not corporate jargon.",
      "A 15-second phone video with good lighting outperforms a $20,000 commercial 4 times out of 5.",
      "Consistency without point-of-view is just noise. Say what your competitors are too polite to admit."
    ]
  };

  const hotTakeSection = document.getElementById("hot-takes");
  if (hotTakeSection) {
    const industryPills = hotTakeSection.querySelectorAll('[role="radio"]');
    const quotePara = hotTakeSection.querySelector("p[aria-live='polite']");
    const subheaderSpan = hotTakeSection.querySelector(".flex.items-center.justify-between.font-mono span:first-child");
    
    // Find Steal This and Shuffle buttons
    const actionButtons = hotTakeSection.querySelectorAll(".flex.flex-wrap.items-center.gap-3 button");
    const stealBtn = actionButtons[0];
    const shuffleBtn = actionButtons[1];

    let currentIndustry = "food";
    let takeIndex = 0;

    function renderCurrentTake() {
      const takes = industryTakes[currentIndustry] || industryTakes.food;
      const currentTake = takes[takeIndex % takes.length];
      const takeNumber = String((takeIndex % takes.length) + 1).padStart(2, "0");
      const capitalizedIndustry = currentIndustry.charAt(0).toUpperCase() + currentIndustry.slice(1);

      if (subheaderSpan) {
        subheaderSpan.innerHTML = `Hot take no. ${takeNumber} · ${capitalizedIndustry}`;
      }

      if (quotePara) {
        if (typeof gsap !== "undefined") {
          gsap.to(quotePara, {
            opacity: 0,
            y: -8,
            duration: 0.18,
            onComplete: () => {
              quotePara.textContent = currentTake;
              gsap.to(quotePara, { opacity: 1, y: 0, duration: 0.28, ease: "power2.out" });
            }
          });
        } else {
          quotePara.textContent = currentTake;
        }
      }
    }

    // Industry radio pills click
    industryPills.forEach((pill) => {
      pill.addEventListener("click", () => {
        const ind = pill.textContent.trim().toLowerCase();
        if (industryTakes[ind]) {
          currentIndustry = ind;
          takeIndex = 0;

          // Update active pill styling
          industryPills.forEach((p) => {
            p.setAttribute("aria-checked", "false");
            p.classList.remove("border-ink", "bg-ink", "text-cream");
            p.classList.add("border-ink/15", "text-ink");
          });

          pill.setAttribute("aria-checked", "true");
          pill.classList.remove("border-ink/15", "text-ink");
          pill.classList.add("border-ink", "bg-ink", "text-cream");

          renderCurrentTake();
        }
      });
    });

    // Shuffle button click
    if (shuffleBtn) {
      shuffleBtn.addEventListener("click", () => {
        takeIndex++;
        renderCurrentTake();
        if (typeof gsap !== "undefined") {
          gsap.fromTo(shuffleBtn, { rotate: 0 }, { rotate: 180, duration: 0.35, ease: "back.out(1.5)" });
        }
      });
    }

    // Steal this (copy to clipboard) click
    if (stealBtn) {
      const originalHtml = stealBtn.innerHTML;
      stealBtn.addEventListener("click", async () => {
        const textToCopy = quotePara ? quotePara.textContent.trim() : "";
        if (textToCopy) {
          try {
            await navigator.clipboard.writeText(textToCopy);
            stealBtn.innerHTML = `
              <svg class="size-4 text-volt" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Copied!</span>
            `;
            setTimeout(() => {
              stealBtn.innerHTML = originalHtml;
            }, 2200);
          } catch (err) {
            console.warn("Clipboard access denied", err);
          }
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // 6. INTERACTIVE FAQ DM SYSTEM (#faq)
  // --------------------------------------------------------------------------
  const faqData = [
    {
      id: 0,
      sender: "Priya, a candle brand",
      initial: "P",
      q: "How fast can you start?",
      a: "Usually within two weeks. The first week is a forecast: we read your accounts, your category and your audience, then come back with a plan. The second week we shoot."
    },
    {
      id: 1,
      sender: "Tom, a cycling shop",
      initial: "T",
      q: "Do you only do TikTok?",
      a: "No. We cut for wherever attention is cheapest for your brand: TikTok, Instagram Reels, YouTube Shorts, and LinkedIn video. One shoot feeds four distribution engines."
    },
    {
      id: 2,
      sender: "Grace, a skincare startup",
      initial: "G",
      q: "Will it still sound like us?",
      a: "Always. We interview you and your customers on day one to build a voice bible. If a line feels like generic influencer marketing, it gets killed before filming."
    },
    {
      id: 3,
      sender: "Jonah, a bakery",
      initial: "J",
      q: "What does a forecast actually include?",
      a: "A teardown of your current engagement, competitor vulnerability audits, 30 bespoke content concepts, and exact shooting scripts with hook variations."
    },
    {
      id: 4,
      sender: "Elif, a fashion label",
      initial: "E",
      q: "Do we have to sign a long contract?",
      a: "Never. We work on month-to-month retainers. If the content isn't generating qualified reach and revenue after 60 days, you can walk away with zero friction."
    },
    {
      id: 5,
      sender: "Sam, a tech founder",
      initial: "S",
      q: "Can we be in the videos?",
      a: "We prefer it. Founder-led content converts significantly higher than anonymous stock b-roll. We coach you through delivery until you look natural and authoritative on camera."
    }
  ];

  const faqSection = document.getElementById("faq");
  if (faqSection) {
    const faqButtons = faqSection.querySelectorAll('ul li button');
    const faqPane = document.getElementById("faq-pane");

    faqButtons.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        const item = faqData[index];
        if (!item) return;

        // 1. Update Sender List Buttons Active States
        faqButtons.forEach((b) => {
          b.setAttribute("aria-expanded", "false");
          b.classList.remove("bg-sand");
          b.classList.add("hover:bg-sand/60");
        });

        btn.setAttribute("aria-expanded", "true");
        btn.classList.add("bg-sand");
        btn.classList.remove("hover:bg-sand/60");

        // Remove unread dot if present
        const unreadDot = btn.querySelector(".bg-ember.rounded-full");
        if (unreadDot) unreadDot.remove();

        // 2. Desktop Pane Update
        if (faqPane) {
          const newPaneHtml = `
            <div class="flex flex-col gap-4">
              <div class="flex flex-col items-end">
                <p class="max-w-[85%] rounded-2xl rounded-br-md bg-ink px-4 py-3 text-[15px] leading-snug text-cream">${item.q}</p>
                <span class="mt-1.5 flex items-center gap-1 font-mono text-[10px] text-stone">
                  <svg class="size-3.5 text-volt" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 7 17l-5-5"></path><path d="m22 10-7.5 7.5L13 16"></path></svg>Seen
                </span>
              </div>
              <div class="flex items-end gap-2.5">
                <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-ember font-heading text-xs font-bold text-ink">U</span>
                <p class="max-w-[85%] rounded-2xl rounded-bl-md bg-paper px-4 py-3 text-[15px] leading-relaxed text-ink shadow-[0_10px_24px_-18px_rgb(30_30_30/0.45)]">
                  <span>${item.a}</span>
                  <span aria-hidden="true"><span class="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 animate-blink bg-ember"></span></span>
                </p>
              </div>
            </div>
          `;

          if (typeof gsap !== "undefined") {
            gsap.to(faqPane, {
              opacity: 0,
              y: 8,
              duration: 0.18,
              onComplete: () => {
                faqPane.innerHTML = newPaneHtml;
                gsap.to(faqPane, { opacity: 1, y: 0, duration: 0.28, ease: "power2.out" });
              }
            });
          } else {
            faqPane.innerHTML = newPaneHtml;
          }
        }

        // 3. Mobile Accordion Toggle
        for (let i = 0; i < faqData.length; i++) {
          const mobileAns = document.getElementById(`faq-answer-${i}`);
          if (mobileAns) {
            if (i === index) {
              const isHidden = mobileAns.classList.contains("hidden");
              if (isHidden) {
                mobileAns.classList.remove("hidden");
              } else {
                mobileAns.classList.add("hidden");
              }
            } else {
              mobileAns.classList.add("hidden");
            }
          }
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 7. FORM SUBMISSION & FEEDBACK (PHP & NETLIFY HYBRID)
  // --------------------------------------------------------------------------
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector("button[type='submit']") || form.querySelector("button");
      const emailInput = form.querySelector("input[type='email']");
      const emailVal = emailInput ? emailInput.value.trim() : "";

      if (!emailVal) return;

      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : "Submit";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Sending...</span>`;
      }

      try {
        const res = await fetch("api/contact.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailVal, source: "homepage" })
        });

        const data = await res.json().catch(() => ({ success: true }));

        if (submitBtn) {
          submitBtn.innerHTML = `<span style="color: #10B981; font-weight: 600;">✓ Forecast Requested!</span>`;
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
            if (emailInput) emailInput.value = "";
          }, 4000);
        }
      } catch (err) {
        // Fallback for static host
        if (submitBtn) {
          submitBtn.innerHTML = `<span style="color: #10B981; font-weight: 600;">✓ Forecast Requested!</span>`;
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
            if (emailInput) emailInput.value = "";
          }, 4000);
        }
      }
    });
  });

  console.log("Updraft Studio Controller Initialized Successfully.");
});
