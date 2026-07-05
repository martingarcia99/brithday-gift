/* =========================================================================
   MIRIAM · WEB DE CUMPLEAÑOS SORPRESA
   Lógica principal (JavaScript puro, sin dependencias externas)
   =========================================================================
   Índice:
   1. Configuración editable (carta, fotos y recuerdos)
   2. Utilidades generales
   3. Navegación entre pantallas
   4. Fondo: cielo estrellado + destellos globales
   5. Barra de progreso
   6. Música flotante
   7. Pantalla 2 — Carta (sobre + máquina de escribir)
   8. Pantalla 3 — Galería / carrusel de recuerdos
   9. Pantalla 5 — Castillo mágico
   10. Pantalla 6 — Caja de regalo + partículas
   11. Pantalla 7 — Billete y revelación
   12. Pantalla 8 — Celebración final (fuegos artificiales + confeti)
   13. Sistema de partículas compartido (confeti / corazones / estrellas)
   14. Arranque
   ========================================================================= */

/* -------------------------------------------------------------------------
   1. CONFIGURACIÓN EDITABLE
   Edita aquí el texto de la carta y la lista de fotos/recuerdos.
   Las imágenes deben colocarse dentro de la carpeta /images con estos
   mismos nombres de archivo (o cambia los nombres por los tuyos).
   ------------------------------------------------------------------------- */
const CONFIG = {
  // Texto de la carta. Se escribe letra a letra al abrir el sobre.
  letterText:
`Mi vida,

Hoy cumples 29 años y solo puedo pensar en lo afortunado que soy
de tenerte a mi lado. Cada día contigo es un poquito de magia real,
de esa que no hace falta buscar en los cuentos porque ya la tengo
en casa.

Gracias por tu risa, por tu manera de mirar el mundo, por
convertir hasta lo más pequeño en algo especial. Contigo todo
es más bonito.

Este es solo el principio de tu sorpresa... sigue mirando.

Te quiero muchísimo.`,

  // Recuerdos de la galería. "file" es el nombre del archivo dentro de /images.
  // Los textos de abajo son solo una idea: cámbialos por el recuerdo real
  // que quieras dejar debajo de cada foto. Si un archivo no existe todavía,
  // se mostrará un bonito marcador de posición en su lugar.
  memories: [
    { file: 'foto-1.jpg', caption: 'Aquel paraíso que descubrimos juntos, con el mar más azul y tú a mi lado.' },
    { file: 'foto-2.jpg', caption: 'Riéndonos de nada y de todo, que es como más me gusta estar contigo.' },
    { file: 'foto-3.jpg', caption: 'Una noche de mil luces que, aun así, brillaban menos que tu sonrisa.' },
    { file: 'foto-4.jpg', caption: 'Nuestra escapada entre el frío, los abrigos y un montón de abrazos.' },
    { file: 'foto-5.jpg', caption: 'En casa, haciendo el tonto: nuestro plan favorito del mundo.' },
    { file: 'foto-6.jpg', caption: 'Abrazados frente a la cascada, empapados y felices.' },
    { file: 'foto-7.jpg', caption: 'De la mano, sin prisa, mirando el mundo juntos.' },
    { file: 'foto-8.jpg', caption: 'Un beso bajo el agua, de esos que no se olvidan nunca.' },
    { file: 'foto-9.jpg', caption: 'Perdidos en un templo de cuento, al otro lado del mundo.' },
    { file: 'foto-10.jpg', caption: 'Viviendo una aventura de las de verdad, junto a los gigantes más dulces.' },
    { file: 'foto-11.jpg', caption: 'Elegantes y enamorados, en una de esas noches que parecen de película.' },
    { file: 'foto-12.jpg', caption: 'Frente a la Fontana di Trevi, pidiendo el deseo de volver siempre juntos.' },
    { file: 'foto-13.jpg', caption: 'Atardeceres por la ciudad contigo, que lo hacen todo más bonito.' },
  ],
};

/* -------------------------------------------------------------------------
   2. UTILIDADES GENERALES
   ------------------------------------------------------------------------- */
const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const rand = (min, max) => Math.random() * (max - min) + min;

/* -------------------------------------------------------------------------
   3. NAVEGACIÓN ENTRE PANTALLAS
   ------------------------------------------------------------------------- */
