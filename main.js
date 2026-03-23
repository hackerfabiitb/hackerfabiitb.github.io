/* ─────────────────────────────────────────────
   HackerFab IITB · main.js
   ───────────────────────────────────────────── */

'use strict';

/* ══ 1. CURSOR ══════════════════════════════ */
const cursor = document.getElementById('cursor');
let mx = 0,
    my = 0,
    cx = 0,
    cy = 0;
let raf;

document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
});
document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));

(function trackCursor() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    cursor.style.transform = `translate(calc(${cx}px - 50%), calc(${cy}px - 50%))`;
    requestAnimationFrame(trackCursor);
})();

function addHover(sel) {
    document.querySelectorAll(sel).forEach((el) => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}
addHover(
    'a, button, .nav-logo, .member-card, .pillar, .tbl-row, .growth-row, .tl-item, .req-row, .s-link, .copyable, .hstat'
);

/* ══ 2. LIVE NAV CLOCK ══════════════════════ */
const navClock = document.getElementById('nav-clock');
function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    navClock.textContent = `IST ${h}:${m}:${s}`;
}
updateClock();
setInterval(updateClock, 1000);

/* ══ 3. PAGE TRANSITIONS (wipe) ════════════ */
const wipe = document.getElementById('page-wipe');
let busy = false;

function goTo(id) {
    if (busy) return;
    const cur = document.querySelector('.page.active');
    const nxt = document.getElementById('page-' + id);
    if (!nxt || cur === nxt) return;

    busy = true;

    // Wipe in
    wipe.classList.remove('wipe-out');
    wipe.classList.add('wipe-in');

    setTimeout(() => {
        cur.classList.remove('active', 'visible');
        nxt.scrollTop = 0;
        nxt.classList.add('active');

        // Wipe out
        wipe.classList.remove('wipe-in');
        wipe.classList.add('wipe-out');

        requestAnimationFrame(() =>
            requestAnimationFrame(() => {
                nxt.classList.add('visible');
                busy = false;
                triggerReveals();
                updateActiveLink(id);
                history.replaceState(null, '', '#' + id);
                document.getElementById('navLinks').classList.remove('open');
                document.getElementById('hamburger').classList.remove('open');
            })
        );
    }, 360);
}

function updateActiveLink(id) {
    document.querySelectorAll('.nav-link').forEach((a) => a.classList.remove('active'));
    document.querySelectorAll(`.nav-link[data-page="${id}"]`).forEach((a) => a.classList.add('active'));
}

// Initial visible state
document.querySelector('.page.active').classList.add('visible');

// Wire nav links
document.querySelectorAll('[data-page]').forEach((el) => {
    el.addEventListener('click', (e) => {
        e.preventDefault();
        goTo(el.dataset.page);
    });
});

// Logo
document.getElementById('navLogoBtn').addEventListener('click', () => goTo('home'));
document.getElementById('navLogoBtn').setAttribute('data-tooltip', 'back to home');

// Hash routing
const initHash = location.hash.slice(1);
if (['about', 'goals', 'timeline', 'team', 'contact'].includes(initHash)) goTo(initHash);

/* ══ 4. HAMBURGER ═══════════════════════════ */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
});

/* ══ 5. MODAL ═══════════════════════════════ */
const modal = document.getElementById('applyModal');

function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

document.getElementById('openModal').addEventListener('click', openModal);
document.getElementById('closeModal').addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

/* ══ 6. SCROLL REVEAL ═══════════════════════ */
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.06 }
);

function triggerReveals() {
    document.querySelectorAll('.page.active .reveal:not(.in)').forEach((el) => {
        revealObserver.observe(el);
    });
    // Also fire timeline line
    if (document.getElementById('page-timeline')?.classList.contains('active')) {
        animateTimelineLine();
    }
}
triggerReveals();

/* ══ 7. TIMELINE LINE FILL ══════════════════ */
function animateTimelineLine() {
    const fill = document.getElementById('tlLineFill');
    if (!fill) return;
    setTimeout(() => {
        fill.style.height = '100%';
    }, 200);
}

/* ══ 8. TOAST ═══════════════════════════════ */
const toast = document.getElementById('toast');
let toastTimer;

function showToast(msg, duration = 2200) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
}

