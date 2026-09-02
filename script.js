(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Floating nav: hide on scroll down, show on scroll up ---------- */
  var navWrap = document.getElementById('navbar-wrap');
  var navLinks = document.querySelectorAll('[data-nav]');
  var sections = document.querySelectorAll('section[id]');
  var lastScroll = 0;

window.addEventListener('load', () => {
  const loader = document.getElementById('loading-screen');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 600); // matches your CSS transition time
    }, 1500); // <-- how long the loader stays fully visible before fading, adjust as needed
  }
});

  window.addEventListener('scroll', function(){
    var current = window.scrollY;

    if(current > lastScroll && current > 100){
      navWrap.classList.add('nav-hidden');
    } else {
      navWrap.classList.remove('nav-hidden');
    }
    lastScroll = current;

    var pos = current + 120;
    sections.forEach(function(sec){
      if(pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight){
        navLinks.forEach(function(l){
          l.classList.toggle('active', l.getAttribute('href') === '#'+sec.id);
        });
      }
    });
  }, {passive:true});

  /* ---------- Mobile menu ---------- */
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');
  hamburger.addEventListener('click', function(){
    var open = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
  });
  mobileMenu.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ mobileMenu.classList.remove('open'); });
  });

  /* ---------- Photo lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  var lbContent = document.getElementById('lightbox-content');
  var lbCaption = document.getElementById('lightbox-caption');
  document.querySelectorAll('.ph').forEach(function(ph){
    function openLb(){
      var img = ph.querySelector('img');
      var fallback = ph.querySelector('.ph-fallback');
      lbContent.innerHTML = (img && img.style.display !== 'none') ? img.outerHTML : fallback.innerHTML;
      lbCaption.textContent = ph.getAttribute('data-caption') || '';
      lightbox.classList.add('open');
    }
    ph.addEventListener('click', openLb);
    ph.addEventListener('keydown', function(e){ if(e.key === 'Enter') openLb(); });
  });
  document.getElementById('lightbox-close').addEventListener('click', function(){
    lightbox.classList.remove('open');
  });
  lightbox.addEventListener('click', function(e){ if(e.target === lightbox) lightbox.classList.remove('open'); });

  /* ---------- Certificate lightbox ---------- */