const TOTAL_SCREENS = 8;
let currentScreen = 1;

// Funciones que se ejecutan al ENTRAR en una pantalla concreta.
const onEnterScreen = {
  3: initGallery,
  5: initCastle,
  7: initTicketReveal,
  8: initCelebration,
};

// Funciones que se ejecutan al SALIR de una pantalla concreta (limpieza).
const onExitScreen = {
  8: stopCelebration,
};

function goToScreen(number) {
  if (number < 1 || number > TOTAL_SCREENS || number === currentScreen) return;

  const prev = qs(`#screen-${currentScreen}`);
  const next = qs(`#screen-${number}`);
  if (!next) return;

  if (onExitScreen[currentScreen]) onExitScreen[currentScreen]();

  if (prev) prev.classList.remove('active');
  next.classList.add('active');

  // Al reiniciar la experiencia (volver a la pantalla 1) restauramos
  // el estado inicial de todas las pantallas para poder revivir la sorpresa.
  if (number === 1) resetExperience();

  currentScreen = number;
  updateProgressDots();

  if (onEnterScreen[number]) onEnterScreen[number]();
}

// Cualquier botón con [data-next] navega automáticamente.
qsa('[data-next]').forEach((btn) => {
  btn.addEventListener('click', () => goToScreen(Number(btn.dataset.next)));
});

/* -------------------------------------------------------------------------
   4. FONDO: CIELO ESTRELLADO + DESTELLOS GLOBALES
   ------------------------------------------------------------------------- */
(function initStarfield() {
  const canvas = qs('#stars-canvas');
  const ctx = canvas.getContext('2d');
  let width, height, stars;

  function buildStars() {
    const count = Math.min(220, Math.floor((width * height) / 4200));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.85, // deja algo de espacio libre abajo
      r: rand(0.5, 1.8),
      baseAlpha: rand(0.3, 1),
      speed: rand(0.5, 2),
      phase: rand(0, Math.PI * 2),
    }));
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildStars();
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);
    for (const star of stars) {
      const twinkle = 0.55 + 0.45 * Math.sin(time * 0.001 * star.speed + star.phase);
      ctx.globalAlpha = star.baseAlpha * twinkle;
      ctx.fillStyle = '#fffaf3';
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
})();

// Pequeños destellos dorados que ascienden lentamente por toda la web.
(function initGlobalSparkles() {
  const layer = qs('#global-sparkles');

  function spawnSparkle() {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = rand(0, 100) + 'vw';
    sparkle.style.bottom = rand(-5, 10) + 'vh';
    sparkle.style.animationDuration = rand(6, 13) + 's';
    sparkle.style.opacity = rand(0.4, 1);
    sparkle.addEventListener('animationend', () => sparkle.remove());
    layer.appendChild(sparkle);
  }

  setInterval(spawnSparkle, 700);
})();

/* -------------------------------------------------------------------------
   5. BARRA DE PROGRESO (decorativa)
   ------------------------------------------------------------------------- */
const progressDotsContainer = qs('#progress-dots');
for (let i = 1; i <= TOTAL_SCREENS; i++) {
  const dot = document.createElement('span');
  dot.className = 'p-dot';
  dot.dataset.screen = i;
  progressDotsContainer.appendChild(dot);
}

function updateProgressDots() {
  qsa('.p-dot', progressDotsContainer).forEach((dot) => {
    dot.classList.toggle('done', Number(dot.dataset.screen) <= currentScreen);
  });
}
updateProgressDots();

/* -------------------------------------------------------------------------
   6. MÚSICA FLOTANTE
   ------------------------------------------------------------------------- */
(function initMusic() {
  const audio = qs('#bg-music');
  const button = qs('#music-toggle');
  const playIcon = qs('.music-icon-play', button);
  const pauseIcon = qs('.music-icon-pause', button);

  button.addEventListener('click', () => {
    if (audio.paused) {
      // El play() solo se llama tras una acción explícita del usuario,
      // por lo que cumple con las políticas de autoplay de los navegadores.
      audio.play().catch(() => {
        /* Si no hay archivo de música en /music aún, simplemente no pasa nada. */
      });
    } else {
      audio.pause();
    }
  });

  audio.addEventListener('play', () => {
    button.classList.add('is-playing');
    playIcon.hidden = true;
    pauseIcon.hidden = false;
  });

  audio.addEventListener('pause', () => {
    button.classList.remove('is-playing');
    playIcon.hidden = false;
    pauseIcon.hidden = true;
  });
})();

