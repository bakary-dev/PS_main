// PôleService — script partagé (menu mobile)
document.addEventListener('DOMContentLoaded', () => {
  initSharedFooter();
  removeRetiredPageLinks();
  initTeamNavigation();
  initNavigationBrand();

  const burger = document.querySelector('.burger');
  const navLinks = document.querySelector('.nav-links');

  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    // Ferme le menu quand on clique sur un lien (mobile)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  // ===== Grande bannière slider (aperçu services, style Porteo) =====
  document.querySelectorAll('.services-slider').forEach(initServicesSlider);

  // ===== Rotation aléatoire des photos dans une carte (ex: Développement Web) =====
  document.querySelectorAll('.preview-image[data-images]').forEach(initImageRotator);

  // ===== Apparition en fondu au scroll =====
  initRevealAnimations();

  // ===== Compteur animé pour les chiffres-clés =====
  initCountUp();

  // ===== Logo 3D interactif (bascule à la souris) =====
  initLogo3D();

  // ===== Cascade des icônes de contact (footer) =====
  initFooterStagger();

  // ===== Timeline immersive (Comment ça marche) =====
  initTimelineImmersive();

  // ===== Arrière-plan 3D — réseau digital (points + lignes connectées) =====
  initBg3DNetwork();

  // ===== Hero — cerveau numérique + fragments de code flottants =====
  initHeroDigitalBrain();

  // ===== Page À propos — réseau de particules interactif =====
  initAboutNetworks();
  initAboutTimeline();
});

function removeRetiredPageLinks() {
  document.querySelectorAll('a[href="realisations.html"]').forEach((link) => link.remove());
  document.querySelectorAll('a[href="contact.html"]').forEach((link) => {
    link.href = 'https://wa.me/2250714360969';
    link.target = '_blank';
    link.rel = 'noopener';
  });
}

function initSharedFooter() {
  const footers = document.querySelectorAll('.site-footer');
  if (!footers.length) return;

  footers.forEach((footer) => {
    const grid = footer.querySelector('.footer-grid');
    const bottom = footer.querySelector('.footer-bottom');
    if (!grid || !bottom) return;

    grid.innerHTML = `
      <div class="footer-col footer-brand">
        <div class="logo">PÔLE <span class="footer-logo-accent">SERVICES</span></div>
        <p>Le digital au service<br>de votre croissance.</p>
      </div>
      <div class="footer-col footer-links">
        <h4>Navigation</h4>
        <a href="index.html">Accueil</a>
        <a href="apropos.html">À propos</a>
        <a href="services.html">Services</a>
      </div>
      <div class="footer-col footer-links footer-services-links">
        <h4>Nos services</h4>
        <a href="services.html#developpement-web">Développement Web</a>
        <a href="services.html#design-branding">Design &amp; Branding</a>
        <a href="services.html#ia-automatisation">IA &amp; Automatisation</a>
        <a href="services.html#reseaux-sociaux">Réseaux sociaux</a>
        <a href="services.html#marketing-digital">Marketing Digital</a>
        <a href="services.html#e-commerce">E-commerce</a>
      </div>`;

    bottom.innerHTML = `
      <div class="footer-legal"><span>© 2026 Pôle Services. Tous droits réservés.</span><nav><a href="#">Mentions légales</a><a href="#">Politique de confidentialité</a><a href="#">CGV</a></nav></div>`;
  });
}

