# DOOMSDAY WATCH: Avengers Countdown Portal

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/sachin-lolariya/avengers-doomsday-countdown)

A high-performance cinematic fan countdown portal and live streaming ambient experience for Marvel Studios' **Avengers: Doomsday** (December 18, 2026).

---

## ⚡ Live Deployment
* **Live Netlify Portal**: [https://avengers-doomsday-countdown-pmk3.netlify.app](https://avengers-doomsday-countdown-pmk3.netlify.app)
* **GitHub Repository**: [https://github.com/sachin-lolariya/avengers-doomsday-countdown](https://github.com/sachin-lolariya/avengers-doomsday-countdown)

---

## 🚀 Key Features & Architecture

1. **Official Streamed Ambient Video Background**:
   * Official YouTube IFrame Player integration streaming the Dolby Cinema Special Look trailer (`IqQ7ApyVdSg`).
   * Seamless mode switching between atmospheric ambient loop (0:00–0:10) and full dramatic climax (1:32–1:50) via the **Watch Live** control.
   * Zero local video/audio binary files stored in the repository, guaranteeing 100% copyright and DMCA compliance under the US Federal Court "Server Test" (*Perfect 10 v. Amazon/Google*).

2. **Accurate 5-Unit Master Countdown Engine**:
   * Millisecond-precise calendar calculation tracking Months, Days, Hours, Minutes, and Seconds until *Avengers: Doomsday* (December 18, 2026, 05:00:00 UTC).
   * GreenSock GSAP 3 number-shift micro-animations on every second tick.

3. **Real-Time Fan Community Chat**:
   * 100% authentic live fan traffic with real-time visitor counter (zero fake bot comments or synthetic intervals).
   * Supported via Node.js server (`server.js`), Netlify serverless functions (`netlify/functions/chat.js`), and PHP API (`api/chat.php`).

4. **Cinematic Design & Responsive Motion**:
   * Tailored single-banner interface matching high-end design token standards (`awesome-design-md` & `gsap-animation`).
   * Dynamic typography sizing using CSS `clamp()` for perfect readability across mobile and 4K displays.

---

## 🛠️ Local Development

### Option A: Node.js Server (Recommended for Full Video & Real Chat)
```bash
node server.js
```
Open `http://localhost:3000` in your browser.

### Option B: PHP Server
```bash
php -S localhost:8000
```
Open `http://localhost:8000` in your browser.

---

## ⚖️ Legal Disclaimer
This is an independent, non-commercial fan tribute and countdown. "Avengers", "Doctor Doom", and all related characters and trademarks are the property of Marvel Characters, Inc. and The Walt Disney Company. This website is not affiliated with, endorsed by, or sponsored by Marvel Studios.