/* -------------------------------------------------------------------------
   7. PANTALLA 2 — CARTA (SOBRE + MÁQUINA DE ESCRIBIR)
   ------------------------------------------------------------------------- */
let letterTyped = false;
let typewriterInterval = null;

(function initLetter() {
  const envelope = qs('#envelope');
  const letterTextEl = qs('#letter-text');
  const afterLetterBtn = qs('#btn-after-letter');

  function openEnvelope() {
    if (envelope.classList.contains('is-open')) return;
    envelope.classList.add('is-open');
    envelope.setAttribute('aria-expanded', 'true');

    if (!letterTyped) {
      letterTyped = true;
      setTimeout(() => typeWriter(letterTextEl, CONFIG.letterText, afterLetterBtn), 650);
    }
  }

  envelope.addEventListener('click', openEnvelope);
  envelope.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openEnvelope();
    }
  });
})();

function typeWriter(el, text, buttonToReveal, speed = 28) {
  el.textContent = '';
  let i = 0;
  clearInterval(typewriterInterval);
  typewriterInterval = setInterval(() => {
    el.textContent += text.charAt(i);
    i++;
    if (i >= text.length) {
      clearInterval(typewriterInterval);
      if (buttonToReveal) buttonToReveal.classList.add('is-ready');
    }
  }, speed);
}

function resetLetter() {
  const envelope = qs('#envelope');
  const letterTextEl = qs('#letter-text');
  const afterLetterBtn = qs('#btn-after-letter');
  clearInterval(typewriterInterval);
  envelope.classList.remove('is-open');
  envelope.setAttribute('aria-expanded', 'false');
  letterTextEl.textContent = '';
  afterLetterBtn.classList.remove('is-ready');
  letterTyped = false;
}

/* -------------------------------------------------------------------------
   8. PANTALLA 3 — GALERÍA / CARRUSEL DE RECUERDOS
   ------------------------------------------------------------------------- */
let galleryBuilt = false;
let carouselIndex = 0;

function initGallery() {
  if (!galleryBuilt) buildGallery();
  updateCarousel();
}

function buildGallery() {
  const track = qs('#carousel-track');
  const dotsWrap = qs('#carousel-dots');

  CONFIG.memories.forEach((memory, index) => {
    const card = document.createElement('div');
    card.className = 'memory-card';

    const frame = document.createElement('div');
    frame.className = 'memory-photo-frame';

    const img = new Image();
    img.alt = `Recuerdo ${index + 1}`;
    img.src = `images/${memory.file}`;
    img.addEventListener('load', () => img.classList.add('is-loaded'));
    img.addEventListener('error', () => {
      frame.innerHTML = `<p class="memory-photo-placeholder">✦<br>Añade "${memory.file}"<br>en la carpeta /images</p>`;
    });
    frame.appendChild(img);

    const caption = document.createElement('p');
    caption.className = 'memory-caption';
    caption.textContent = memory.caption;

    card.appendChild(frame);
    card.appendChild(caption);
    track.appendChild(card);

    const dot = document.createElement('span');
    dot.className = 'dot';
    dotsWrap.appendChild(dot);
  });

  qs('#carousel-prev').addEventListener('click', () => moveCarousel(-1));
  qs('#carousel-next').addEventListener('click', () => moveCarousel(1));

  // Deslizar con el dedo en móviles
  let touchStartX = 0;
  const wrapper = qs('.carousel-track-wrapper');
  wrapper.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  wrapper.addEventListener('touchend', (e) => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 40) moveCarousel(delta < 0 ? 1 : -1);
  }, { passive: true });

  // Flechas del teclado cuando la pantalla 3 está activa
  document.addEventListener('keydown', (e) => {
    if (currentScreen !== 3) return;
    if (e.key === 'ArrowLeft') moveCarousel(-1);
    if (e.key === 'ArrowRight') moveCarousel(1);
  });

  galleryBuilt = true;
}

