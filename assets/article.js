/* Artikler: lesefremdrift, aktiv seksjon i innholdsfortegnelsen, animasjon av hero-illustrasjon, filter i artikkeloversikten. */
(function(){
  var IO='IntersectionObserver' in window;
  /* lesefremdrift (kun på artikler med .prose) */
  var pr=document.querySelector('.rprog'),body=document.querySelector('.artbody');
  if(pr&&body){var tick=false;function upd(){tick=false;var r=body.getBoundingClientRect(),h=r.height-innerHeight*.6,p=Math.min(1,Math.max(0,-r.top/(h>0?h:1)));pr.style.transform='scaleX('+p+')';}
    addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(upd);}},{passive:true});upd();}
  /* aktiv seksjon */
  var links=[].slice.call(document.querySelectorAll('.toc a'));
  if(links.length&&IO){var map={};links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a;});
    var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.remove('on');});var a=map[e.target.id];if(a)a.classList.add('on');}});},{rootMargin:'-20% 0px -70% 0px'});
    Object.keys(map).forEach(function(id){var h=document.getElementById(id);if(h)io.observe(h);});}
  /* illustrasjon i hero */
  var v=document.querySelector('.ahv');
  if(v){if(IO){new IntersectionObserver(function(en,o){if(en[0].isIntersecting){v.classList.add('in');o.disconnect();}},{threshold:.25}).observe(v);}else v.classList.add('in');}
  /* lukk mobil-innholdsfortegnelse ved klikk */
  var tm=document.querySelector('.tocm');if(tm)tm.addEventListener('click',function(e){if(e.target.tagName==='A')tm.open=false;});
  /* filter i artikkeloversikten */
  var fb=[].slice.call(document.querySelectorAll('.ax-filter button')),cards=[].slice.call(document.querySelectorAll('.ax-card[data-cat]'));
  fb.forEach(function(b){b.addEventListener('click',function(){var c=b.getAttribute('data-cat');fb.forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});
    cards.forEach(function(k){k.hidden=!(c==='alle'||k.getAttribute('data-cat')===c);});});});
})();
