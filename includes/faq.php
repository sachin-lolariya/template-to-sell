  <!-- Interactive Badge Generator -->
  <section id="generator" class="generator-section">
    <div class="container">
      <div class="generator-card">
        <div class="section-tag">End Credits Sequence</div>
        <h2 class="section-title" style="font-size: 2rem;">Custom "Will Return" Creator</h2>
        <p style="color: var(--text-muted); max-width: 500px; margin: 0.5rem auto 1.5rem;">
          Enter your superhero moniker to generate your personal Marvel Studios end-credits title card.
        </p>

        <div class="generator-input-row">
          <input type="text" id="fan-name-input" class="fan-input" placeholder="Enter your name or alias..." maxlength="24">
          <button id="copy-badge-btn" class="btn btn-primary">Copy Badge Text</button>
        </div>

        <div class="badge-preview-screen">
          <div id="preview-fan-name" class="preview-name">YOU</div>
          <div class="preview-phrase">WILL RETURN IN AVENGERS: DOOMSDAY</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Intel FAQ Accordion -->
  <section id="faq" class="faq-section">
    <div class="container">
      <div class="section-head">
        <div class="section-tag">Declassified Briefing</div>
        <h2 class="section-title">Frequently Asked Questions</h2>
      </div>

      <div class="faq-list">
        <div class="faq-item">
          <button class="faq-question">
            <span>When does Avengers: Doomsday officially hit theaters?</span>
            <span class="faq-chevron">▼</span>
          </button>
          <div class="faq-answer">
            <p>
              Avengers: Doomsday is scheduled for global theatrical release on <strong>December 18, 2026</strong>. The live timer at the top of this portal tracks the exact seconds remaining until launch.
            </p>
          </div>
        </div>

        <div class="faq-item">
          <button class="faq-question">
            <span>Who is directing and starring in Avengers: Doomsday?</span>
            <span class="faq-chevron">▼</span>
          </button>
          <div class="faq-answer">
            <p>
              The film is directed by acclaimed MCU veterans <strong>Anthony and Joe Russo</strong> (directors of Infinity War and Endgame), with <strong>Robert Downey Jr.</strong> making a landmark return to star as the titular monarch, <strong>Victor von Doom / Doctor Doom</strong>.
            </p>
          </div>
        </div>

        <div class="faq-item">
          <button class="faq-question">
            <span>What is the difference between Doomsday and Secret Wars?</span>
            <span class="faq-chevron">▼</span>
          </button>
          <div class="faq-answer">
            <p>
              <strong>Avengers: Doomsday (Dec 18, 2026)</strong> centers on the escalating multiversal incursion catastrophe and the ascension of Doctor Doom. <strong>Avengers: Secret Wars (Dec 17, 2027)</strong> is the grand finale of the Multiverse Saga, bringing together heroes across alternate realities onto Battleworld.
            </p>
          </div>
        </div>

        <div class="faq-item">
          <button class="faq-question">
            <span>What are Incursions in the Marvel Cinematic Universe?</span>
            <span class="faq-chevron">▼</span>
          </button>
          <div class="faq-answer">
            <p>
              An incursion occurs when two alternate realities drift and collide at their central nexus points, inevitably threatening the mutual destruction of both universes unless one or both are stabilized.
            </p>
          </div>
        </div>
      </div>

      <!-- Incursion Alerts Form -->
      <div class="alerts-card">
        <h3 class="alerts-title">Join The Incursion Watch</h3>
        <p class="alerts-sub">
          Receive priority intelligence alerts when official trailers, cast confirmations, and ticket presales go live.
        </p>

        <form id="alerts-form" class="alerts-form" action="api/subscribe.php" method="POST">
          <input type="email" id="alert-email" name="email" placeholder="Enter your email address..." required>
          <button type="submit" class="btn btn-primary">Subscribe</button>
        </form>
        <div id="form-feedback" class="form-feedback"></div>
      </div>
    </div>
  </section>