function moveCarousel(direction) {
  const total = CONFIG.memories.length;
  carouselIndex = (carouselIndex + direction + total) % total;
  updateCarousel();
}

function updateCarousel() {
  const track = qs('#carousel-track');
  if (!track) return;
  track.style.transform = `translateX(-${carouselIndex * 100}%)`;
  qsa('.carousel-dots .dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === carouselIndex);
  });
}

/* -------------------------------------------------------------------------
   9. PANTALLA 5 — CASTILLO MÁGICO
   ------------------------------------------------------------------------- */
function initCastle() {
  replayCssAnimation(qs('#castle-svg'));
  replayCssAnimation(qs('.magic-burst'));
  buildCastleSparkles();

  const btn = qs('#btn-after-castle');
  btn.classList.remove('is-ready');
  clearTimeout(initCastle._t);
  initCastle._t = setTimeout(() => btn.classList.add('is-ready'), 3200);
}

function buildCastleSparkles() {
  const container = qs('#castle-sparkles');
  container.innerHTML = '';
  const count = 18;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.className = 'mini-sparkle';
    s.style.left = rand(5, 95) + '%';
    s.style.top = rand(5, 90) + '%';
    s.style.animationDelay = rand(0, 2.5) + 's';
    s.style.animationDuration = rand(1.4, 2.6) + 's';
    container.appendChild(s);
  }
}

// Fuerza a que una animación CSS con fill-mode:forwards se repita
// eliminando y forzando un reflow antes de reactivarla.
function replayCssAnimation(el) {
  if (!el) return;
  el.style.animation = 'none';
  // eslint-disable-next-line no-unused-expressions
  void el.offsetWidth;
  el.style.animation = '';
}

/* -------------------------------------------------------------------------
   10. PANTALLA 6 — CAJA DE REGALO + PARTÍCULAS
   ------------------------------------------------------------------------- */
(function initGiftBox() {
  const box = qs('#gift-box');
  const afterGiftBtn = qs('#btn-after-gift');

  function openBox() {
    if (box.classList.contains('is-open')) return;
    box.classList.add('is-open');
    spawnParticles({ confetti: 26, heart: 10, star: 10 });
    setTimeout(() => spawnParticles({ confetti: 14, heart: 6, star: 8 }), 250);
    setTimeout(() => afterGiftBtn.classList.add('is-ready'), 900);
  }

  box.addEventListener('click', openBox);
  box.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openBox();
    }
  });
})();

function resetGiftBox() {
  const box = qs('#gift-box');
  const afterGiftBtn = qs('#btn-after-gift');
  box.classList.remove('is-open');
  afterGiftBtn.classList.remove('is-ready');
}

/* -------------------------------------------------------------------------
   11. PANTALLA 7 — BILLETE Y REVELACIÓN
   ------------------------------------------------------------------------- */
function initTicketReveal() {
  replayCssAnimation(qs('#ticket'));

  const wordHappy = qs('#word-happy');
  const wordLove = qs('#word-love');
  const btn = qs('#btn-after-reveal');

  wordHappy.classList.remove('is-visible');
  wordLove.classList.remove('is-visible');
  btn.classList.remove('is-ready');

  clearTimeout(initTicketReveal._t1);
  clearTimeout(initTicketReveal._t2);
  clearTimeout(initTicketReveal._t3);

  initTicketReveal._t1 = setTimeout(() => wordHappy.classList.add('is-visible'), 2600);
  initTicketReveal._t2 = setTimeout(() => wordLove.classList.add('is-visible'), 3400);
  initTicketReveal._t3 = setTimeout(() => btn.classList.add('is-ready'), 4200);
}

/* -------------------------------------------------------------------------
   12. PANTALLA 8 — CELEBRACIÓN FINAL (FUEGOS ARTIFICIALES + CONFETI)
   ------------------------------------------------------------------------- */
let fireworksRAF = null;
let celebrationConfettiInterval = null;

function initCelebration() {
  startFireworks();
  celebrationConfettiInterval = setInterval(() => {
    spawnParticles({ confetti: 3, heart: 2, star: 2 });
  }, 500);
}

