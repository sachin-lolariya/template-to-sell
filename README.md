# DOOMSDAY WATCH: Avengers Multiverse Countdown Portal

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/sachin-lolariya/avengers-doomsday-countdown)

A high-performance cinematic fan countdown portal and multiversal intelligence tracker for Marvel Studios' **Avengers: Doomsday** (December 18, 2026) and **Avengers: Secret Wars** (December 17, 2027).

---

## ⚡ Live Deployment
* **Live Netlify Portal**: [https://avengers-doomsday-countdown-pmk3.netlify.app](https://avengers-doomsday-countdown-pmk3.netlify.app)
* **GitHub Repository**: [https://github.com/sachin-lolariya/avengers-doomsday-countdown](https://github.com/sachin-lolariya/avengers-doomsday-countdown)

---

## 🚀 Key Features & Motion Systems

1. **Live Synchronized Dual Countdown Engine**:
   * Millisecond-accurate UTC timer tracking days, hours, minutes, and seconds until *Avengers: Doomsday* (December 18, 2026).
   * Secondary horizon countdown tracking *Avengers: Secret Wars* (December 17, 2027).
   * Number-shift GSAP micro-animations on every ticking second.

2. **Modulify-Inspired Motion & Design**:
   * **Aurora Ambient Fog**: Custom canvas-rendered particle nebula in Doctor Doom's signature emerald green (`#10b981`) and incursion violet.
   * **Cardwall Multiverse Roster**: Interactive 3D tilt character cards with instant category filtering and FLIP-animated intelligence dossier modals.
   * **Console Defense Terminal**: Operable retro CRT phosphor terminal with scanlines, live command prompt (`help`, `doom`, `timeline`, `secretwars`, `incursion`), and quick-uplink chips.
   * **Cinema Reel Roadmap**: Horizontal snap carousel highlighting the timeline from *The Fantastic Four: First Steps* (2025) to *Secret Wars* (2027).

3. **Interactive Fan Utilities**:
   * **"Will Return" Badge Generator**: Real-time customizer rendering personalized MCU end-credit cards with one-click clipboard copying.
   * **Web Audio Synthesizer**: Built-in cinematic atmospheric drone generator running directly via the Web Audio API without bulky or copyrighted external sound files.
   * **Incursion Alerts**: Newsletter subscription with immediate validation and feedback.

4. **Tech Stack**:
   * **Frontend**: Semantic HTML5, Modular CSS3 (Design Tokens), Modern JavaScript (ES6+).
   * **Animations**: GreenSock GSAP 3.12.5 + ScrollTrigger.
   * **Backend**: PHP 8.x (`index.php`, `api/countdown.php`, `api/subscribe.php`).
   * **Design Standards**: Governed by [DESIGN.md](./DESIGN.md) (`awesome-design-md`).

---

## 🛠️ Local Development

### Option A: Static Server (HTML/CSS/JS)
You can open `index.html` directly in any browser or run a lightweight local static server:
```bash
npx serve .
# or
python -m http.server 8000
```

### Option B: PHP Server (Dynamic PHP Architecture)
To test the PHP modular templates and REST API endpoints:
```bash
php -S localhost:8000
```
Open `http://localhost:8000` to view the PHP application.

---

## ⚖️ Legal & Fair Use Disclaimer
This is an independent, non-profit fan tribute website created strictly for countdown tracking, cultural commentary, and fan discussion under the Fair Use doctrine (17 U.S.C. § 107). It is **not** endorsed by, affiliated with, or sponsored by Marvel Studios, The Walt Disney Company, or any of their subsidiaries. All character names and MCU references remain the property of their respective trademark holders.
