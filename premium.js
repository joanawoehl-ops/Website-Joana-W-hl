/* =====================================================
   PREMIUM.JS — Joana Wöhl Premium Interactions
   Vanilla JS · No framework · prefers-reduced-motion safe
   ===================================================== */

(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 1. HERO HEADLINE LINE STAGGER ---- */
  if (!reducedMotion) {
    document.querySelectorAll('.hero-headline, .page-hero-title').forEach(function (el) {
      // Split at <br> tags, wrap each segment in animated span
      var parts = el.innerHTML.split(/<br\s*\/?>/i);
      if (parts.length < 2) return; // only stagger if multiple lines
      el.innerHTML = parts.map(function (part, i) {
        return '<span class="hero-line" style="--line-i:' + i + '">' + part + '</span>';
      }).join('<br>');
      el.classList.add('stagger-ready');
    });
  }

  /* ---- 2. ENHANCED SCROLL REVEAL (rootMargin tweak) ---- */
  // Replaces the basic inline observer with a smoother one
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { obs.observe(el); });
  }

  /* ---- 3. NAV COMPACT ON SCROLL ---- */
  var nav = document.getElementById('mainNav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  /* ---- 4. CURSOR GLOW ON INTERACTIVE ELEMENTS ---- */
  // Adds a subtle glow to buttons on hover — pure CSS handles the visual,
  // JS just adds/removes a class for the cursor state (already in each page)
  // This adds the "btn-hover-glow" effect
  document.querySelectorAll('.btn-primary, .btn-secondary, .form-submit, .nav-cta').forEach(function (btn) {
    btn.addEventListener('mouseenter', function () {
      this.style.setProperty('--glow-opacity', '1');
    });
    btn.addEventListener('mouseleave', function () {
      this.style.setProperty('--glow-opacity', '0');
    });
  });

  /* ---- 5. SMOOTH SECTION ENTRANCE — stagger children ---- */
  // After a section becomes visible, stagger its direct .reveal children
  // if they haven't been individually staggered yet
  if (!reducedMotion && 'IntersectionObserver' in window) {
    var sectionObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var items = e.target.querySelectorAll('.reveal:not(.visible)');
        items.forEach(function (item, i) {
          // Only auto-stagger if no explicit delay is already set
          if (!item.classList.contains('reveal-delay-1') &&
              !item.classList.contains('reveal-delay-2') &&
              !item.classList.contains('reveal-delay-3')) {
            item.style.transitionDelay = (i * 0.06) + 's';
          }
        });
        sectionObs.unobserve(e.target);
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.layers-grid, .inside-grid, .coaching-features-grid, .rezepte-grid, .philosophy-grid').forEach(function (grid) {
      sectionObs.observe(grid);
    });
  }

  /* ---- 6. HORIZONTAL RULES between sections ---- */
  // Adds subtle section rules between major content sections automatically
  if (!reducedMotion) {
    document.querySelectorAll('.testimonials-section + .about-section, .about-section + .explore-section').forEach(function (el) {
      var rule = document.createElement('hr');
      rule.className = 'section-rule';
      el.parentNode.insertBefore(rule, el);
    });
  }

  /* ---- 7. BREVO — Kontakt zur Mailingliste hinzufügen ---- */
  var BREVO_FORM_URL = 'https://611fc40e.sibforms.com/serve/MUIFAOMI_2-6ZKNYGi5U-jWF5G4jEWIIE3MXZ82uWcBwsV5exwpImyWyzdwXQZC139GsaIB2obfto0VWa9CjDu1dmhdv3jpnNdyAYkwpZhXRujaqY-pVBIkEjf1VO6GhqKUQai-jU-XNP0y6WSwyJV0OsO0KltF0YrEhWmCJ6XJYHebtUzuRdCmhSpWRDXUHe8CjdbbksI5NRdFrqA==';

  function addToBrevo(email, firstname) {
    var data = new URLSearchParams();
    data.append('EMAIL', email);
    data.append('FIRSTNAME', firstname);
    data.append('email_address_check', '');
    data.append('locale', 'de');
    fetch(BREVO_FORM_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: data.toString(),
      mode: 'no-cors'
    }).catch(function() {});
  }

  /* ---- 8. WEB3FORMS — Formular-Handling ---- */
  var forms = [
    { formId: 'waitlistForm',   successId: 'formSuccess',     brevo: true  },
    { formId: 'newsletterForm', successId: 'formSuccess',     brevo: true  },
    { formId: 'coachingForm',   successId: 'coachingSuccess', brevo: false }
  ];

  forms.forEach(function(cfg) {
    var form = document.getElementById(cfg.formId);
    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      var btn = form.querySelector('[type="submit"]');
      var originalText = btn.innerHTML;
      btn.innerHTML = 'Wird gesendet…';
      btn.disabled = true;

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: new FormData(form)
      })
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data.success) {
          // Brevo: Kontakt in Mailingliste eintragen
          if (cfg.brevo) {
            var emailVal = form.querySelector('[name="email"]').value;
            var nameVal  = (form.querySelector('[name="firstname"]') || {}).value || '';
            addToBrevo(emailVal, nameVal);
          }
          // Erfolgsanzeige
          form.style.display = 'none';
          var success = document.getElementById(cfg.successId);
          if (success) {
            success.style.display = 'block';
            success.style.opacity  = '0';
            success.style.transform = 'translateY(16px)';
            setTimeout(function() {
              success.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
              success.style.opacity   = '1';
              success.style.transform = 'translateY(0)';
            }, 30);
          }
        } else {
          btn.innerHTML = originalText;
          btn.disabled  = false;
          alert('Etwas hat nicht geklappt. Bitte versuche es erneut.');
        }
      })
      .catch(function() {
        btn.innerHTML = originalText;
        btn.disabled  = false;
        alert('Netzwerkfehler. Bitte überprüfe deine Verbindung und versuche es erneut.');
      });
    });
  });

})();
