# Aether Atelier // High-Converting Social Architecture & Creative Studio Template

A commercial-grade, luxury website template built for creative studios, social media architecture ateliers, high-growth consumer brands, and modern marketing agencies. Engineered for commercial sale on Webflow, Framer, ThemeForest, and custom headless / WordPress implementations.

---

## ✨ Tech Stack & Features
- **Semantic HTML5**: Clean, SEO-optimized markup with complete ARIA accessible landmarks and zero framework bloat.
- **Fluid CSS3 Design System**: Bespoke luxury palette (Platinum Alabaster `#F8FAFC`, Obsidian Charcoal `#0A0D14`, Electric Royal Cobalt `#2563EB`, High-Voltage Citron `#D9FE38`).
- **Core Web Vitals Engineered**:
  - Sub-resource hints (`dns-prefetch` for Google Fonts & CDNs).
  - Preloaded hero LCP asset (`images/hero/rooftop.jpg` with `fetchpriority="high"` and `loading="eager"`).
  - Deferred script execution (`defer` on GSAP and controller).
  - Explicit aspect ratios on all image containers preventing Cumulative Layout Shift (CLS = 0).
- **GSAP 3 & ScrollTrigger**:
  - The Attention Manifesto word-by-word scroll-linked scrub illumination (`#manifesto`).
  - Smooth section timeline reveals and tactile micro-interactions.
  - 3D card tilt perspective physics (`.card-tilt`) and magnetic cursor gravity (`.magnetic-target`).
  - Interactive Web Audio API ambient soundscape on the flagship campaign card.
- **Interactive Modules**:
  - **Flagship Case Studies** (`#work`): 4 bespoke editorial brand case decks with verified metrics (+340% wholesale inquiries, 1.4M organic views) and expandable campaign telemetry drawers.
  - **The Content Lab & ROI Simulator** (`#the-lab`): Dynamic platform & industry matrix with real-time video simulation and animated audience metrics.
  - **Unedited Group Chat Testimonials** (`#testimonials`): Unfiltered screenshot-style client DM threads with interactive switching across Harriet, Aiko, and Leila.
  - **Audience Performance Telemetry** (`#performance`): High-contrast live data board showcasing 140M+ impressions and verified enterprise value.
  - **Transparent Retainers** (`#pricing`): Predictable tiers with interactive Monthly vs Quarterly (-15%) calculation.
  - **Clarity & Terms FAQ** (`#faq`): Smooth animated accordion addressing IP ownership, turnaround time, and camera direction.
  - **Interactive Scope Builder** (`#contact`): Multi-select project brief with honeypot spam protection and instant feedback.
- **Zero Copyright Risk**: 100% original creative concepts, naming conventions, and layout structures.
- **PHP + Netlify Backend Pipeline**: `api/contact.php` for asynchronous lead persistence with security headers (`X-Content-Type-Options: nosniff`).

---

## ⚡ WordPress Implementation Guide (`agency-wordpress-performance`)

For developers integrating Aether Atelier into a custom WordPress theme:

### 1. Enqueue Scripts & Styles (`functions.php`)
```php
function aether_atelier_scripts() {
    // Enqueue Google Fonts
    wp_enqueue_style('aether-fonts', 'https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700;800;900&family=Magra:wght@400;700&display=swap', array(), null);

    // Enqueue Compiled Design System
    wp_enqueue_style('aether-style', get_template_directory_uri() . '/css/style.css', array(), '1.0.0');

    // Enqueue GSAP 3 & ScrollTrigger in Footer
    wp_enqueue_script('gsap', 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js', array(), '3.12.5', true);
    wp_enqueue_script('gsap-scrolltrigger', 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js', array('gsap'), '3.12.5', true);

    // Main Studio Controller
    wp_enqueue_script('aether-controller', get_template_directory_uri() . '/js/main.js', array('gsap', 'gsap-scrolltrigger'), '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'aether_atelier_scripts');
```

### 2. High-Performance Query & Cache Discipline
- **Avoid Unbounded Queries**: Always bound case study and testimonial queries using `'posts_per_page' => 4` and `'no_found_rows' => true` when pagination is not required.
- **Transients API**: Wrap expensive queries in transients backed by persistent Redis/Memcached object caching:
  ```php
  $case_studies = get_transient('aether_featured_work');
  if (false === $case_studies) {
      $case_studies = new WP_Query([
          'post_type' => 'case_study',
          'posts_per_page' => 4,
          'no_found_rows' => true,
      ]);
      set_transient('aether_featured_work', $case_studies, 12 * HOUR_IN_SECONDS);
  }
  ```
- **LCP Image Preload Hook**:
  ```php
  add_action('wp_head', function() {
      if (is_front_page()) {
          echo '<link rel="preload" as="image" href="' . esc_url(get_template_directory_uri() . '/images/hero/rooftop.jpg') . '" fetchpriority="high">';
      }
  }, 1);
  ```

---

## 🚀 Local Development
```bash
node server.js
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Deployment
Pre-configured for 1-click deployment on **Netlify**, **Vercel**, **GitHub Pages**, or traditional **Apache/Nginx/cPanel** environments.
- Netlify config: [`netlify.toml`](./netlify.toml)
- Design tokens & typography guide: [`DESIGN.md`](./DESIGN.md)
- Generative photography prompts: [`ART_DIRECTION.md`](./ART_DIRECTION.md)