var certLb = document.getElementById('cert-lightbox');
document.querySelectorAll('.cert-card').forEach(function(card){
  card.addEventListener('click', function(){
    var cardImg = card.querySelector('.cert-art img');
    var lbImageBox = document.getElementById('cert-lb-image');
    if(cardImg){
      lbImageBox.innerHTML = '<img src="' + cardImg.getAttribute('src') + '" alt="' + cardImg.getAttribute('alt') + '" style="width:100%; height:100%; object-fit:contain; display:block;">';
    } else {
      lbImageBox.innerHTML = '<div class="ph-fallback" style="width:100%; height:100%;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="5"/><path d="m8.5 12.5-1 8 4.5-2 4.5 2-1-8"/></svg></div>';
    }
    certLb.classList.add('open');
  });
});
document.getElementById('cert-lightbox-close').addEventListener('click', function(){
  certLb.classList.remove('open');
});
certLb.addEventListener('click', function(e){ if(e.target === certLb) certLb.classList.remove('open'); });

  /* ---------- Skills carousel ---------- */
  (function(){
    var track = document.getElementById('skills-track');
    var prevBtn = document.getElementById('skills-prev');
    var nextBtn = document.getElementById('skills-next');
    var progressBar = document.getElementById('skills-progress');
    if(!track) return;

    function cardStep(){
      var card = track.querySelector('.carousel-card');
      if(!card) return 220;
      var style = getComputedStyle(track);
      var gap = parseFloat(style.gap || style.columnGap || 18);
      return card.getBoundingClientRect().width + gap;
    }
    function updateProgress(){
      var max = track.scrollWidth - track.clientWidth;
      var pct = max > 0 ? (track.scrollLeft / max) * 100 : 0;
      var visiblePct = Math.max(15, (track.clientWidth / track.scrollWidth) * 100);
      progressBar.style.width = visiblePct + '%';
      progressBar.style.transform = 'translateX(' + (pct * (100 - visiblePct) / 100) + '%)';
      progressBar.style.marginLeft = '0';
      progressBar.parentElement.style.position = 'relative';
    }
    prevBtn.addEventListener('click', function(){
      track.scrollBy({left: -cardStep()*2, behavior: reduceMotion ? 'auto' : 'smooth'});
    });
    nextBtn.addEventListener('click', function(){
      track.scrollBy({left: cardStep()*2, behavior: reduceMotion ? 'auto' : 'smooth'});
    });
    track.addEventListener('scroll', updateProgress, {passive:true});
    window.addEventListener('resize', updateProgress);
    updateProgress();
  })();

  /* ---------- Parallax on hero photo cluster ---------- */
  var stage = document.querySelector('.photo-stage');
  var orbit = document.querySelector('.photo-orbit');
  if(stage && orbit && !reduceMotion){
    stage.addEventListener('mousemove', function(e){
      var r = stage.getBoundingClientRect();
      var x = (e.clientX - r.left)/r.width - 0.5;
      var y = (e.clientY - r.top)/r.height - 0.5;
      orbit.style.transform = 'rotateY(' + (x*8) + 'deg) rotateX(' + (y*-8) + 'deg)';
    });
    stage.addEventListener('mouseleave', function(){
      orbit.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  }

  /* ---------- 3D tilt on project/cert cards ---------- */
  document.querySelectorAll('.tilt, .cert-card, .project-card').forEach(function(card){
    if(reduceMotion) return;
    card.addEventListener('mousemove', function(e){
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left)/r.width - 0.5;
      var y = (e.clientY - r.top)/r.height - 0.5;
      card.style.transform = 'perspective(700px) rotateY(' + (x*8) + 'deg) rotateX(' + (y*-8) + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', function(){
      card.style.transform = '';
    });
  });

  /* ---------- Scroll reveal (GSAP if available, else IntersectionObserver) ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if(window.gsap && window.ScrollTrigger && !reduceMotion){
    gsap.registerPlugin(ScrollTrigger);
    reveals.forEach(function(el){
      gsap.fromTo(el, {opacity:0, y:24}, {
        opacity:1, y:0, duration:0.7, ease:'power2.out',
        scrollTrigger:{ trigger:el, start:'top 85%' }
      });
    });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, {threshold:0.15});
    reveals.forEach(function(el){ io.observe(el); });
  }

  /* ---------- Three.js particle network background ---------- */
  (function initBg(){
    var canvas = document.getElementById('bg-canvas');
    if(!window.THREE || reduceMotion) return;

    var renderer = new THREE.WebGLRenderer({canvas: canvas, alpha:true, antialias:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.z = 60;

    var COUNT = window.innerWidth < 700 ? 45 : 90;
    var positions = new Float32Array(COUNT * 3);
    var velocities = [];
    for(var i=0;i<COUNT;i++){
      positions[i*3] = (Math.random()-0.5) * 140;
      positions[i*3+1] = (Math.random()-0.5) * 90;
      positions[i*3+2] = (Math.random()-0.5) * 60;
      velocities.push({x:(Math.random()-0.5)*0.03, y:(Math.random()-0.5)*0.03});
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    var mat = new THREE.PointsMaterial({color: 0x3B82F6, size: 1.1, transparent:true, opacity:0.75});
    var points = new THREE.Points(geo, mat);
    scene.add(points);

    var lineGeo = new THREE.BufferGeometry();
    var lineMat = new THREE.LineBasicMaterial({color:0x06B6D4, transparent:true, opacity:0.12});
    var lineSegs = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineSegs);

    function updateLines(){
      var verts = [];
      var pos = geo.attributes.position.array;
      var maxDist = 22;
      for(var a=0; a<COUNT; a++){
        for(var b=a+1; b<COUNT; b++){
          var dx = pos[a*3]-pos[b*3], dy = pos[a*3+1]-pos[b*3+1], dz = pos[a*3+2]-pos[b*3+2];
          var d = Math.sqrt(dx*dx+dy*dy+dz*dz);
          if(d < maxDist){
            verts.push(pos[a*3],pos[a*3+1],pos[a*3+2], pos[b*3],pos[b*3+1],pos[b*3+2]);
          }
        }
      }
      lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    }

    var frame = 0;
    function animate(){
      requestAnimationFrame(animate);
      frame++;
      var pos = geo.attributes.position.array;
      for(var i=0;i<COUNT;i++){
        pos[i*3] += velocities[i].x;
        pos[i*3+1] += velocities[i].y;
        if(Math.abs(pos[i*3]) > 70) velocities[i].x *= -1;
        if(Math.abs(pos[i*3+1]) > 45) velocities[i].y *= -1;
      }
      geo.attributes.position.needsUpdate = true;
      if(frame % 4 === 0) updateLines();
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', function(){
      camera.aspect = window.innerWidth/window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  })();
})();