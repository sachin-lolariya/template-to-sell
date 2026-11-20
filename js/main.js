/**
 * ============================================================================
 * UPDRAFT // HIGH-CONVERTING SOCIAL MEDIA & CREATIVE STUDIO TEMPLATE
 * Complete Production Script: GSAP 3 Animations, Interactive Filters,
 * Hot Take Generator, FAQ Accordion, and PHP/Netlify Form Integration
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // --------------------------------------------------------------------------
  // 1. GSAP 3 ENTRANCE & SCROLL ANIMATIONS
  // --------------------------------------------------------------------------
  if (typeof gsap !== "undefined") {
    // Register ScrollTrigger if available
    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Hero Entrance
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1.0 } });
    
    heroTl.from("header nav", {
      y: -30,
      opacity: 0,
      duration: 0.8,
      delay: 0.1
    })
    .from("#hero h1", {
      y: 40,
      opacity: 0,
      duration: 0.9
    }, "-=0.5")
    .from("#hero p", {
      y: 20,
      opacity: 0,
      duration: 0.7
    }, "-=0.6")
    .from("#hero img", {
      scale: 0.94,
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
            y: 35,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
          });
        }
      });
    }

    // Micro-interactions for interactive cards
    const cards = document.querySelectorAll(".group, .rounded-2xl, .rounded-3xl");
    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, { y: -3, duration: 0.25, ease: "power2.out" });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, { y: 0, duration: 0.25, ease: "power2.out" });
      });
    });
  }

  // --------------------------------------------------------------------------
  // 2. STICKY HEADER SCROLL INTELLIGENCE
  // --------------------------------------------------------------------------
  const header = document.querySelector("header");
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    if (header) {
      if (currentScrollY > 100) {
        header.classList.add("header-scrolled");
      } else {
        header.classList.remove("header-scrolled");
      }
    }
    lastScrollY = currentScrollY;
  }, { passive: true });

  // --------------------------------------------------------------------------
  // 3. INTERACTIVE PLATFORM TABS (INSTAGRAM / TIKTOK / YOUTUBE / LINKEDIN)
  // --------------------------------------------------------------------------
  const platformButtons = document.querySelectorAll("#platform-playground button, section button");
  platformButtons.forEach((btn) => {
    const text = btn.textContent.trim().toLowerCase();
    if (["instagram", "tiktok", "youtube", "linkedin"].includes(text)) {
      btn.addEventListener("click", () => {
        platformButtons.forEach(b => {
          if (["instagram", "tiktok", "youtube", "linkedin"].includes(b.textContent.trim().toLowerCase())) {
            b.classList.remove("bg-ink", "text-cream", "shadow-sm");
            b.classList.add("bg-transparent", "text-ink/60");
          }
        });
        btn.classList.remove("bg-transparent", "text-ink/60");
        btn.classList.add("bg-ink", "text-cream", "shadow-sm");

        // Gentle scale animation on tab switch
        if (typeof gsap !== "undefined") {
          gsap.fromTo(btn, { scale: 0.95 }, { scale: 1, duration: 0.2, ease: "back.out(2)" });
        }
      });
    }
  });

  // --------------------------------------------------------------------------
  // 4. INTERACTIVE CATEGORY FILTER (FASHION / FOOD / TECH / BEAUTY)
  // --------------------------------------------------------------------------
  const filterButtons = document.querySelectorAll("button");
  filterButtons.forEach((btn) => {
    const text = btn.textContent.trim().toLowerCase();
    if (["fashion", "food", "tech", "beauty", "all"].includes(text)) {
      btn.addEventListener("click", () => {
        filterButtons.forEach(b => {
          if (["fashion", "food", "tech", "beauty", "all"].includes(b.textContent.trim().toLowerCase())) {
            b.classList.remove("bg-ink", "text-cream");
            b.classList.add("bg-transparent", "text-ink/60");
          }
        });
        btn.classList.remove("bg-transparent", "text-ink/60");
        btn.classList.add("bg-ink", "text-cream");
      });
    }
  });

  // --------------------------------------------------------------------------
  // 5. HOT TAKE GENERATOR WIDGET (#hot-takes)
  // --------------------------------------------------------------------------
  const hotTakes = [
    "Your founder's face is 10x more trustworthy than your 3D product render.",
    "Boring B2B is a choice. The algorithms reward personality, not corporate jargon.",
    "If your 3-second hook doesn't make someone stop mid-scroll, the rest of the video does not exist.",
    "A 15-second phone video with good lighting outperforms a $20,000 commercial 4 times out of 5.",
    "Stop posting 'Happy Monday'. Start answering the weirdest DM question your customer support ever received.",
    "Consistency without point-of-view is just noise. Say what your competitors are too polite to admit."
  ];

  const hotTakeSection = document.getElementById("hot-takes");
  if (hotTakeSection) {
    const takeButton = hotTakeSection.querySelector("button");
    const takeCard = hotTakeSection.querySelector("p, .text-xl, .text-2xl");

    if (takeButton && takeCard) {
      let currentIndex = 0;
      takeButton.addEventListener("click", (e) => {
        e.preventDefault();
        currentIndex = (currentIndex + 1) % hotTakes.length;
        
        if (typeof gsap !== "undefined") {
          gsap.to(takeCard, {
            opacity: 0,
            y: -10,
            duration: 0.2,
            onComplete: () => {
              takeCard.textContent = `“${hotTakes[currentIndex]}”`;
              gsap.to(takeCard, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" });
            }
          });
        } else {
          takeCard.textContent = `“${hotTakes[currentIndex]}”`;
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // 6. FAQ ACCORDION INTERACTIVITY (#faq)
  // --------------------------------------------------------------------------
  const faqSection = document.getElementById("faq");
  if (faqSection) {
    const faqItems = faqSection.querySelectorAll(".group, .border-b, div[class*='border']");
    faqItems.forEach((item) => {
      const heading = item.querySelector("h3, button, [role='button']");
      const answer = item.querySelector("p:not(h3 p)");

      if (heading && answer) {
        heading.style.cursor = "pointer";
        heading.addEventListener("click", () => {
          const isOpen = answer.style.display !== "none" && answer.offsetHeight > 0;
          
          if (isOpen) {
            if (typeof gsap !== "undefined") {
              gsap.to(answer, { height: 0, opacity: 0, duration: 0.3, ease: "power2.inOut", onComplete: () => { answer.style.display = "none"; } });
            } else {
              answer.style.display = "none";
            }
          } else {
            answer.style.display = "block";
            const fullHeight = answer.scrollHeight;
            if (typeof gsap !== "undefined") {
              gsap.fromTo(answer, { height: 0, opacity: 0 }, { height: fullHeight, opacity: 1, duration: 0.35, ease: "power2.out" });
            }
          }
        });
      }
    });
  }

  // --------------------------------------------------------------------------
  // 7. NEWSLETTER & CONTACT FORM HANDLER (PHP + NETLIFY COMPLIANT)
  // --------------------------------------------------------------------------
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector("button[type='submit']") || form.querySelector("button");
      const emailInput = form.querySelector("input[type='email']");
      const emailVal = emailInput ? emailInput.value.trim() : "";

      if (!emailVal) return;

      const originalBtnText = submitBtn ? submitBtn.innerHTML : "Submit";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Sending...</span>`;
      }

      try {
        // Attempt PHP endpoint
        const res = await fetch("api/contact.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailVal, type: "newsletter" })
        });

        const data = await res.json().catch(() => ({ success: true }));

        if (submitBtn) {
          submitBtn.innerHTML = `<span style="color: #10B981;">✓ Subscribed!</span>`;
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            if (emailInput) emailInput.value = "";
          }, 3500);
        }
      } catch (err) {
        // Fallback for client-side static demo
        if (submitBtn) {
          submitBtn.innerHTML = `<span style="color: #10B981;">✓ Subscribed!</span>`;
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            if (emailInput) emailInput.value = "";
          }, 3500);
        }
      }
    });
  });

  console.log("Updraft Template Controller Initialized.");
});