function initBg3DNetwork() {
  const canvases = document.querySelectorAll('.bg3d-network');
  if (!canvases.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Parallaxe globale au mouvement de la souris (désactivée sur tactile / mouvement réduit)
  const pointer = { x: 0, y: 0 };
  if (!reduceMotion && canHover) {
    window.addEventListener('mousemove', (e) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  const THEMES = {
    light: { dot: '47,127,255', line: '20,65,201', glow: 'rgba(47,127,255,.9)' },
    dark:  { dot: '111,180,255', line: '111,180,255', glow: 'rgba(255,255,255,.9)' }
  };

  canvases.forEach(canvas => setupNetwork(canvas));

  function setupNetwork(canvas) {
    const ctx = canvas.getContext('2d');
    const theme = THEMES[canvas.dataset.theme] || THEMES.light;
    const density = parseInt(canvas.dataset.density, 10) || 30;
    const depthRange = parseFloat(canvas.dataset.depth) || 10;

    let width = 0, height = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let points = [];
    let running = false;
    let rafId = null;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildPoints();
    }

    function buildPoints() {
      const count = Math.max(8, Math.round((width * height) / 26000 * (density / 30)));
      points = new Array(count).fill(0).map(() => {
        const depth = 0.25 + Math.random() * 0.75; // 0 = loin, 1 = proche
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.06 * depth,
          vy: (Math.random() - 0.5) * 0.06 * depth,
          r: 1 + depth * 1.8,
          depth
        };
      });
    }

    function step() {
      ctx.clearRect(0, 0, width, height);

      const offsetX = pointer.x * depthRange;
      const offsetY = pointer.y * depthRange;
      const maxDist = Math.max(70, Math.min(150, Math.min(width, height) * 0.16));

      // Déplacement très lent + rebond doux sur les bords
      points.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        p.x = Math.max(0, Math.min(width, p.x));
        p.y = Math.max(0, Math.min(height, p.y));
      });

      // Lignes de connexion entre points proches
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i], b = points[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.35 * ((a.depth + b.depth) / 2);
            ctx.strokeStyle = `rgba(${theme.line},${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x + offsetX * a.depth, a.y + offsetY * a.depth);
            ctx.lineTo(b.x + offsetX * b.depth, b.y + offsetY * b.depth);
            ctx.stroke();
          }
        }
      }

      // Points lumineux
      points.forEach(p => {
        const px = p.x + offsetX * p.depth;
        const py = p.y + offsetY * p.depth;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${theme.dot},${0.35 + p.depth * 0.5})`;
        ctx.shadowColor = theme.glow;
        ctx.shadowBlur = 6 * p.depth;
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      if (running) rafId = requestAnimationFrame(step);
    }

    function start() {
      if (running) return;
      running = true;
      if (reduceMotion) {
        step(); // une seule image statique, pas de boucle
        running = false;
      } else {
        rafId = requestAnimationFrame(step);
      }
    }

    function stop() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
    }

    resize();
    window.addEventListener('resize', resize);

    // Ne fait tourner l'animation que pour les sections visibles à l'écran (performance)
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => entry.isIntersecting ? start() : stop());
      }, { threshold: 0.01 });
      observer.observe(canvas.parentElement);
    } else {
      start();
    }
  }
}

