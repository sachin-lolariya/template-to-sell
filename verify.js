const fs = require('fs');
const path = require('path');

console.log('=== STEP 5 AUDIT: DESIGN FINISH GATE & CODE REVIEW ===\n');

// 1. Audit js/main.js
try {
  const jsContent = fs.readFileSync('js/main.js', 'utf8');
  // Check for common bugs or undeclared calls
  console.log('JS Size:', (jsContent.length / 1024).toFixed(1), 'KB');
  const consoleErrors = (jsContent.match(/console\.(error|warn)/g) || []).length;
  console.log('Explicit console.error/warn in js/main.js:', consoleErrors);
  console.log('[PASS] JavaScript file present and readable.');
} catch (e) {
  console.error('[FAIL] Reading js/main.js:', e.message);
}

// 2. Audit index.html
try {
  const html = fs.readFileSync('index.html', 'utf8');
  console.log('HTML Size:', (html.length / 1024).toFixed(1), 'KB');

  // Check doctype and lang
  const hasDoctype = /<!DOCTYPE html>/i.test(html);
  const hasLang = /<html[^>]+lang=["'][a-z]{2}["']/i.test(html);
  console.log('Doctype present:', hasDoctype ? '[PASS]' : '[FAIL]');
  console.log('HTML lang attribute present:', hasLang ? '[PASS]' : '[FAIL]');

  // Check images for alt attribute
  const imgTags = html.match(/<img[^>]+>/gi) || [];
  let missingAlt = 0;
  imgTags.forEach(img => {
    if (!/alt\s*=/i.test(img)) missingAlt++;
  });
  console.log(`Images checked: ${imgTags.length} | Missing alt: ${missingAlt} ${missingAlt === 0 ? '[PASS]' : '[WARN]'}`);

  // Check links for href strictly with word boundary
  const linkTags = [...html.matchAll(/<a\b([^>]*)>/gi)];
  let emptyHrefs = 0;
  linkTags.forEach(([full, attrs]) => {
    const match = attrs.match(/href\s*=\s*["']([^"']*)["']/i);
    if (!match || match[1].trim() === '') {
      emptyHrefs++;
      console.log('Empty href anchor detected:', full.slice(0, 100));
    }
  });
  console.log(`Anchor links checked: ${linkTags.length} | Empty hrefs: ${emptyHrefs} ${emptyHrefs === 0 ? '[PASS]' : '[WARN]'}`);

  // Check buttons for accessible text or aria-label
  const buttonTags = [...html.matchAll(/<button([^>]*)>([\s\S]*?)<\/button>/gi)];
  let unlabelledButtons = 0;
  buttonTags.forEach(([full, attrs, inner]) => {
    const hasAria = /aria-label\s*=/i.test(attrs);
    const hasTitle = /title\s*=/i.test(attrs);
    const cleanInner = inner.replace(/<[^>]+>/g, '').trim();
    if (!hasAria && !hasTitle && cleanInner.length === 0) {
      unlabelledButtons++;
      console.log('Unlabelled button detected:', full.slice(0, 100));
    }
  });
  console.log(`Buttons checked: ${buttonTags.length} | Unlabelled: ${unlabelledButtons} ${unlabelledButtons === 0 ? '[PASS]' : '[WARN]'}`);

  // Check form inputs
  const inputs = [...html.matchAll(/<(input|select|textarea)([^>]+)>/gi)];
  let unlabelledInputs = 0;
  inputs.forEach(([full, tag, attrs]) => {
    if (/type\s*=\s*["']hidden["']/i.test(attrs)) return;
    const hasId = /id\s*=/i.test(attrs);
    const hasAria = /aria-label\s*=/i.test(attrs);
    const hasPlaceholder = /placeholder\s*=/i.test(attrs);
    if (!hasId && !hasAria && !hasPlaceholder) {
      unlabelledInputs++;
      console.log('Unlabelled input detected:', full.slice(0, 100));
    }
  });
  console.log(`Inputs checked: ${inputs.length} | Unlabelled: ${unlabelledInputs} ${unlabelledInputs === 0 ? '[PASS]' : '[WARN]'}`);

  // Check Core Web Vitals hints in <head>
  const hasDnsPrefetch = /rel=["']dns-prefetch["']/i.test(html);
  const hasPreload = /rel=["']preload["']/i.test(html);
  const hasDefer = /defer/i.test(html);
  console.log('Performance DNS prefetch:', hasDnsPrefetch ? '[PASS]' : '[WARN]');
  console.log('Performance LCP Preload:', hasPreload ? '[PASS]' : '[WARN]');
  console.log('Performance Deferred Scripts:', hasDefer ? '[PASS]' : '[WARN]');

  // Check Brand integrity
  const hasUpdraft = /updraft/i.test(html);
  console.log('Brand Scrape Check (Updraft present):', hasUpdraft ? '[FAIL]' : '[PASS - 0 occurrences]');

} catch (e) {
  console.error('[FAIL] Reading index.html:', e.message);
}

// 3. Audit css/style.css
try {
  const css = fs.readFileSync('css/style.css', 'utf8');
  console.log('\nCSS Size:', (css.length / 1024).toFixed(1), 'KB');
  const hasReducedMotion = /prefers-reduced-motion/i.test(css);
  console.log('prefers-reduced-motion media query:', hasReducedMotion ? '[PASS]' : '[WARN]');
  const hasFocusVisible = /:focus-visible/i.test(css);
  console.log(':focus-visible accessibility styling:', hasFocusVisible ? '[PASS]' : '[WARN]');
} catch (e) {
  console.error('[FAIL] Reading css/style.css:', e.message);
}

// 4. Audit api/contact.php
try {
  const php = fs.readFileSync('api/contact.php', 'utf8');
  console.log('\nPHP Backend Audit:');
  const hasHoneypot = /website_trap/i.test(php);
  const hasNosniff = /X-Content-Type-Options:\s*nosniff/i.test(php);
  const hasDeny = /X-Frame-Options:\s*DENY/i.test(php);
  const hasSanitize = /filter_var/i.test(php) && /htmlspecialchars/i.test(php);
  console.log('Honeypot Bot Protection:', hasHoneypot ? '[PASS]' : '[FAIL]');
  console.log('Security Headers (nosniff, DENY):', (hasNosniff && hasDeny) ? '[PASS]' : '[FAIL]');
  console.log('Input Sanitization & Validation:', hasSanitize ? '[PASS]' : '[FAIL]');
} catch (e) {
  console.error('[FAIL] Reading api/contact.php:', e.message);
}

console.log('\n=== AUDIT COMPLETE ===');
