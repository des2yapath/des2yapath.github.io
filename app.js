const root = document.documentElement;
const panels = [...document.querySelectorAll('.detail-panel[data-panel]')];
const templates = new Map([...document.querySelectorAll('template[data-screen]')].map(t => [t.dataset.screen, t]));
const sheet = document.querySelector('#phone-sheet');
const phone = document.querySelector('.phone');
const homeScreen = document.querySelector('#phone-home-screen');
const sheetBody = document.querySelector('#phone-sheet-body');
const back = document.querySelector('#phone-back');
const sheetTitle = document.querySelector('#phone-sheet-title');
const themeToggle = document.querySelector('#theme-toggle');

let selected = 'overview';
let invoker = null;

// Dynamic year in footer
const yearEl = document.querySelector('#year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Live status bar clock on phone
function updateClock() {
  const el = document.querySelector('#phone-clock');
  if (!el) return;
  const now = new Date();
  const h = now.getHours() % 12 || 12;
  const m = String(now.getMinutes()).padStart(2, '0');
  el.textContent = `${h}:${m}`;
}
updateClock();
setInterval(updateClock, 30000);

// Theme handling
let savedTheme;
try { 
  savedTheme = localStorage.getItem('theme'); 
} catch { 
  /* Storage is optional */ 
}

function setTheme(theme) {
  root.dataset.theme = theme;
  const label = `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`;
  themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
  themeToggle.setAttribute('aria-label', label);
  themeToggle.title = label;
}

setTheme(['light', 'dark'].includes(savedTheme) ? savedTheme :
  (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

themeToggle.addEventListener('click', () => {
  const current = root.dataset.theme === 'dark' ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  try { 
    localStorage.setItem('theme', next); 
  } catch { 
    /* Preference remains for this session */ 
  }
});

// Panel Reveal & Routing
function reveal(key, { source = null, updateHash = false, focus = false } = {}) {
  if (!panels.some(panel => panel.dataset.panel === key)) return;

  const leavingSheet = selected !== 'overview' && key === 'overview';
  if (key !== 'overview' && source?.isConnected && !sheet.contains(source)) {
    invoker = source;
  }
  selected = key;

  panels.forEach(panel => {
    panel.hidden = panel.dataset.panel !== key;
  });

  homeScreen.hidden = key !== 'overview';
  sheet.hidden = key === 'overview';
  phone.classList.toggle('is-open', key !== 'overview');
  sheetBody.replaceChildren();
  sheetBody.scrollTop = 0;

  if (key !== 'overview') {
    const tmpl = templates.get(key);
    if (tmpl) {
      sheetBody.append(tmpl.content.cloneNode(true));
      const titleEl = sheetBody.querySelector('.screen-title');
      if (titleEl) {
        sheetTitle.textContent = titleEl.textContent.trim();
      }
    }
  }

  document.querySelectorAll('.app-launcher[data-open]').forEach(link => {
    if (link.dataset.open === key) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  if (updateHash) {
    history.replaceState(null, '', `#${key === 'overview' ? 'home' : key}`);
  }

  if (focus) {
    if (leavingSheet) {
      if (invoker?.isConnected && !invoker.closest('[hidden]')) {
        invoker.focus();
      } else {
        document.querySelector('.brand')?.focus();
      }
    } else if (key !== 'overview') {
      back.focus();
    }
  }
}

// Global click handling for internal data-open links
document.addEventListener('click', event => {
  const link = event.target.closest('a[data-open]');
  if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || (link.target && link.target !== '_self')) {
    return;
  }
  const key = link.dataset.open;
  if (!panels.some(panel => panel.dataset.panel === key)) return;
  event.preventDefault();
  reveal(key, { source: link, updateHash: true, focus: true });
});

back.addEventListener('click', () => reveal('overview', { updateHash: true, focus: true }));
document.querySelector('#phone-home').addEventListener('click', () => reveal('overview', { updateHash: true, focus: true }));

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && selected !== 'overview') {
    event.preventDefault();
    reveal('overview', { updateHash: true, focus: true });
  }
});

window.addEventListener('hashchange', () => {
  const hash = location.hash.slice(1);
  reveal(hash === 'home' || !hash ? 'overview' : hash);
});

// Clipboard action for email
const copyEmail = document.querySelector('#copy-email');
if (copyEmail) {
  copyEmail.addEventListener('click', async () => {
    const status = document.querySelector('#copy-status');
    try {
      await navigator.clipboard.writeText(copyEmail.dataset.email);
      if (status) status.textContent = 'Email copied to clipboard.';
    } catch {
      if (status) status.textContent = 'Could not copy. Please use the email link directly.';
    }
  });
}

// Initialize
root.classList.add('js');
const initialHash = location.hash.slice(1);
reveal(initialHash === 'home' || !initialHash ? 'overview' :
  (panels.some(panel => panel.dataset.panel === initialHash) ? initialHash : 'overview'));
