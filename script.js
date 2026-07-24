(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* hero-only starfield, sparse; gentle occasional twinkle + slight scroll drift */
  var sc=document.getElementById('stars'),sx=sc.getContext('2d');
  var SW=0,SH=0,dpr=Math.min(window.devicePixelRatio||1,2),stars=[],scrollY=0;
  function ssize(){
    var r=sc.parentElement.getBoundingClientRect();
    SW=r.width;SH=r.height;
    sc.width=SW*dpr;sc.height=SH*dpr;sx.setTransform(dpr,0,0,dpr,0,0);
    build();
  }
  function build(){
    stars=[];var n=Math.floor(SW*SH/21000);
    for(var i=0;i<n;i++){
      var lively=Math.random()<0.4; // ~40% twinkle noticeably, rest stay calm
      stars.push({
        x:Math.random()*SW,
        y:Math.random()*SH*0.92,
        r:Math.random()*1.1+0.35,
        base:0.16+Math.random()*0.26,
        amp:lively?(0.22+Math.random()*0.28):(0.04+Math.random()*0.06),
        sp:0.5+Math.random()*1.1,           // slow, varied speeds
        ph:Math.random()*Math.PI*2,
        depth:0.25+Math.random()*0.75
      });
    }
  }
  function paint(t){
    sx.clearRect(0,0,SW,SH);
    for(var i=0;i<stars.length;i++){
      var s=stars[i];
      var y=s.y - scrollY*0.08*s.depth;
      if(y<-4||y>SH+4) continue;
      var a=s.base + Math.sin(t*0.001*s.sp + s.ph)*s.amp;
      if(a<0.04)a=0.04; if(a>0.95)a=0.95;
      sx.fillStyle='rgba(233,238,245,'+a+')';
      sx.beginPath();sx.arc(s.x,y,s.r,0,Math.PI*2);sx.fill();
    }
  }
  function staticFrame(){
    sx.clearRect(0,0,SW,SH);
    for(var i=0;i<stars.length;i++){var s=stars[i];sx.fillStyle='rgba(233,238,245,'+s.base+')';sx.beginPath();sx.arc(s.x,s.y,s.r,0,Math.PI*2);sx.fill();}
  }
  window.addEventListener('scroll',function(){scrollY=window.scrollY;},{passive:true});
  window.addEventListener('resize',function(){ssize();if(reduce)staticFrame();});

  /* occasional shooting star */
  var shoot=null,nextShoot=0;
  function spawnShoot(){
    var fromLeft=Math.random()<0.5;
    shoot={
      x:fromLeft?SW*(0.05+Math.random()*0.3):SW*(0.65+Math.random()*0.3),
      y:SH*(0.05+Math.random()*0.35),
      vx:(fromLeft?1:-1)*(4.2+Math.random()*2.2),
      vy:(1.6+Math.random()*1.2),
      life:0,max:60+Math.random()*30
    };
  }
  function drawShoot(){
    if(!shoot)return;
    shoot.life++;
    shoot.x+=shoot.vx;shoot.y+=shoot.vy;
    var p=shoot.life/shoot.max;
    var alpha=(p<0.15?p/0.15:(1-p))*0.9; if(alpha<0)alpha=0;
    var tx=shoot.x-shoot.vx*7, ty=shoot.y-shoot.vy*7;
    var grad=sx.createLinearGradient(shoot.x,shoot.y,tx,ty);
    grad.addColorStop(0,'rgba(255,244,214,'+alpha+')');
    grad.addColorStop(1,'rgba(255,244,214,0)');
    sx.strokeStyle=grad;sx.lineWidth=2;sx.lineCap='round';
    sx.beginPath();sx.moveTo(shoot.x,shoot.y);sx.lineTo(tx,ty);sx.stroke();
    // bright head
    sx.fillStyle='rgba(255,248,226,'+alpha+')';
    sx.beginPath();sx.arc(shoot.x,shoot.y,1.6,0,Math.PI*2);sx.fill();
    if(shoot.life>=shoot.max||shoot.x<-40||shoot.x>SW+40||shoot.y>SH+40)shoot=null;
  }

  ssize();
  if(reduce){staticFrame();}
  else{
    nextShoot=performance.now()+4000+Math.random()*5000;
    (function loop(t){
      t=t||0;
      paint(t);
      if(!shoot && t>nextShoot){spawnShoot();nextShoot=t+7000+Math.random()*9000;} // roughly every 7–16s
      drawShoot();
      requestAnimationFrame(loop);
    })();
  }

  var slides=document.getElementById('showSlides');
  if(slides){
    var n=slides.children.length,idx=0;
    var dots=[].slice.call(document.getElementById('showDots').children);
    function go(i){
      idx=(i+n)%n;
      slides.style.transform='translateX('+(-idx*100)+'%)';
      dots.forEach(function(d,k){d.classList.toggle('on',k===idx);});
    }
    document.getElementById('showPrev').addEventListener('click',function(){go(idx-1);});
    document.getElementById('showNext').addEventListener('click',function(){go(idx+1);});
    dots.forEach(function(d,k){d.addEventListener('click',function(){go(k);});});
    // touch swipe
    var sx0=null;
    slides.addEventListener('touchstart',function(e){sx0=e.touches[0].clientX;},{passive:true});
    slides.addEventListener('touchend',function(e){
      if(sx0===null)return;
      var dx=e.changedTouches[0].clientX-sx0;
      if(Math.abs(dx)>44) go(idx+(dx<0?1:-1));
      sx0=null;
    },{passive:true});
  }
})();