/* ══ 9. COPY EMAIL ══════════════════════════ */
document.querySelectorAll('.copyable').forEach((el) => {
    el.addEventListener('click', () => {
        const text = el.dataset.copy;
        navigator.clipboard.writeText(text).then(() => {
            const hint = el.querySelector('.copy-hint');
            if (hint) {
                hint.textContent = 'copied!';
                hint.classList.add('copied');
                setTimeout(() => {
                    hint.textContent = 'copy';
                    hint.classList.remove('copied');
                }, 2000);
            }
            showToast('email copied to clipboard');
        });
    });
});

/* ══ 10. KONAMI CODE → terminal easter egg ══ */
const KONAMI = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
];
let konamiIdx = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === KONAMI[konamiIdx]) {
        konamiIdx++;
        if (konamiIdx === KONAMI.length) {
            konamiIdx = 0;
            spawnTerminal();
        }
    } else {
        konamiIdx = e.key === KONAMI[0] ? 1 : 0;
    }
});

/* ══ 11. TERMINAL ════════════════════════════ */
const TERMINAL_CMDS = {
    help: () => [
        { cls: 'ok', text: 'Available commands:' },
        { cls: 'out', text: '  about      — who we are' },
        { cls: 'out', text: '  status     — lab status' },
        { cls: 'out', text: '  litho      — lithography progress' },
        { cls: 'out', text: '  motto      — our motto' },
        { cls: 'out', text: '  tsmc       — forbidden thought' },
        { cls: 'out', text: '  join       — how to join' },
        { cls: 'out', text: '  clear      — clear terminal' },
        { cls: 'out', text: '  exit       — close terminal' },
    ],
    about: () => [
        { cls: '', text: 'HackerFab IITB — est. Aug 2025' },
        { cls: 'out', text: "India's first student-built chip fab." },
        { cls: 'out', text: 'Part of the global HackerFab network.' },
        { cls: 'out', text: '11 core members · 4 faculty advisors' },
    ],
    status: () => [
        { cls: 'ok', text: '[OK] Lab: active' },
        { cls: 'ok', text: '[OK] Litho v1: 1µm feature size achieved' },
        { cls: 'ok', text: '[OK] Spin coater: 6000 rpm stable' },
        { cls: 'out', text: '[--] RF Sputterer: planned' },
        { cls: 'out', text: '[--] Tube furnace: planned' },
    ],
    litho: () => [
        { cls: '', text: 'Maskless Lithography — Litho v1' },
        { cls: 'out', text: 'Feature size : 1µm' },
        { cls: 'out', text: 'Method       : maskless DLP projection' },
        { cls: 'out', text: 'Status       : IN PROGRESS' },
        { cls: 'ok', text: 'First patterns captured Dec 2025.' },
    ],
    motto: () => [
        { cls: 'ok', text: '"Making hands-on chip fabrication' },
        { cls: 'ok', text: ' accessible across India."' },
    ],
    tsmc: () => [
        { cls: 'err', text: 'ACCESS DENIED' },
        { cls: 'out', text: 'Why should TSMC have all the fun?' },
        { cls: 'ok', text: 'Build it yourself. — HackerFab' },
    ],
    join: () => [
        { cls: '', text: 'To join HackerFab IITB:' },
        { cls: 'out', text: '  1. Be an IITB student' },
        { cls: 'out', text: '  2. Email hackerfabiitb@gmail.com' },
        { cls: 'out', text: '  3. Subject: Recruitment — [Your Name]' },
        { cls: 'out', text: '  4. Max 1000 words' },
        { cls: 'ok', text: 'Or join Discord for non-IITB folks.' },
    ],
    clear: () => '__clear__',
    exit: () => '__exit__',
};

