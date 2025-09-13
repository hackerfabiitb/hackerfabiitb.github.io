// Page transition handler: intercept internal link clicks and animate overlay + page hide/show
document.addEventListener('DOMContentLoaded', function(){
  const links = Array.from(document.querySelectorAll('a[href]')).filter(a=>a.getAttribute('href').match(/\.html$/) || a.getAttribute('href').startsWith('#'));
  const overlay = document.getElementById('overlay');
  function navigateTo(href){
    document.body.classList.add('progress-enter');
    setTimeout(()=>{
      window.location.href = href;
    }, 420);
  }
  links.forEach(a=>{
    a.addEventListener('click', function(e){
      const href = a.getAttribute('href');
      if(href.startsWith('#')) return;
      e.preventDefault();
      navigateTo(href);
    });
  });
  window.addEventListener('pageshow', ()=>{
    document.body.classList.remove('progress-enter');
  });
});