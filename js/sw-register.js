// Registers the service worker. Loaded on every page (see the <script>
// tag added near the closing </body> of each .html file).
//
// The path './service-worker.js' vs '../service-worker.js' differs
// between the root index.html and files inside pages/, same as every
// other relative path in this project — each HTML file passes in the
// correct relative path via a data attribute so this one script works
// unmodified on every page.

// document.currentScript is only reliable while this file is first
// executing synchronously, so it's captured here — NOT inside the
// 'load' callback below, where it would already be null.
const thisScript = document.currentScript;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swPath = (thisScript && thisScript.dataset.swPath) || './service-worker.js';

    navigator.serviceWorker.register(swPath).catch((err) => {
      // Registration failing (e.g. running on a plain http:// server
      // without a domain, or an unsupported browser) shouldn't break the
      // rest of the app — it just means no offline support this time.
      console.warn('Service worker registration failed:', err);
    });
  });
}