function initHeroDigitalBrain() {
  const canvas = document.querySelector('.bg3d-hero-brain');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const CODE_TOKENS = ['<div>', '{ API }', 'AI()', '01', '</web>', '<html>', 'fetch()', '{ }', '//IA', 'npm i', '</>', '101010'];
  const CODE_COLORS = ['47,127,255', '255,255,255', '111,180,255'];
  const STAR_COLORS = { white: '255,255,255', blue: '111,180,255', navy: '10,24,50' };

  let width = 0, height = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  let brainPoints = [];
  let brainLinks = [];
  let codeFragments = [];
  let tunnelPoints = [];
  let stars = [];
  let shootingStars = [];
  let nextShootAt = 0;
  let cameraZ = 0;
  let lastTs = null;
  let running = false;
  let rafId = null;
  let buildStart = null;
  let played = false;

  const BUILD_MS = 2200;
  const TUNNEL_LENGTH = 2200;
  const TUNNEL_RING_COUNT = 16;
  const TUNNEL_RADIAL_COUNT = 8;
  const TUNNEL_RING_SPACING = TUNNEL_LENGTH / TUNNEL_RING_COUNT;
  const TUNNEL_SPEED = TUNNEL_LENGTH / 55000; // unités / ms — avance très lente

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildBrain();
    buildCode();
    buildTunnel();
    buildStars();
  }

  // ----- Galaxie : ciel étoilé + étoiles filantes -----
  function buildStars() {
    const count = width < 480 ? 40 : (width < 960 ? 60 : 85);
    stars = new Array(count).fill(0).map(() => {
      const roll = Math.random();
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.5 + Math.random() * 1.6,
        baseAlpha: 0.3 + Math.random() * 0.55,
        twinkleSpeed: 0.5 + Math.random() * 1.1,
        twinklePhase: Math.random() * Math.PI * 2,
        tone: roll < 0.65 ? 'white' : (roll < 0.9 ? 'blue' : 'navy')
      };
    });
    shootingStars = [];
    nextShootAt = 0;
  }

  function spawnShootingStar(ts) {
    const speed = 0.45 + Math.random() * 0.25; // px/ms
    shootingStars.push({
      x: Math.random() * width * 0.6 - 60,
      y: Math.random() * height * 0.4,
      vx: speed,
      vy: speed * (0.32 + Math.random() * 0.15),
      len: 70 + Math.random() * 50,
      life: 0,
      maxLife: 750 + Math.random() * 450
    });
    nextShootAt = ts + 3200 + Math.random() * 4800;
  }

  // ----- Tunnel de particules (la "caméra" avance lentement dedans) -----
  function buildTunnel() {
    const tunnelRadius = Math.max(width, height) * 0.6;
    tunnelPoints = [];
    for (let ring = 0; ring < TUNNEL_RING_COUNT; ring++) {
      const phaseOffset = ring * 0.22;
      for (let k = 0; k < TUNNEL_RADIAL_COUNT; k++) {
        const angle = (Math.PI * 2 / TUNNEL_RADIAL_COUNT) * k + phaseOffset;
        tunnelPoints.push({
          ring, k, angle,
          radius: tunnelRadius * (0.85 + Math.random() * 0.15),
          baseZ: ring * TUNNEL_RING_SPACING
        });
      }
    }
  }

  function tunnelDepth(baseZ) {
    return ((baseZ - cameraZ) % TUNNEL_LENGTH + TUNNEL_LENGTH) % TUNNEL_LENGTH + 40;
  }

  // ----- Silhouette du cerveau (deux hémisphères "lobés") -----
  function lobeRadius(theta, phase, base) {
    return base * (1 + 0.16 * Math.sin(5 * theta + phase) + 0.07 * Math.sin(9 * theta - phase * 1.4));
  }

  function insideBrain(x, y, cx, cy, base, gap) {
    if (Math.abs(x - cx) < gap) return false;
    const side = x < cx ? -1 : 1;
    const hx = cx + side * base * 0.46;
    const hy = cy;
    const dx = x - hx, dy = (y - hy) * 1.12; // légèrement aplati
    const r = Math.sqrt(dx * dx + dy * dy);
    const theta = Math.atan2(dy, dx);
    return r < lobeRadius(theta, side * 1.7, base * 0.62);
  }

  function buildBrain() {
    const cx = width * (width < 720 ? 0.5 : 0.68);
    const cy = height * 0.48;
    const base = Math.min(width * 0.32, height * 0.42, 190);
    const gap = base * 0.05;
    const targetCount = width < 480 ? 46 : 90;

    const candidates = [];
    let attempts = 0;
    while (candidates.length < targetCount && attempts < targetCount * 40) {
      attempts++;
      const x = cx + (Math.random() - 0.5) * base * 2.2;
      const y = cy + (Math.random() - 0.5) * base * 2.0;
      if (insideBrain(x, y, cx, cy, base, gap)) {
        candidates.push({ x, y });
      }
    }

    brainPoints = candidates.map(pt => ({
      tx: pt.x, ty: pt.y,                          // position cible
      sx: Math.random() * width,                    // position de départ (construction)
      sy: Math.random() * height,
      x: pt.x, y: pt.y,
      delay: Math.random() * 0.55,
      jitterPhase: Math.random() * Math.PI * 2,
      jitterSpeed: 0.4 + Math.random() * 0.4,
      r: 1.3 + Math.random() * 1.4
    }));

    // Liaisons "neuronales" précalculées une seule fois (positions cibles)
    brainLinks = [];
    const maxDist = Math.max(26, base * 0.24);
    for (let i = 0; i < brainPoints.length; i++) {
      for (let j = i + 1; j < brainPoints.length; j++) {
        const a = brainPoints[i], b = brainPoints[j];
        const dx = a.tx - b.tx, dy = a.ty - b.ty;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) brainLinks.push([i, j, 1 - dist / maxDist]);
      }
    }
  }

  // ----- Fragments de code flottants (profondeur simulée) -----
  function spawnCode(fragment) {
    const biasRight = Math.random() < 0.85;
    fragment.token = CODE_TOKENS[Math.floor(Math.random() * CODE_TOKENS.length)];
    fragment.color = CODE_COLORS[Math.floor(Math.random() * CODE_COLORS.length)];
    fragment.x = biasRight ? width * (0.32 + Math.random() * 0.68) : Math.random() * width;
    fragment.y = Math.random() * height;
    fragment.z = Math.random() * 0.3;
    fragment.vz = 0.05 + Math.random() * 0.06;
    fragment.drift = (Math.random() - 0.5) * 0.15;
    return fragment;
  }

  function buildCode() {
    const count = width < 480 ? 6 : (width < 960 ? 9 : 13);
    codeFragments = new Array(count).fill(0).map(() => spawnCode({}));
  }

  function step(ts) {
    if (buildStart === null) buildStart = ts;
    const elapsed = ts - buildStart;
    const globalProgress = reduceMotion ? 1 : Math.min(1, elapsed / BUILD_MS);
    const dt = lastTs === null ? 16 : ts - lastTs;
    lastTs = ts;

    ctx.clearRect(0, 0, width, height);

    // ---- Galaxie : voile sombre + étoiles scintillantes + étoiles filantes ----
    const vignette = ctx.createRadialGradient(
      width * 0.7, height * 0.35, 0,
      width * 0.7, height * 0.35, Math.max(width, height) * 0.7
    );
    vignette.addColorStop(0, 'rgba(10,24,50,.22)');
    vignette.addColorStop(1, 'rgba(10,24,50,0)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    stars.forEach(s => {
      const twinkle = reduceMotion ? 1 : (0.55 + 0.45 * Math.sin(ts * 0.001 * s.twinkleSpeed + s.twinklePhase));
      ctx.beginPath();
      ctx.fillStyle = `rgba(${STAR_COLORS[s.tone]},${s.baseAlpha * twinkle})`;
      if (s.tone !== 'navy') {
        ctx.shadowColor = 'rgba(255,255,255,.8)';
        ctx.shadowBlur = 3;
      }
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    if (!reduceMotion) {
      if (ts > nextShootAt && shootingStars.length < 2) spawnShootingStar(ts);
      shootingStars = shootingStars.filter(sh => sh.life < sh.maxLife && sh.x < width + 100 && sh.y < height + 100);
      shootingStars.forEach(sh => {
        sh.life += dt;
        sh.x += sh.vx * dt;
        sh.y += sh.vy * dt;
        const fadeIn = Math.min(1, sh.life / (sh.maxLife * 0.15));
        const fadeOut = Math.min(1, (sh.maxLife - sh.life) / (sh.maxLife * 0.4));
        const alpha = Math.max(0, Math.min(fadeIn, fadeOut));
        const tailX = sh.x - sh.vx * (sh.len / Math.hypot(sh.vx, sh.vy));
        const tailY = sh.y - sh.vy * (sh.len / Math.hypot(sh.vx, sh.vy));
        const grad = ctx.createLinearGradient(tailX, tailY, sh.x, sh.y);
        grad.addColorStop(0, 'rgba(255,255,255,0)');
        grad.addColorStop(1, `rgba(255,255,255,${alpha})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(sh.x, sh.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.shadowColor = 'rgba(111,180,255,.9)';
        ctx.shadowBlur = 6;
        ctx.arc(sh.x, sh.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    }

    // ---- Tunnel de particules : la caméra avance lentement dans l'espace ----
    if (!reduceMotion) cameraZ = (cameraZ + TUNNEL_SPEED * dt) % TUNNEL_LENGTH;
    const tcx = width * 0.5, tcy = height * 0.48;
    const focal = Math.min(width, height) * 0.55;
    const projected = tunnelPoints.map(pt => {
      const depth = tunnelDepth(pt.baseZ);
      const scale = focal / depth;
      return {
        ring: pt.ring, k: pt.k, depth,
        x: tcx + Math.cos(pt.angle) * pt.radius * scale,
        y: tcy + Math.sin(pt.angle) * pt.radius * scale * 0.82,
        size: Math.max(0.4, Math.min(3.2, scale * 2.2)),
        alpha: Math.max(0, Math.min(0.5, scale * 0.9))
      };
    });
    const byRing = {};
    projected.forEach(p => { (byRing[p.ring] = byRing[p.ring] || [])[p.k] = p; });

    // Anneaux (cercles) du tunnel
    Object.values(byRing).forEach(ring => {
      for (let k = 0; k < TUNNEL_RADIAL_COUNT; k++) {
        const a = ring[k], b = ring[(k + 1) % TUNNEL_RADIAL_COUNT];
        if (!a || !b) continue;
        const alpha = Math.min(a.alpha, b.alpha) * 0.6;
        if (alpha <= 0.01) continue;
        ctx.strokeStyle = `rgba(111,180,255,${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    });
    // Rails longitudinaux entre anneaux consécutifs
    for (let r = 0; r < TUNNEL_RING_COUNT - 1; r++) {
      const ringA = byRing[r], ringB = byRing[r + 1];
      if (!ringA || !ringB) continue;
      for (let k = 0; k < TUNNEL_RADIAL_COUNT; k++) {
        const a = ringA[k], b = ringB[k];
        if (!a || !b) continue;
        if (Math.abs(Math.abs(a.depth - b.depth) - TUNNEL_RING_SPACING) > TUNNEL_RING_SPACING * 0.5) continue; // évite le "saut" au passage de la caméra
        const alpha = Math.min(a.alpha, b.alpha) * 0.4;
        if (alpha <= 0.01) continue;
        ctx.strokeStyle = `rgba(111,180,255,${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
    projected.forEach(p => {
      if (p.alpha <= 0.02) return;
      ctx.beginPath();
      ctx.fillStyle = `rgba(111,180,255,${p.alpha})`;
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // ---- Cerveau : construction puis vie légère ----
    brainPoints.forEach(p => {
      let prog = reduceMotion ? 1 : Math.min(1, Math.max(0, (globalProgress - p.delay) / (1 - p.delay)));
      prog = prog * prog * (3 - 2 * prog); // easeInOutQuad-ish (smoothstep)
      const bx = p.sx + (p.tx - p.sx) * prog;
      const by = p.sy + (p.ty - p.sy) * prog;
      const jitter = reduceMotion ? 0 : Math.sin(ts * 0.001 * p.jitterSpeed + p.jitterPhase) * 2 * prog;
      p.x = bx;
      p.y = by + jitter;
      p.alpha = prog;
    });

    brainLinks.forEach(([i, j, strength]) => {
      const a = brainPoints[i], b = brainPoints[j];
      const alpha = Math.min(a.alpha, b.alpha) * strength * 0.4;
      if (alpha <= 0.01) return;
      ctx.strokeStyle = `rgba(111,180,255,${alpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    });

    brainPoints.forEach(p => {
      if (p.alpha <= 0.01) return;
      ctx.beginPath();
      ctx.fillStyle = `rgba(47,127,255,${0.4 + p.alpha * 0.5})`;
      ctx.shadowColor = 'rgba(47,127,255,.9)';
      ctx.shadowBlur = 5;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    // ---- Fragments de code qui traversent puis disparaissent ----
    ctx.textBaseline = 'middle';
    codeFragments.forEach(f => {
      if (!reduceMotion) {
        f.z += f.vz * 0.016;
        f.x += f.drift;
        if (f.z >= 1 || f.x < -60 || f.x > width + 60) spawnCode(f);
      }
      const size = 10 + f.z * 15;
      const fadeIn = Math.min(1, f.z / 0.25);
      const fadeOut = Math.min(1, (1 - f.z) / 0.2);
      const alpha = Math.max(0, Math.min(fadeIn, fadeOut)) * 0.55;
      if (alpha <= 0.01) return;
      ctx.font = `600 ${size}px 'Courier New', monospace`;
      ctx.fillStyle = `rgba(${f.color},${alpha})`;
      ctx.fillText(f.token, f.x, f.y);
    });

    if (running) rafId = requestAnimationFrame(step);
  }

  function start() {
    if (running) return;
    running = true;
    if (reduceMotion) {
      buildStart = 0;
      step(BUILD_MS + 1);
      running = false;
    } else {
      if (!played) { buildStart = null; played = true; }
      rafId = requestAnimationFrame(step);
    }
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
  }

  resize();
  window.addEventListener('resize', resize);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.isIntersecting ? start() : stop());
    }, { threshold: 0.01 });
    observer.observe(canvas.parentElement);
  } else {
    start();
  }
}

function initTimelineImmersive() {
  const section = document.getElementById('timelineSection');
  const progressFill = document.getElementById('timelineProgressFill');
  const steps = document.querySelectorAll('.tl-step');
  const parallaxEls = document.querySelectorAll('#timelineSection [data-parallax]');
  if (!section) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Révélation des étapes en alternance gauche/droite au scroll
  if ('IntersectionObserver' in window) {
    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          stepObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    steps.forEach(step => stepObserver.observe(step));
  } else {
    steps.forEach(step => step.classList.add('visible'));
  }

  if (reduceMotion) return;

  // Ligne de progression + parallaxe de l'illustration, liées au scroll
  let ticking = false;

  function update() {
    ticking = false;
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const total = rect.height + vh;
    let progress = (vh - rect.top) / total;
    progress = Math.min(Math.max(progress, 0), 1);

    if (progressFill) progressFill.style.height = (progress * 100) + '%';

    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0;
      const offset = (progress - 0.5) * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}

function initFooterStagger() {
  const el = document.getElementById('footerContact');
  if (!el) return;

  if (!('IntersectionObserver' in window)) {
    el.classList.add('visible');
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(el);
}

function initLogo3D() {
  const logo = document.getElementById('logo3d');
  const zone = document.getElementById('heroSection');
  if (!logo || !zone) return;

  let resetTimeout = null;

  zone.addEventListener('mousemove', (e) => {
    const rect = zone.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;  // 0 → 1
    const y = (e.clientY - rect.top) / rect.height;  // 0 → 1

    const rotateY = (x - 0.5) * 30;   // -15deg → 15deg
    const rotateX = (0.5 - y) * 20;   // -10deg → 10deg

    logo.classList.add('tilting');
    logo.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    clearTimeout(resetTimeout);
  });

  zone.addEventListener('mouseleave', () => {
    logo.style.transform = '';
    resetTimeout = setTimeout(() => {
      logo.classList.remove('tilting');
    }, 150);
  });
}

function initRevealAnimations() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(el => observer.observe(el));
}

function initCountUp() {
  const counters = document.querySelectorAll('.count-up');
  if (!counters.length) return;

  function animateCount(el) {
    const target = parseFloat(el.dataset.target) || 0;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutQuad pour un ralentissement en fin de comptage
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = Math.round(target * eased);
      el.textContent = prefix + current + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animateCount);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(el => observer.observe(el));
}

function initImageRotator(el) {
  const images = el.dataset.images.split(',').map(s => s.trim()).filter(Boolean);
  const img = el.querySelector('img');
  if (!img || images.length < 2) return;

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  let order = shuffle(images);
  let index = 0;

  setInterval(() => {
    index++;
    if (index >= order.length) {
      index = 0;
      order = shuffle(images); // nouvel ordre aléatoire à chaque tour
    }
    img.style.opacity = 0;
    setTimeout(() => {
      img.src = order[index];
      img.style.opacity = 1;
    }, 400);
  }, 2800);
}

function initServicesSlider(slider) {
  const slides = Array.from(slider.querySelectorAll('.slide'));
  const dotsWrap = slider.querySelector('#slideDots') || slider.querySelector('.slide-dots');
  if (!slides.length || !dotsWrap) return;

  let current = 0;
  let timer = null;
  const DURATION = 4000; // temps d'affichage par slide

  // Génère les points de navigation
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'sdot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Slide ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.querySelectorAll('.sdot'));

  function goTo(i) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = i;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    resetTimer();
  }

  function next() { goTo((current + 1) % slides.length); }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(next, DURATION);
  }
  resetTimer();

  // Pause au survol (desktop)
  slider.addEventListener('mouseenter', () => clearInterval(timer));
  slider.addEventListener('mouseleave', resetTimer);
}

function initAboutNetworks() {
  const canvases = document.querySelectorAll('.about-network, .about-vision-network');
  if (!canvases.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const pointer = { x: 0, y: 0 };

  if (!reduceMotion && canHover) {
    window.addEventListener('mousemove', (event) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  canvases.forEach((canvas, canvasIndex) => {
    const context = canvas.getContext('2d');
    const parent = canvas.parentElement;
    let width = 0;
    let height = 0;
    let points = [];
    let animationFrame = null;
    let running = false;

    function resize() {
      const bounds = parent.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = width < 560 ? 34 : (canvasIndex ? 62 : 48);
      points = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        depth: 0.3 + Math.random() * 0.7
      }));
    }

    function draw() {
      context.clearRect(0, 0, width, height);
      const offsetX = pointer.x * 12;
      const offsetY = pointer.y * 12;
      const linkDistance = Math.min(135, Math.max(80, width * 0.14));

      points.forEach((point) => {
        if (!reduceMotion) {
          point.x += point.vx;
          point.y += point.vy;
          if (point.x < 0 || point.x > width) point.vx *= -1;
          if (point.y < 0 || point.y > height) point.vy *= -1;
        }
      });

      points.forEach((point, index) => {
        for (let nextIndex = index + 1; nextIndex < points.length; nextIndex += 1) {
          const next = points[nextIndex];
          const distance = Math.hypot(point.x - next.x, point.y - next.y);
          if (distance < linkDistance) {
            context.strokeStyle = `rgba(111,180,255,${(1 - distance / linkDistance) * 0.24})`;
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(point.x + offsetX * point.depth, point.y + offsetY * point.depth);
            context.lineTo(next.x + offsetX * next.depth, next.y + offsetY * next.depth);
            context.stroke();
          }
        }
        const x = point.x + offsetX * point.depth;
        const y = point.y + offsetY * point.depth;
        context.beginPath();
        context.fillStyle = `rgba(255,${canvasIndex ? 154 : 255},${canvasIndex ? 46 : 255},${0.35 + point.depth * 0.4})`;
        context.shadowColor = canvasIndex ? 'rgba(255,154,46,.7)' : 'rgba(111,180,255,.7)';
        context.shadowBlur = 7 * point.depth;
        context.arc(x, y, 1 + point.depth * 1.5, 0, Math.PI * 2);
        context.fill();
      });
      context.shadowBlur = 0;
      if (running && !reduceMotion) animationFrame = requestAnimationFrame(draw);
    }

    function start() {
      if (running) return;
      running = true;
      draw();
    }

    function stop() {
      running = false;
      if (animationFrame) cancelAnimationFrame(animationFrame);
    }

    resize();
    window.addEventListener('resize', resize);
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => entry.isIntersecting ? start() : stop());
      }, { threshold: 0.01 });
      observer.observe(parent);
    } else {
      start();
    }
  });
}

