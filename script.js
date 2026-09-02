/* ==========================================================================
   FC HLINSKO / script.js
   Vanilla JS, bez závislostí.
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     ROZPIS ZÁPASŮ, JEDINÉ MÍSTO, KDE SE ZÁPASY UPRAVUJÍ
     ------------------------------------------------------------------------
     Přidejte nový zápas na konec pole, web ho sám seřadí podle data
     a vykreslí na stránce Zápasy.

     datum:  'RRRR-MM-DDTHH:MM'  (24h, místní čas)
     domaci: true = hrajeme doma
     souper: název soupeře
     tym:    'A' | 'B' | 'dorost' | 'zaci' | 'pripravky'
     typ:    'liga' | 'pohar' | 'priprava'
     skore:  null dokud se nehraje, po zápase např. '3:1'
     ---------------------------------------------------------------------- */
  var ZAPASY = [
    { datum: '2026-07-11T10:00', domaci: false, souper: 'Čáslav',          tym: 'A', typ: 'priprava', misto: 'Hřiště Chotusice',              skore: null },
    { datum: '2026-07-15T18:00', domaci: true,  souper: 'Žďár n/S.',       tym: 'A', typ: 'priprava', misto: 'Olšinky, hřiště č. 2',          skore: null },
    { datum: '2026-07-18T10:30', domaci: false, souper: 'Ždírec n/D.',     tym: 'A', typ: 'priprava', misto: 'Ždírec nad Doubravou',          skore: null },
    { datum: '2026-07-22T18:00', domaci: true,  souper: 'Chotěboř',        tym: 'A', typ: 'priprava', misto: 'Olšinky, hřiště č. 1',          skore: null },
    { datum: '2026-07-25T10:30', domaci: true,  souper: 'Ústí n/O.',       tym: 'A', typ: 'priprava', misto: 'Olšinky, hřiště č. 1',          skore: null },
    { datum: '2026-07-29T18:00', domaci: true,  souper: 'Velká Bíteš',     tym: 'A', typ: 'priprava', misto: 'Olšinky, hřiště č. 1',          skore: null },
    { datum: '2026-08-01T17:00', domaci: false, souper: 'Heřmanův Městec', tym: 'A', typ: 'pohar',    misto: 'Heřmanův Městec, předkolo MOL Cup', skore: null },
    { datum: '2026-08-08T10:30', domaci: true,  souper: 'Kolín',           tym: 'A', typ: 'liga',     misto: 'Olšinky, hřiště č. 1',          skore: null }
  ];

  var TYP_NAZEV = { liga: 'Mistrovské utkání', pohar: 'MOL Cup', priprava: 'Přípravné utkání' };
  var MESICE = ['led', 'úno', 'bře', 'dub', 'kvě', 'čvn', 'čvc', 'srp', 'zář', 'říj', 'lis', 'pro'];

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
  }

  function parseDatum(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(s);
    if (!m) return new Date(s);
    return new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], 0, 0);
  }

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /* ------------------------------------------------------------------------
     1. HLAVIČKA A TLAČÍTKO NAHORU
     ---------------------------------------------------------------------- */
  function initHeader() {
    var head = $('.site-head');
    var toTop = $('.to-top');
    if (!head && !toTop) return;

    var tick = false;
    function onScroll() {
      if (tick) return;
      tick = true;
      window.requestAnimationFrame(function () {
        var y = window.pageYOffset;
        if (head) head.classList.toggle('is-stuck', y > 30);
        if (toTop) toTop.classList.toggle('is-on', y > 640);
        tick = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (toTop) {
      toTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    }
  }

  /* ------------------------------------------------------------------------
     2. MOBILNÍ MENU
     ---------------------------------------------------------------------- */
  function initDrawer() {
    var burger = $('.burger');
    var drawer = $('.drawer');
    var scrim = $('.scrim');
    var closeBtn = $('.drawer__close');
    if (!burger || !drawer) return;

    var lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
      drawer.classList.add('is-open');
      if (scrim) scrim.classList.add('is-on');
      burger.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      drawer.removeAttribute('aria-hidden');
      document.body.classList.add('is-locked');
      var first = drawer.querySelector('a, button');
      if (first) first.focus();
    }

    function close() {
      drawer.classList.remove('is-open');
      if (scrim) scrim.classList.remove('is-on');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
      if (lastFocus) lastFocus.focus();
    }

    burger.addEventListener('click', function () {
      drawer.classList.contains('is-open') ? close() : open();
    });
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (scrim) scrim.addEventListener('click', close);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) close();
    });

    $$('.dnav a', drawer).forEach(function (a) { a.addEventListener('click', close); });

    $$('.dnav__toggle', drawer).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var sub = btn.parentElement.parentElement.querySelector('.dnav__sub');
        if (!sub) return;
        var isOpen = sub.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    });

    drawer.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = $$('a[href], button:not([disabled]), input, select, textarea', drawer)
        .filter(function (el) { return el.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* ------------------------------------------------------------------------
     3. AKTIVNÍ POLOŽKA NAVIGACE
     ---------------------------------------------------------------------- */
  function initActiveNav() {
    var here = location.pathname.split('/').pop() || 'index.html';
    $$('.menu__link[href], .dnav__link[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#' || href.indexOf('http') === 0) return;
      var file = href.split('#')[0].split('/').pop() || 'index.html';
      if (file === here) {
        a.classList.add('is-active');
        a.setAttribute('aria-current', 'page');
      }
    });
  }

  /* ------------------------------------------------------------------------
     4. ODHALOVÁNÍ PŘI SCROLLU
     ---------------------------------------------------------------------- */
  function initReveal() {
    var items = $$('.reveal');
    if (!items.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------------
     5. ROZPIS ZÁPASŮ
     ---------------------------------------------------------------------- */
  function initFixtureList() {
    var host = $('#fixture-list');
    if (!host) return;

    function render(filtr) {
      var now = Date.now();
      var data = ZAPASY.slice().sort(function (a, b) {
        return parseDatum(a.datum) - parseDatum(b.datum);
      });

      if (filtr && filtr !== 'vse') {
        data = data.filter(function (z) { return z.typ === filtr || z.tym === filtr; });
      }

      if (!data.length) {
        host.innerHTML = '<p class="sec-lead">Pro tento výběr zatím nemáme žádné zápasy.</p>';
        return;
      }

      host.innerHTML = data.map(function (z) {
        var d = parseDatum(z.datum);
        var odehrano = d.getTime() < now;

        var cls = ['fixture'];
        if (z.domaci) cls.push('is-home');
        if (z.typ === 'pohar') cls.push('is-cup');
        if (odehrano) cls.push('is-done');

        var domaciTym = z.domaci ? 'FC Hlinsko' : z.souper;
        var hosteTym = z.domaci ? z.souper : 'FC Hlinsko';
        var zvyrazni = function (n) {
          return n === 'FC Hlinsko' ? '<b>' + esc(n) + '</b>' : esc(n);
        };

        var badge = z.typ === 'pohar'
          ? '<span class="fixture__badge fixture__badge--cup">Pohár</span>'
          : (z.domaci ? '<span class="fixture__badge fixture__badge--home">Doma</span>'
                      : '<span class="fixture__badge">Venku</span>');

        var pravy = z.skore
          ? '<div class="fixture__time">' + esc(z.skore) + '</div>' + badge
          : '<div class="fixture__time">' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + '</div>' + badge;

        return '<article class="' + cls.join(' ') + '">' +
          '<div class="fixture__date">' +
            '<span class="fixture__day">' + d.getDate() + '.</span>' +
            '<span class="fixture__mon">' + MESICE[d.getMonth()] + ' ' + d.getFullYear() + '</span>' +
          '</div>' +
          '<div class="fixture__main">' +
            '<div class="fixture__teams">' + zvyrazni(domaciTym) + '<i>vs</i>' + zvyrazni(hosteTym) + '</div>' +
            '<div class="fixture__info">' +
              '<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>' + esc(TYP_NAZEV[z.typ] || '') + '</span>' +
              '<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' + esc(z.misto) + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="fixture__right">' + pravy + '</div>' +
        '</article>';
      }).join('');
    }

    render('vse');

    $$('[data-filter]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        $$('[data-filter]').forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');
        render(btn.getAttribute('data-filter'));
      });
    });
  }

  /* ------------------------------------------------------------------------
     6. MARQUEE PARTNERŮ
     ---------------------------------------------------------------------- */
  function initMarquee() {
    $$('.marquee__track').forEach(function (track) {
      if (track.dataset.cloned === '1') return;
      track.innerHTML += track.innerHTML;
      track.dataset.cloned = '1';
    });
  }

  /* ------------------------------------------------------------------------
     7. FORMULÁŘE
     ---------------------------------------------------------------------- */
  function initForms() {
    $$('form[data-mailto]').forEach(function (form) {
      var note = form.querySelector('.form__note');

      function setErr(field, on, msg) {
        var wrap = field.closest('.field');
        if (!wrap) return;
        wrap.classList.toggle('has-error', on);
        var err = wrap.querySelector('.field__err');
        if (err && msg) err.textContent = msg;
        field.setAttribute('aria-invalid', on ? 'true' : 'false');
      }

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var ok = true;
        var prvni = null;

        $$('[required]', form).forEach(function (f) {
          var val = (f.type === 'checkbox') ? f.checked : f.value.trim();
          var bad = !val;
          if (!bad && f.type === 'email') {
            bad = !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(f.value.trim());
          }
          setErr(f, bad, f.type === 'email' ? 'Zadejte platný e-mail.' : 'Toto pole je povinné.');
          if (bad) { ok = false; if (!prvni) prvni = f; }
        });

        if (!ok) {
          if (note) { note.className = 'form__note is-bad'; note.textContent = 'Zkontrolujte prosím zvýrazněná pole.'; }
          if (prvni) prvni.focus();
          return;
        }

        var to = form.getAttribute('data-mailto');
        var predmet = form.getAttribute('data-subject') || 'Zpráva z webu FC Hlinsko';
        var radky = [];

        $$('input, select, textarea', form).forEach(function (f) {
          if (f.type === 'checkbox' || !f.name) return;
          var lab = form.querySelector('label[for="' + f.id + '"]');
          var popis = lab ? lab.textContent.replace('*', '').trim() : f.name;
          radky.push(popis + ': ' + f.value.trim());
        });

        window.location.href = 'mailto:' + to +
          '?subject=' + encodeURIComponent(predmet) +
          '&body=' + encodeURIComponent(radky.join('\n') + '\n\nOdesláno z webu fchlinsko.cz');

        if (note) {
          note.className = 'form__note is-ok';
          note.textContent = 'Otevíráme váš e-mailový klient s předvyplněnou zprávou. Pokud se nic nestalo, napište nám přímo na ' + to + '.';
        }
      });

      $$('[required]', form).forEach(function (f) {
        f.addEventListener('input', function () {
          var wrap = f.closest('.field');
          if (wrap && wrap.classList.contains('has-error')) setErr(f, false);
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     8. LIGHTBOX PRO FOTKY MUŽSTEV
     ---------------------------------------------------------------------- */
  function initLightbox() {
    var spousteci = $$('.teamphoto[data-full]');
    if (!spousteci.length) return;

    var box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Fotografie mužstva');
    box.innerHTML =
      '<button class="lightbox__close" type="button" aria-label="Zavřít fotografii">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
      '</button>' +
      '<div><img class="lightbox__img" alt=""><p class="lightbox__cap"></p></div>';
    document.body.appendChild(box);

    var img = box.querySelector('.lightbox__img');
    var cap = box.querySelector('.lightbox__cap');
    var zavrit = box.querySelector('.lightbox__close');
    var posledni = null;

    function otevri(el) {
      posledni = el;
      img.src = el.getAttribute('data-full');
      img.alt = el.getAttribute('data-popis') || '';
      cap.textContent = el.getAttribute('data-popis') || '';
      box.classList.add('is-on');
      document.body.classList.add('is-locked');
      zavrit.focus();
    }

    function zavri() {
      box.classList.remove('is-on');
      document.body.classList.remove('is-locked');
      if (posledni) posledni.focus();
    }

    spousteci.forEach(function (el) {
      el.addEventListener('click', function (e) { e.preventDefault(); otevri(el); });
    });

    zavrit.addEventListener('click', zavri);
    box.addEventListener('click', function (e) { if (e.target === box) zavri(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && box.classList.contains('is-on')) zavri();
    });
  }

  /* ------------------------------------------------------------------------
     9. TABULKA SOUTĚŽE, VOLITELNÁ
     ------------------------------------------------------------------------
     Zůstane-li pole prázdné, blok s tabulkou se vůbec nezobrazí a na stránce
     je jen odkaz na Fotbal.cz. Chcete-li pořadí zobrazit přímo na webu,
     doplňte řádky podle tabulky na Fotbal.cz, například:

       { poradi: 1, tym: 'FC Hlinsko', z: 6, v: 4, r: 1, p: 1, skore: '12:6', b: 13 },

     Nezapomeňte pak aktualizovat i datum v TABULKA_AKTUALIZOVANO.
     ---------------------------------------------------------------------- */
  var TABULKA = [];
  var TABULKA_AKTUALIZOVANO = '';

  function initTable() {
    var host = $('#tabulka-a');
    if (!host) return;

    if (!TABULKA.length) { host.remove(); return; }

    var radky = TABULKA.map(function (t) {
      var nas = t.tym === 'FC Hlinsko';
      return '<tr' + (nas ? ' class="is-us"' : '') + '>' +
        '<td>' + esc(t.poradi) + '.</td>' +
        '<td class="t-name">' + esc(t.tym) + '</td>' +
        '<td>' + esc(t.z) + '</td>' +
        '<td>' + esc(t.v) + '</td>' +
        '<td>' + esc(t.r) + '</td>' +
        '<td>' + esc(t.p) + '</td>' +
        '<td>' + esc(t.skore) + '</td>' +
        '<td><strong>' + esc(t.b) + '</strong></td>' +
      '</tr>';
    }).join('');

    host.innerHTML =
      '<div class="table-wrap">' +
        '<table class="tbl">' +
          (TABULKA_AKTUALIZOVANO ? '<caption>Průběžné pořadí k ' + esc(TABULKA_AKTUALIZOVANO) + '</caption>' : '') +
          '<thead><tr>' +
            '<th scope="col">#</th><th scope="col">Tým</th><th scope="col">Z</th>' +
            '<th scope="col">V</th><th scope="col">R</th><th scope="col">P</th>' +
            '<th scope="col">Skóre</th><th scope="col">B</th>' +
          '</tr></thead>' +
          '<tbody>' + radky + '</tbody>' +
        '</table>' +
      '</div>';
  }

  /* ------------------------------------------------------------------------
     10. ROK V PATIČCE
     ---------------------------------------------------------------------- */
  function initYear() {
    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  function boot() {
    initHeader();
    initDrawer();
    initActiveNav();
    initReveal();
    initFixtureList();
    initMarquee();
    initForms();
    initLightbox();
    initTable();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
