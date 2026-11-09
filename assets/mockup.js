(function () {
  var KEY = 'welfares.mock.session';
  var HOME = { admin: 'admin-dashboard.html', org: 'org-dashboard.html', member: 'member-dashboard.html' };

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function session() {
    try { return JSON.parse(sessionStorage.getItem(KEY)); } catch (err) { return null; }
  }
  function startSession(role, name) {
    var clean = name && name.trim() ? name.trim() : 'Demo user';
    var initials = clean.split(/\s+/).slice(0, 2).map(function (p) { return p.charAt(0); }).join('').toUpperCase();
    sessionStorage.setItem(KEY, JSON.stringify({ role: role, name: clean, initials: initials }));
  }

  // Toasts
  var toastEl = $('#toast');
  var timer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(function () { toastEl.classList.remove('show'); }, 2600);
  }

  // Login gate for portal pages
  var portal = document.body.getAttribute('data-portal');
  if (portal) {
    var s = session();
    if (!s || s.role !== portal) {
      var page = location.pathname.split('/').pop() || 'index.html';
      location.replace('signin.html?portal=' + portal + '&next=' + encodeURIComponent(page));
      return;
    }
    $$('[data-user-name]').forEach(function (el) { el.textContent = s.name; });
    $$('[data-avatar]').forEach(function (el) { el.textContent = s.initials; });
    document.body.classList.add('ok');
  }

  // Public header reflects an existing session
  var s2 = session();
  $$('[data-signin-link]').forEach(function (el) {
    if (s2) {
      el.textContent = 'Open my portal';
      el.setAttribute('href', HOME[s2.role]);
    }
  });

  // Sign-out
  $$('[data-signout]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      sessionStorage.removeItem(KEY);
      location.href = 'index.html';
    });
  });

  // Placeholder links
  $$('a[href="#"]').forEach(function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); });
  });

  // Modals
  function openModal(id) {
    var m = document.getElementById(id);
    if (m) m.classList.add('open');
  }
  function closeModals() {
    $$('.backdrop.open').forEach(function (m) { m.classList.remove('open'); });
  }
  $$('[data-open]').forEach(function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); openModal(el.getAttribute('data-open')); });
  });
  $$('.backdrop').forEach(function (m) {
    m.addEventListener('click', function (e) { if (e.target === m) closeModal(m); });
  });
  $$('[data-close]').forEach(function (el) {
    el.addEventListener('click', function () { closeModal(el.closest('.backdrop')); });
  });
  function closeModal(m) { if (m) m.classList.remove('open'); }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModals(); });

  // Generic toast triggers
  $$('[data-toast]').forEach(function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); toast(el.getAttribute('data-toast')); });
  });

  // Row actions (approve/reject/remind etc.) — optionally remove the row
  $$('[data-row-action]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      toast(el.getAttribute('data-row-action'));
      if (el.hasAttribute('data-remove')) {
        var tr = el.closest('tr');
        if (tr) tr.remove();
      }
    });
  });

  // Table filters
  $$('input[data-filter]').forEach(function (input) {
    input.addEventListener('input', function () {
      var table = document.getElementById(input.getAttribute('data-filter'));
      if (!table) return;
      var q = input.value.toLowerCase();
      $$('tbody tr', table).forEach(function (tr) {
        tr.style.display = tr.textContent.toLowerCase().indexOf(q) > -1 ? '' : 'none';
      });
    });
  });

  // Switches
  $$('.switch').forEach(function (sw) {
    sw.addEventListener('click', function () {
      sw.classList.toggle('on');
      toast('Preference saved (mockup).');
    });
  });

  // Quick role buttons on sign-in
  $$('[data-quick-role]').forEach(function (el) {
    el.addEventListener('click', function () {
      var role = el.getAttribute('data-quick-role');
      startSession(role, el.getAttribute('data-name') || 'Demo user');
      var params = new URLSearchParams(location.search);
      location.href = params.get('next') && params.get('portal') === role ? params.get('next') : HOME[role];
    });
  });

  // Sign-in form
  var signin = $('form[data-signin]');
  if (signin) {
    var params = new URLSearchParams(location.search);
    var select = signin.querySelector('select[name=portal]');
    if (select && params.get('portal')) select.value = params.get('portal');
    signin.addEventListener('submit', function (e) {
      e.preventDefault();
      var role = select.value;
      var name = signin.querySelector('input[name=email]').value.split('@')[0].replace(/[._-]+/g, ' ');
      startSession(role, name.replace(/\b\w/g, function (c) { return c.toUpperCase(); }));
      var next = params.get('next');
      location.href = next && params.get('portal') === role ? next : HOME[role];
    });
  }

  // Mockup forms: show success, close modal, optional navigation
  $$('form[data-success]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      toast(form.getAttribute('data-success'));
      var modal = form.closest('.backdrop');
      if (modal) closeModal(modal);
      var go = form.getAttribute('data-go');
      if (go) location.href = go; else form.reset();
    });
  });

  // Mobile menu
  var menu = $('#menuBtn');
  if (menu) menu.addEventListener('click', function () { $('#sidebar').classList.toggle('open'); });
})();