function stopCelebration() {
  if (fireworksRAF) cancelAnimationFrame(fireworksRAF);
  fireworksRAF = null;
  clearInterval(celebrationConfettiInterval);
}

function startFireworks() {
  const canvas = qs('#fireworks-canvas');
  const ctx = canvas.getContext('2d');
  const colors = ['#f7cbe0', '#ade3fb', '#f2d38a', '#d3c0ef', '#fffaf3'];
  let width, height, particles = [];
  let lastLaunch = 0;

  function resize() {
    width = canvas.clientWidth || window.innerWidth;
    height = canvas.clientHeight || window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  function launchFirework() {
    const x = rand(width * 0.15, width * 0.85);
    const y = rand(height * 0.2, height * 0.5);
    const color = colors[Math.floor(rand(0, colors.length))];
    const count = 46;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = rand(1.5, 4.2);
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: rand(0.012, 0.02),
        color,
        size: rand(1.5, 3),
      });
    }
  }

  function frame(time) {
    if (!fireworksRAF) return; // se detuvo la celebración
    ctx.clearRect(0, 0, width, height);

    if (time - lastLaunch > rand(700, 1300)) {
      launchFirework();
      lastLaunch = time;
    }

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.035; // gravedad suave
      p.life -= p.decay;
    });
    particles = particles.filter((p) => p.life > 0);

    particles.forEach((p) => {
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    fireworksRAF = requestAnimationFrame(frame);
  }

  fireworksRAF = requestAnimationFrame(frame);
}

/* -------------------------------------------------------------------------
   13. SISTEMA DE PARTÍCULAS COMPARTIDO (confeti / corazones / estrellas)
   ------------------------------------------------------------------------- */
const PARTICLE_COLORS = ['#f7cbe0', '#ade3fb', '#f2d38a', '#d3c0ef', '#fffaf3'];

function getFxLayer() {
  let layer = qs('#fx-layer');
  if (!layer) {
    layer = document.createElement('div');
    layer.id = 'fx-layer';
    layer.className = 'fx-layer';
    document.body.appendChild(layer);
  }
  return layer;
}

function spawnParticles({ confetti = 0, heart = 0, star = 0 } = {}) {
  const layer = getFxLayer();
  for (let i = 0; i < confetti; i++) spawnParticle(layer, 'confetti');
  for (let i = 0; i < heart; i++) spawnParticle(layer, 'heart');
  for (let i = 0; i < star; i++) spawnParticle(layer, 'star');
}

function spawnParticle(layer, type) {
  const el = document.createElement('div');
  const duration = rand(2.6, 4.6);
  const drift = rand(-120, 120);
  const spin = rand(360, 900) * (Math.random() > 0.5 ? 1 : -1);

  el.style.left = rand(0, 100) + 'vw';
  el.style.setProperty('--drift', drift + 'px');
  el.style.setProperty('--spin', spin + 'deg');
  el.style.animationDuration = duration + 's';
  el.style.animationDelay = rand(0, 0.4) + 's';

  if (type === 'confetti') {
    el.className = 'fx-particle fx-confetti';
    el.style.background = PARTICLE_COLORS[Math.floor(rand(0, PARTICLE_COLORS.length))];
  } else if (type === 'heart') {
    el.className = 'fx-particle fx-heart';
    el.textContent = '♥';
    el.style.color = PARTICLE_COLORS[Math.floor(rand(0, PARTICLE_COLORS.length))];
  } else {
    el.className = 'fx-particle fx-star';
    el.textContent = '✦';
    el.style.color = '#f2d38a';
  }

  el.addEventListener('animationend', () => el.remove());
  layer.appendChild(el);
}

/* -------------------------------------------------------------------------
   14. RESTAURAR ESTADO AL VOLVER A EMPEZAR
   ------------------------------------------------------------------------- */
function resetExperience() {
  resetLetter();
  carouselIndex = 0;
  updateCarousel();
  resetGiftBox();
  qs('#word-happy')?.classList.remove('is-visible');
  qs('#word-love')?.classList.remove('is-visible');
  qs('#btn-after-reveal')?.classList.remove('is-ready');
  qs('#btn-after-castle')?.classList.remove('is-ready');
}

/* Estado inicial de la barra de progreso */
updateProgressDots();
