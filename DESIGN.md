# DESIGN.md - Avengers: Doomsday Fan Experience System

## 1. Vision & Identity
A high-impact cinematic fan countdown portal for Marvel Studios' *Avengers: Doomsday* and *Avengers: Secret Wars*. The interface evokes Doctor Doom's technological supremacy, Latverian gothic-industrial majesty, and the multiversal tension of impending Incursions.

---

## 2. Color Palette Tokens

```css
:root {
  /* Base Surfaces */
  --bg-void: #060709;
  --bg-surface-1: #0d1017;
  --bg-surface-2: #141923;
  --bg-surface-3: #1c2230;

  /* Latverian Emerald (Doctor Doom Core) */
  --doom-primary: #10b981;
  --doom-light: #34d399;
  --doom-dark: #047857;
  --doom-glow: rgba(16, 185, 129, 0.4);
  --doom-subtle: rgba(16, 185, 129, 0.08);

  /* Incursion Crimson (Crisis Indicator) */
  --incursion-red: #ef4444;
  --incursion-glow: rgba(239, 68, 68, 0.35);

  /* Multiverse Violet (Cosmic Energy) */
  --multiverse-violet: #8b5cf6;
  --multiverse-glow: rgba(139, 92, 246, 0.3);

  /* Celestial Gold (Comic & Heritage Accents) */
  --gold-accent: #f59e0b;
  --gold-subtle: rgba(245, 158, 11, 0.12);

  /* Borders & Dividers */
  --border-subtle: rgba(255, 255, 255, 0.07);
  --border-active: rgba(16, 185, 129, 0.35);

  /* Typography Colors */
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --text-dim: #64748b;
}
```

---

## 3. Typography Hierarchy
* **Title / Epic Cinema**: `'Cinzel', serif` (Weights: 700, 900)
* **Body / Clean Interface**: `'Inter', sans-serif` (Weights: 400, 500, 600)
* **Countdown / Latverian Terminal**: `'JetBrains Mono', monospace` (tabular numbers)

---

## 4. Motion Guidelines (GSAP 3)
* **Ticking Digits**: Smooth micro-flip and pulse effect when seconds shift.
* **ScrollTrigger**: Subtle stagger-in for character cards, timeline nodes, and FAQ panels.
* **FLIP Character Cards**: Smooth layout morph when inspecting hero/villain dossiers.
* **Aurora Canvas**: Gentle ambient fluid wave in the hero section evoking Latverian mist.

---

## 5. Copyright Safety & Fair Use
* All vector graphics, logos, and emblems are custom original creations.
* Copywriting is original fan-curated reporting and analysis.
* Prominent Fair Use & Fan Disclaimer under 17 U.S.C. § 107.
