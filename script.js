// ── NAV: hamburger toggle + active link highlight ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Highlight active nav link on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 80;
  sections.forEach(sec => {
    const top    = sec.offsetTop;
    const height = sec.offsetHeight;
    const id     = sec.getAttribute('id');
    const link   = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
}, { passive: true });

// Navbar shadow on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 10
    ? '0 2px 12px rgba(0,0,0,0.35)'
    : 'none';
}, { passive: true });


// ── MODAL ──
const modal      = document.getElementById('applyModal');
const openBtn    = document.getElementById('openModal');
const closeBtn   = document.getElementById('closeModal');

function openModal() {
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

openBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });


// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Stagger siblings slightly
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, Math.min(idx * 60, 300));
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

revealEls.forEach(el => observer.observe(el));


// ── TECH CARD: subtle tilt on hover ──
document.querySelectorAll('.tech-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 6;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 6;
    card.style.transform = `perspective(600px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-3px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


// ── MEMBER CARD: lift on hover (already CSS, but add shadow boost via JS) ──
document.querySelectorAll('.member-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.boxShadow = '3px 3px 0 rgba(13,13,13,0.35)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.boxShadow = '';
  });
});


// ── TIMELINE: animate line drawing on scroll ──
const timelineLine = document.querySelector('.timeline::before');
const timelineEl   = document.querySelector('.timeline');

if (timelineEl) {
  const lineObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        timelineEl.classList.add('line-visible');
        lineObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });
  lineObserver.observe(timelineEl);
}


// ── SMOOTH SCROLL for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 52;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


// ── APPLY BUTTON: ripple effect ──
document.querySelector('.apply-btn').addEventListener('click', function(e) {
  const btn    = this;
  const circle = document.createElement('span');
  const size   = Math.max(btn.offsetWidth, btn.offsetHeight);
  const rect   = btn.getBoundingClientRect();

  circle.style.cssText = `
    position: absolute;
    width: ${size}px; height: ${size}px;
    left: ${e.clientX - rect.left - size / 2}px;
    top: ${e.clientY - rect.top  - size / 2}px;
    background: rgba(255,255,255,0.15);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 0.5s linear;
    pointer-events: none;
  `;

  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = '@keyframes ripple { to { transform: scale(3); opacity: 0; } }';
    document.head.appendChild(style);
  }

  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.appendChild(circle);
  setTimeout(() => circle.remove(), 500);
});
