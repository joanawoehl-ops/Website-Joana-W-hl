(function () {
  var PIXEL_ID   = '2698776853827018';
  var STORAGE_KEY = 'cookie_consent';

  /* ── Pixel laden ─────────────────────────────────────────── */
  function loadPixel() {
    if (window.fbq) return;
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', PIXEL_ID);
    fbq('track', 'PageView');
  }

  /* ── Banner ausblenden ───────────────────────────────────── */
  function dismissBanner(banner) {
    banner.style.transform = 'translateY(100%)';
    banner.style.opacity   = '0';
    setTimeout(function () { if (banner.parentNode) banner.parentNode.removeChild(banner); }, 400);
  }

  /* ── Banner anzeigen ─────────────────────────────────────── */
  function showBanner() {
    var banner  = document.createElement('div');
    banner.id   = 'cookie-consent-banner';

    /* Stil */
    banner.setAttribute('style', [
      'position:fixed',
      'bottom:0',
      'left:0',
      'right:0',
      'background:#f2f0e8',
      'border-top:1px solid rgba(58,53,48,0.15)',
      'padding:18px 24px',
      'z-index:99999',
      'box-shadow:0 -4px 24px rgba(58,53,48,0.08)',
      'transition:transform 0.35s ease, opacity 0.35s ease'
    ].join(';'));

    /* Inhalt */
    banner.innerHTML =
      '<div style="max-width:960px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;">' +
        '<p style="margin:0;font-family:\'DM Sans\',system-ui,sans-serif;font-size:14px;font-weight:300;color:#3a3530;line-height:1.65;flex:1;min-width:180px;">' +
          'Diese Website nutzt den <strong style="font-weight:500;">Facebook Pixel</strong>, um Werbeanzeigen zu optimieren. ' +
          'Dabei werden Daten an Meta Platforms Ireland Ltd. übertragen. ' +
          '<a href="/datenschutz.html" style="color:#3a3530;text-decoration:underline;white-space:nowrap;">Mehr erfahren</a>' +
        '</p>' +
        '<div style="display:flex;gap:10px;flex-shrink:0;">' +
          '<button id="cc-decline" style="background:none;border:1px solid rgba(58,53,48,0.35);color:#3a3530;font-family:\'DM Sans\',system-ui,sans-serif;font-size:13px;padding:9px 20px;cursor:pointer;letter-spacing:0.03em;">Ablehnen</button>' +
          '<button id="cc-accept"  style="background:#3a3530;border:1px solid #3a3530;color:#f2f0e8;font-family:\'DM Sans\',system-ui,sans-serif;font-size:13px;padding:9px 20px;cursor:pointer;letter-spacing:0.03em;">Akzeptieren</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(banner);

    document.getElementById('cc-accept').addEventListener('click', function () {
      localStorage.setItem(STORAGE_KEY, 'granted');
      dismissBanner(banner);
      loadPixel();
    });

    document.getElementById('cc-decline').addEventListener('click', function () {
      localStorage.setItem(STORAGE_KEY, 'denied');
      dismissBanner(banner);
    });
  }

  /* ── Initialisierung ─────────────────────────────────────── */
  var consent = localStorage.getItem(STORAGE_KEY);

  if (consent === 'granted') {
    loadPixel();
  } else if (!consent) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }
  /* consent === 'denied' → nichts tun */

})();
