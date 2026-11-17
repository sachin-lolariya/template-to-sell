  <!-- Latverian / TVA Command Console (Modulify Console inspired) -->
  <section id="terminal" class="terminal-section">
    <div class="container">
      <div class="section-head">
        <div class="section-tag">Direct Latveria / TVA Uplink</div>
        <h2 class="section-title">Encrypted Defense Console</h2>
      </div>

      <div class="terminal-window crt-screen">
        <div class="terminal-header">
          <div class="terminal-controls">
            <span class="terminal-dot dot-red"></span>
            <span class="terminal-dot dot-yellow"></span>
            <span class="terminal-dot dot-green"></span>
          </div>
          <div class="terminal-title">TERMINAL // LATVERIA-TVA-UPLINK // NODE: 616</div>
          <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--doom-primary);">ONLINE ●</div>
        </div>

        <div id="terminal-output" class="terminal-body">
          <div class="terminal-log">SECURE CONNECTION ESTABLISHED.</div>
          <div class="terminal-log">INCURSION MONITOR ACTIVE. ALL MULTIVERSAL THREADS LOGGED.</div>
          <div class="terminal-log" style="color: var(--text-dim);">Type 'help' to review available intelligence protocols.</div>
        </div>

        <div class="terminal-prompt-line" style="padding: 0 1.5rem 1rem;">
          <span class="terminal-prompt-sym">></span>
          <input type="text" id="terminal-input" class="terminal-input" placeholder="Enter protocol command (e.g., 'doom', 'timeline', 'help')..." autocomplete="off" spellcheck="false">
        </div>

        <div class="terminal-chips">
          <span class="chip-label">Quick Uplink:</span>
          <button class="cmd-chip" data-cmd="doom">DOOM</button>
          <button class="cmd-chip" data-cmd="timeline">TIMELINE</button>
          <button class="cmd-chip" data-cmd="secretwars">SECRET WARS</button>
          <button class="cmd-chip" data-cmd="incursion">INCURSION STATUS</button>
          <button class="cmd-chip" data-cmd="clear">CLEAR</button>
        </div>
      </div>
    </div>
  </section>
