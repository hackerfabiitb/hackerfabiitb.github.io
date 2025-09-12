// Simple mobile nav toggle
function toggleNav(){
  const nav = document.getElementById('navlinks');
  if(!nav) return;
  nav.style.display = (nav.style.display === 'flex') ? 'none' : 'flex';
}