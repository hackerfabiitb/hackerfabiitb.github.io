// mobile nav toggle
function toggleNav(){
  const nav = document.getElementById('navlinks');
  if(!nav) return;
  nav.classList.toggle('open');
  nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
}