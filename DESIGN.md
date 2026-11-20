# Aether Atelier // Design System & Visual Tokens

A commercial-grade, luxury editorial design system built for high-conversion creative agencies, social architecture ateliers, and category-defining brand studios. Designed in strict compliance with `/awesome-design-md` and `/design-taste-frontend`.

---

## 1. Brand Identity & Philosophy
- **Brand Name**: AETHER ATELIER
- **Tagline**: High-Conversion Social Architecture & Creative Direction
- **Positioning**: Built for category leaders, high-growth consumer brands, and modern tech founders who demand cultural velocity without corporate slop.
- **Copyright & License**: 100% original intellectual property, ready for commercial sale on Webflow, Framer, and ThemeForest.

---

## 2. Color Tokens & Semantic Architecture

| Role | Token Variable | Hex Code | Purpose |
| :--- | :--- | :--- | :--- |
| **Primary Canvas** | `--cream` | `#FAF8F5` | Warm alabaster silk background. Sets editorial warmth. |
| **Surface Paper** | `--paper` | `#FFFFFF` | Pure studio white for elevated cards and message panels. |
| **Secondary Tint** | `--sand` | `#F3EFEA` | Warm cashmere / oat for active states and accent cards. |
| **Deep Obsidian** | `--ink` | `#111215` | High-contrast obsidian charcoal for typography and buttons. |
| **Radiant Vermilion** | `--accent-coral` | `#FF4A1C` | Signature high-energy primary accent for CTAs and highlights. |
| **Electric Citron** | `--accent-citron` | `#D9FE38` | High-voltage neon citron for status badges and live indicators. |
| **Royal Cobalt** | `--accent-cobalt` | `#1E3A8A` | Professional B2B depth for LinkedIn teardowns. |
| **Editorial Stone** | `--stone` | `#68655F` | Balanced neutral for metadata, timestamps, and muted text. |
| **Hairline Border** | `--border-hairline` | `rgba(17,18,21,0.08)` | Ultra-delicate 1px boundary dividing cards and tabs. |

---

## 3. Typography Hierarchy

| Role | Font Family | Weight | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Sans** | `Inter` | 400, 500, 600, 700 | `-0.015em` | Body copy, UI labels, buttons, navigation items. |
| **Editorial Serif** | `Instrument Serif` | 400 (Italic) | `-0.01em` | Expressive italic emphasis in section headings. |
| **Headings** | `Magra` | 700 | `-0.045em` | High-voltage display titles and fluid banners. |
| **Telemetry Mono** | `DM Mono` | 400, 500 | `+0.16em` | Section indices `[01]`, timestamps, format tags. |

---

## 4. Motion & GSAP 3 Physics
- **Easing Profiles**:
  - `ease-expo`: `cubic-bezier(0.16, 1, 0.3, 1)` for snappy, organic UI drawer and pill transitions.
  - `power3.out`: Hero timeline and entrance choreography.
  - `power2.out`: Card hover lifts and interactive tab switches.
- **ScrollTrigger Text Scrub**:
  - Word-by-word scroll-linked illumination in Section `[01] The Editorial` (`.wall-word` transitioning progressively from `opacity: 0.16` to deep obsidian `var(--ink)`).
- **Rule 5 Micro-Interactions**:
  - Card Hover: `transform: translateY(-2px)` with subtle layered shadow bloom.
  - Photo Zoom: `scale: 1.025` strictly confined within `overflow: hidden` frames.
  - Button Mechanics: `active:scale-[0.97]` for tactile physical feedback.

---

## 5. Component Contracts
- **Header**: Centered floating pill with frosted glass backdrop blur (`backdrop-blur-xl bg-paper/80`).
- **Mobile Menu**: Fullscreen drawer utilizing clip-path wipe animation with auto-close mechanics.
- **The Wall**: 3D perspective rotated marquee with hover-pause functionality.
- **Group Chat**: WhatsApp/iMessage-style unedited client testimonial chat with active sender switching.
- **Post Time Machine**: 7-day social content calendar inside an iPhone mockup with industry filter pills.
- **Case Notes Slider**: Smooth horizontal swipe carousel with next/prev buttons and drag-to-scroll physics.
- **Lead Intake**: Asynchronous PHP + Netlify contact pipeline with instant visual checkmark feedback.