(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* hero fan: tap to toggle open/closed (repeatable) — for touch/mobile */
  var fanHold=document.querySelector('.fan-hold');
  if(fanHold){
    fanHold.addEventListener('click',function(){fanHold.classList.toggle('open');});
  }

  /* hamburger menu */
  var navToggle=document.getElementById('navToggle'),mobileMenu=document.getElementById('mobileMenu');
  if(navToggle&&mobileMenu){
    var closeMenu=function(){navToggle.classList.remove('open');mobileMenu.classList.remove('open');navToggle.setAttribute('aria-expanded','false');};
    navToggle.addEventListener('click',function(){
      var open=mobileMenu.classList.toggle('open');
      navToggle.classList.toggle('open',open);
      navToggle.setAttribute('aria-expanded',open?'true':'false');
    });
    mobileMenu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',closeMenu);});
    window.addEventListener('resize',function(){if(window.innerWidth>920)closeMenu();});
  }

  /* fire entrance right away — don't wait for fonts/images to finish loading */
  requestAnimationFrame(function(){document.body.classList.add('loaded');});
  window.addEventListener('load',function(){document.body.classList.add('loaded');});
  if(reduce) document.body.classList.add('loaded');
  /* enable fan-card transitions only after the resting fan has painted (kills the load-time "assemble") */
  requestAnimationFrame(function(){requestAnimationFrame(function(){document.body.classList.add('tready');});});

  /* scroll reveal + staggered cards */
  var revealSel='.sec-head,.sec-lead,.about-grid,.cat-head,.feat,.show,.card,.soon,.contact .pre,.contact h2,.contact p,.contact .btn';
  var els=[].slice.call(document.querySelectorAll(revealSel));
  // stagger cards within their grid
  document.querySelectorAll('.grid').forEach(function(g){
    [].slice.call(g.children).forEach(function(c,i){c.style.transitionDelay=(i*0.09)+'s';});
  });
  if(reduce||!('IntersectionObserver'in window)){
    els.forEach(function(e){e.classList.add('in');});
  }else{
    var io=new IntersectionObserver(function(ent){
      ent.forEach(function(en){
        if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}
      });
    },{threshold:0.16,rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(e){io.observe(e);});
  }

  /* scrollspy nav */
  var links=[].slice.call(document.querySelectorAll('.nav-mid a'));
  var targets=links.map(function(a){return document.querySelector(a.getAttribute('href'));}).filter(Boolean);
  if('IntersectionObserver'in window){
    var active=null;
    var spy=new IntersectionObserver(function(ent){
      ent.forEach(function(en){if(en.isIntersecting)active=en.target.id;});
      links.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+active);});
    },{rootMargin:'-45% 0px -50% 0px'});
    targets.forEach(function(t){spy.observe(t);});
  }

  if(reduce)return;

  /* magnetic buttons */
  document.querySelectorAll('.btn').forEach(function(b){
    b.addEventListener('mousemove',function(e){
      var r=b.getBoundingClientRect();
      var x=(e.clientX-r.left-r.width/2)*0.25, y=(e.clientY-r.top-r.height/2)*0.35;
      b.style.transform='translate('+x+'px,'+y+'px)';
    });
    b.addEventListener('mouseleave',function(){b.style.transform='';});
  });
})();
