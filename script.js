// ── CURSOR
const cur = document.getElementById('cur');
document.addEventListener('mousemove', e => {
  cur.style.left = e.clientX + 'px';
  cur.style.top  = e.clientY + 'px';
});
document.querySelectorAll('a,button,.m-card,.r-card,.pill,.tl-content,.g-item').forEach(el => {
  el.addEventListener('mouseenter', () => cur.classList.add('big'));
  el.addEventListener('mouseleave', () => cur.classList.remove('big'));
});

// ── PAGE SWITCHING
let busy = false;
function show(id) {
  if (busy) return;
  const cur2 = document.querySelector('.page.active');
  const next = document.getElementById('p-' + id);
  if (!next || cur2 === next) return;
  busy = true;
  cur2.classList.add('out');
  setTimeout(() => {
    cur2.classList.remove('active','out','in');
    next.scrollTop = 0;
    next.classList.add('active');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      next.classList.add('in');
      busy = false;
    }));
  }, 220);
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  document.querySelectorAll(`.nav-links a[data-p="${id}"]`).forEach(a => a.classList.add('active'));
  history.replaceState(null,'','#'+id);
  document.querySelector('.nav-links').classList.remove('open');
}

document.querySelector('.page.active').classList.add('in');

document.querySelectorAll('.nav-links a[data-p]').forEach(a =>
  a.addEventListener('click', e => { e.preventDefault(); show(a.dataset.p); }));
document.querySelectorAll('[data-p]').forEach(el => {
  if (!el.closest('.nav-links'))
    el.addEventListener('click', e => { e.preventDefault(); show(el.dataset.p); });
});
document.getElementById('logo-btn')?.addEventListener('click', () => show('home'));

const h = location.hash.replace('#','');
if (['about','goals','timeline','team','contact'].includes(h)) show(h);

// hamburger
document.getElementById('ham').addEventListener('click', () =>
  document.querySelector('.nav-links').classList.toggle('open'));

// modal
const modal = document.getElementById('modal');
document.getElementById('open-modal')?.addEventListener('click', () => {
  modal.style.display = 'block'; document.body.style.overflow = 'hidden';
});
document.getElementById('close-modal').addEventListener('click', () => {
  modal.style.display = 'none'; document.body.style.overflow = '';
});
window.addEventListener('click', e => {
  if (e.target === modal) { modal.style.display = 'none'; document.body.style.overflow = ''; }
});

// ticker clone for infinite loop
const ti = document.querySelector('.ticker-inner');
if (ti) ti.innerHTML += ti.innerHTML;
