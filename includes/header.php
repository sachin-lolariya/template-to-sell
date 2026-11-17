<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DOOMSDAY: Multiverse Countdown & Incursion Watch</title>
  <meta name="description" content="Live real-time countdown to Marvel Studios' Avengers: Doomsday (Dec 18, 2026). Interactive multiversal roster, Latverian command console, and Secret Wars battle tracker.">
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
  
  <!-- CSS Stylesheets -->
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/animations.css">

  <!-- GSAP 3 & Plugins (CDN) -->
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
</head>
<body>
  <!-- Ambient Aurora Canvas Background -->
  <canvas id="ambient-canvas"></canvas>

  <!-- Navigation -->
  <nav class="site-nav">
    <div class="container">
      <a href="#hero" class="brand-logo">
        <img src="assets/doom-crest.svg" alt="Doctor Doom Crest" class="brand-icon">
        <span class="brand-text">DOOMSDAY<span>WATCH</span></span>
      </a>

      <ul class="nav-links">
        <li><a href="#countdown" class="active">Countdown</a></li>
        <li><a href="#roster">Multiverse Roster</a></li>
        <li><a href="#terminal">TVA Terminal</a></li>
        <li><a href="#reel">Milestones</a></li>
        <li><a href="#generator">Badge Creator</a></li>
        <li><a href="#faq">Intel FAQ</a></li>
      </ul>

      <div class="nav-actions">
        <button id="sound-toggle" class="sound-btn" title="Toggle Cinematic Ambient Audio">
          <span>🔈</span> Sound: OFF
        </button>
      </div>
    </div>
  </nav>