function initAboutTimeline() {
  const timeline = document.querySelector('.about-timeline');
  const progress = timeline ? timeline.querySelector('.timeline-track span') : null;
  if (!timeline || !progress) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function updateProgress() {
    const bounds = timeline.getBoundingClientRect();
    const viewportPoint = window.innerHeight * 0.62;
    const amount = Math.max(0, Math.min(1, (viewportPoint - bounds.top) / bounds.height));
    progress.style.height = (reduceMotion ? 100 : amount * 100) + '%';
  }

  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
}

function initTeamNavigation() {
  document.querySelectorAll('.nav-links').forEach((links) => {
    if (links.querySelector('a[href="equipe.html"]')) return;
    const link = document.createElement('a');
    link.href = 'equipe.html';
    link.textContent = 'Notre équipe';
    if (window.location.pathname.endsWith('equipe.html')) link.classList.add('active');
    links.appendChild(link);
  });
}

function initNavigationBrand() {
  document.querySelectorAll('header nav').forEach((nav) => {
    let logo = nav.querySelector(':scope > .logo');
    if (!logo) {
      logo = document.createElement('div');
      logo.className = 'logo';
      nav.insertBefore(logo, nav.firstElementChild);
    }
    logo.innerHTML = 'Pôle <span>Services</span>';
  });
}