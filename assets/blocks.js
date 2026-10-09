/* Forside-blokker på undersider: reveal, annonsevegg, kundechat, uke/bento-animasjon og totrinns leadskjema.
   Kilde: forsidens inline-skript (index.html). Lead går til samme Make-webhook som før (6202084),
   lead_source = arcads-<sti> (EN: arcads-en-<sti>), redirect til /takk/ eller /en/takk/ der konverteringen fyres. */
(function(){
  var IO='IntersectionObserver' in window, EN=location.pathname.indexOf('/en/')===0;
  var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* reveal: forsidens .rv/.stg og undersidenes .reveal */
  var els=document.querySelectorAll('.hb .rv,.hb .stg,.reveal');
  if(IO){var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px'});els.forEach(function(e){io.observe(e);});}
  else els.forEach(function(e){e.classList.add('in');});

  /* annonsevegg */
  function fill(id,list){var el=document.getElementById(id);if(!el)return;var h='';list.concat(list).forEach(function(n){h+='<img src="/img/wall/'+n+'.webp" alt="" width="480" height="600" loading="lazy">';});el.innerHTML=h;}
  fill('mq1',['bg-1','ur-2','mokki-5','leid-4','bg-4','ur-5','mokki-1','bg-2','ur-3','marlow-1','mokki-3','leid-1']);
  fill('mq2',['ur-6','bg-5','mokki-7','leid-2','ur-4','mokki-6','bg-6','ur-1','mokki-4','bg-3','leid-3','mokki-2']);

  /* spill animasjoner bare når synlig */
  function toggle(el,cls,th,once){if(!el)return;if(!IO){el.classList.add(cls);return;}new IntersectionObserver(function(en,o){en.forEach(function(e){if(once){if(e.isIntersecting){el.classList.add(cls);o.disconnect();}}else el.classList.toggle(cls,e.isIntersecting);});},{threshold:th}).observe(el);}
  var pp=document.querySelector('.hb .people');if(pp){pp.classList.add('mv');toggle(pp,'play',.2);}
  toggle(document.querySelector('.hb .table'),'tgo',.25,true);
  toggle(document.getElementById('altbento'),'play',.15);
  toggle(document.getElementById('wk3'),'play',.2);

  /* kundechat */
  var w=document.getElementById('kundechat');
  if(w&&IO){var ms=[].slice.call(w.querySelectorAll('.cm'));w.classList.add('chat-live');
    var cio=new IntersectionObserver(function(en){if(!en[0].isIntersecting)return;cio.disconnect();
      if(rm){ms.forEach(function(m){m.classList.add('in');});return;}
      var i=0;(function next(){if(i>=ms.length)return;var m=ms[i++];m.classList.add('typing');setTimeout(function(){m.classList.remove('typing');m.classList.add('in');setTimeout(next,120);},i===1?300:260);})();
    },{threshold:.12});cio.observe(w);}

  /* totrinns leadskjema */
  var f=document.getElementById('leadForm');if(!f||!f.querySelector('[data-step]'))return;
  var HOOK='https://hook.eu1.make.com/ftpj27p6hovtjk94x4hzt16yc6i9oroi';
  var SRC='arcads-'+location.pathname.replace(/\//g,'-').replace(/^-|-$/g,'');
  var btn=document.getElementById('leadBtn'),sent=false;
  var T=EN?{step:'Step ',of:' of 2',site:'Enter your website, for example company.com',bud:'Pick roughly how much you spend on ads.',chk:'Check the highlighted fields.',sending:'Sending...',again:'Send me the proposal',fail:'Something went wrong. Try again, or email victor@arcads.no'}
         :{step:'Steg ',of:' av 2',site:'Skriv inn nettsiden, for eksempel bedriften.no',bud:'Velg omtrent hvor mye dere bruker på annonser.',chk:'Sjekk feltene som er markert.',sending:'Sender...',again:'Send meg forslaget',fail:'Noe gikk galt. Prøv igjen, eller send en mail til victor@arcads.no'};
  var st1=f.querySelector('[data-step="1"]'),st2=f.querySelector('[data-step="2"]'),e1=document.getElementById('lfErr1'),e2=document.getElementById('lfErr2');
  function ok(){location.href=EN?'/en/takk/':'/takk/';}
  function go(n){st1.classList.toggle('on',n===1);st2.classList.toggle('on',n===2);document.getElementById('lfStepTxt').textContent=T.step+n+T.of;document.getElementById('lfBar').style.transform='scaleX('+(n/2)+')';if(window.innerWidth>640)(n===1?f.website:f.name).focus();}
  function bad(el,on){el.classList.toggle('bad',on);}
  var url=function(v){return /\.[a-z]{2,}/i.test(v);};
  document.getElementById('lfNext').addEventListener('click',function(){
    var v=f.website.value.trim(),b=f.querySelector('input[name=budget]:checked');
    bad(f.website,!url(v));
    if(!url(v)){e1.textContent=T.site;f.website.focus();return;}
    if(!b){e1.textContent=T.bud;return;}
    e1.textContent='';go(2);
  });
  f.website.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();document.getElementById('lfNext').click();}});
  document.getElementById('lfBack').addEventListener('click',function(){go(1);});
  f.addEventListener('submit',function(ev){
    ev.preventDefault();if(sent)return;
    if(st1.classList.contains('on')){document.getElementById('lfNext').click();return;}
    if(f.company.value){sent=true;ok();return;}
    var nm=f.name.value.trim(),em=f.email.value.trim(),ph=f.phone.value.replace(/\s/g,''),emOk=/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(em),phOk=ph.replace(/\D/g,'').length>=8,ms=f.comment?f.comment.value.trim():'x',msOk=ms.length>=3;
    bad(f.name,!nm);bad(f.email,!emOk);bad(f.phone,!phOk);if(f.comment)bad(f.comment,!msOk);
    if(!nm||!emOk||!phOk||!msOk){e2.textContent=T.chk;return;}
    e2.textContent='';
    var bv=(f.querySelector('input[name=budget]:checked')||{}).value||'';
    sent=true;btn.disabled=true;btn.querySelector('.lbl').textContent=T.sending;
    var p=new URLSearchParams({subject:'Nytt lead - Arcads LP',lead_source:SRC,name:nm,email:em,phone:f.phone.value.trim(),website:f.website.value.trim(),budget:bv,comment:f.comment?ms:'',page_url:location.href,user_agent:navigator.userAgent,_ts:Date.now()});
    try{if(navigator.sendBeacon&&navigator.sendBeacon(HOOK,p)){ok();return;}}catch(e){}
    fetch(HOOK,{method:'POST',mode:'no-cors',keepalive:true,headers:{'Content-Type':'application/x-www-form-urlencoded'},body:p.toString()})
      .then(ok,function(){sent=false;btn.disabled=false;btn.querySelector('.lbl').textContent=T.again;alert(T.fail);});
  });
  [f.name,f.email,f.phone,f.website,f.comment].forEach(function(i){if(i)i.addEventListener('input',function(){i.classList.remove('bad');});});
})();
