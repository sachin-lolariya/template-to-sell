  <!-- Multiverse Roster (Modulify Cardwall inspired) -->
  <section id="roster" class="roster-section">
    <div class="container">
      <div class="section-head">
        <div class="section-tag">Multiverse Defense Registry</div>
        <h2 class="section-title">Champions vs. The Monarch</h2>
        <div class="roster-filter">
          <button class="filter-btn active" data-filter="all">All Intelligence</button>
          <button class="filter-btn" data-filter="doom">Latverian Order</button>
          <button class="filter-btn" data-filter="champions">Earth's Defenders</button>
          <button class="filter-btn" data-filter="multiverse">Multiverse Nexus</button>
        </div>
      </div>

      <!-- Cardwall Grid -->
      <div id="roster-grid" class="roster-grid">
        <!-- Rendered dynamically by js/main.js -->
      </div>
    </div>
  </section>

  <!-- Interactive Dossier Modal -->
  <div id="dossier-modal" class="dossier-modal">
    <div class="dossier-content">
      <button id="close-modal" class="close-modal-btn">&times;</button>
      <div id="modal-status" class="card-status-badge">Status</div>
      <h3 id="modal-name" class="card-name" style="font-size: 2rem; margin-top: 0.5rem;">Character Name</h3>
      <p id="modal-actor" class="card-actor" style="font-size: 1rem; margin-bottom: 1.25rem;">Actor</p>
      <p id="modal-desc" class="card-desc" style="color: var(--text-main); font-size: 1.05rem; margin-bottom: 1rem;">Description</p>
      <div id="modal-details" style="background: var(--bg-surface-2); padding: 1rem; border-radius: var(--radius-sm); border-left: 3px solid var(--doom-primary); font-size: 0.9rem; color: var(--text-muted);">
        Detailed intel...
      </div>
    </div>
  </div>