function spawnTerminal() {
    const egg = document.getElementById('terminal-egg');
    egg.classList.remove('hidden');
    setTimeout(() => egg.classList.add('visible'), 10);
    const input = document.getElementById('terminal-input');
    const body = document.getElementById('terminal-body');

    printLines([
        { cls: 'ok', text: 'HackerFab Terminal v1.0' },
        { cls: 'out', text: 'Type "help" to get started.' },
    ]);
    input.focus();

    function printLines(lines) {
        lines.forEach((l) => {
            const span = document.createElement('span');
            span.className = 't-line ' + (l.cls || '');
            span.textContent = l.text;
            body.appendChild(span);
        });
        body.scrollTop = body.scrollHeight;
    }

    input.onkeydown = (e) => {
        if (e.key !== 'Enter') return;
        const cmd = input.value.trim().toLowerCase();
        input.value = '';

        // Echo
        const echo = document.createElement('span');
        echo.className = 't-line';
        echo.textContent = `fab@iitb:~$ ${cmd}`;
        body.appendChild(echo);

        if (!cmd) return;

        const fn = TERMINAL_CMDS[cmd];
        if (!fn) {
            printLines([{ cls: 'err', text: `command not found: ${cmd}` }]);
            return;
        }
        const result = fn();
        if (result === '__clear__') {
            body.innerHTML = '';
            return;
        }
        if (result === '__exit__') {
            closeTerminal();
            return;
        }
        printLines(result);
    };
}

function closeTerminal() {
    const egg = document.getElementById('terminal-egg');
    egg.classList.remove('visible');
    setTimeout(() => egg.classList.add('hidden'), 280);
}

document.getElementById('termClose').addEventListener('click', closeTerminal);

/* ══ 12. LOGO TRIPLE-CLICK EASTER EGG ═══════ */
let logoClicks = 0,
    logoTimer;
document.getElementById('navLogoBtn').addEventListener('click', () => {
    logoClicks++;
    clearTimeout(logoTimer);
    logoTimer = setTimeout(() => {
        logoClicks = 0;
    }, 600);
    if (logoClicks === 3) {
        logoClicks = 0;
        showToast('🔬 why should TSMC have all the fun?');
    }
});

/* ══ 13. TEAM MEMBER: random chip fact ══════ */
const chipFacts = [
    'A modern CPU has ~50 billion transistors.',
    "TSMC's 2nm node debuts in 2025.",
    'The first IC was made in 1958 by Kilby.',
    'Silicon is the 2nd most abundant element on Earth.',
    'A human hair is ~70,000 nm wide. We do 1,000 nm.',
    'Photolithography uses UV light to pattern circuits.',
    'Spin coating was invented in the 1950s.',
    "Moore's Law: transistors double every ~2 years.",
    'The first microprocessor: Intel 4004, 1971.',
    'IITB + students + open source = this lab.',
];
document.querySelectorAll('.member-card').forEach((card) => {
    card.addEventListener('dblclick', () => {
        const fact = chipFacts[Math.floor(Math.random() * chipFacts.length)];
        showToast(fact, 3000);
    });
});

/* ══ 14. STAT HOVER TOOLTIP ════════════════ */
const statTooltips = {
    '1µm': 'our lithography resolution',
    '50+': 'discord community members',
    4: 'tools being designed',
    open: 'all our work is open source',
};
document.querySelectorAll('.hstat').forEach((s) => {
    const num = s.querySelector('.hstat-n').textContent.trim();
    s.addEventListener('mouseenter', () => {
        if (statTooltips[num]) showToast(statTooltips[num], 1800);
    });
});

/* ══ 15. TABLE ROW HOVER SHINE ══════════════ */
document.querySelectorAll('.tbl-row').forEach((row) => {
    row.addEventListener('mousemove', (e) => {
        const rect = row.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        row.style.background = `linear-gradient(90deg, transparent ${x - 20}%, rgba(17,17,16,0.03) ${x}%, transparent ${x + 20}%)`;
    });
    row.addEventListener('mouseleave', () => {
        row.style.background = '';
    });
});

/* ══ 16. KONAMI HINT IN CONSOLE ════════════ */
console.log(
    '%c HackerFab IITB ',
    'background:#111110;color:#fafaf8;font-size:14px;font-family:monospace;padding:4px 8px;'
);
console.log(
    '%c Try the Konami code on the home page. ↑↑↓↓←→←→BA',
    'color:#999992;font-family:monospace;font-size:11px;'
);
console.log(
    '%c Also: triple-click the logo. Double-click a team member.',
    'color:#999992;font-family:monospace;font-size:11px;'
);

/* ══ 17. PAGE KEYBOARD SHORTCUTS ════════════ */
const shortcuts = { 1: 'home', 2: 'about', 3: 'goals', 4: 'timeline', 5: 'team', 6: 'contact' };
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    if (shortcuts[e.key]) goTo(shortcuts[e.key]);
});
