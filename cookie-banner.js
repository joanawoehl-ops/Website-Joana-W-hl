/* =====================================================
   COOKIE BANNER – Joana Wöhl
   Kein Tracking · Kein Analytics · Nur Hinweis
   ===================================================== */
(function () {
  'use strict';

  var STORAGE_KEY = 'jw_cookie_notice';

  if (localStorage.getItem(STORAGE_KEY)) return;

  var banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Cookie-Hinweis');
  banner.innerHTML =
    '<p>Diese Website verwendet keine Tracking- oder Analyse-Cookies. ' +
    'Technisch notwendige Browser-Funktionen werden ausschließlich für die Darstellung der Seite genutzt. ' +
    '<a href="datenschutz.html">Mehr erfahren</a></p>' +
    '<button id="cookie-accept" aria-label="Hinweis schließen">Verstanden</button>';
  document.body.appendChild(banner);

  // Animate in
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      banner.classList.add('cookie-banner--visible');
    });
  });

  document.getElementById('cookie-accept').addEventListener('click', function () {
    banner.classList.remove('cookie-banner--visible');
    banner.addEventListener('transitionend', function () {
      banner.remove();
    }, { once: true });
    localStorage.setItem(STORAGE_KEY, '1');
  });
})();
