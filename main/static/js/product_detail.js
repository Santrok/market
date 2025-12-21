document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('sliderTrack');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const dotsWrap = document.getElementById('sliderDots');
  const thumbs = document.getElementById('thumbs');
  const playBtn = document.getElementById('sliderPlay');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxZoom = document.getElementById('lightboxZoom');

  const slides = track ? Array.from(track.children) : [];
  const total = slides.length;
  let index = 0;
  let autoplay = true;
  let intervalId = null;
  const AUTOPLAY_DELAY = 4000;

  // Build dots
  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const btn = document.createElement('button');
      btn.className = 'slider-dot';
      btn.setAttribute('aria-label', `Слайд ${i + 1}`);
      btn.dataset.index = i;
      if (i === 0) btn.classList.add('active');
      dotsWrap.appendChild(btn);
    }
  }

  // Update slider position
  function updateSlider() {
    if (!track) return;
    const width = track.parentElement.clientWidth;
    track.style.transform = `translateX(-${index * width}px)`;
    // update dots
    dotsWrap?.querySelectorAll('.slider-dot').forEach((d, i) => d.classList.toggle('active', i === index));
    // update thumbs
    thumbs?.querySelectorAll('.thumb').forEach((t, i) => t.classList.toggle('active', i === index));
  }

  function goTo(i) {
    index = Math.max(0, Math.min(i, total - 1));
    updateSlider();
  }

  function next() { goTo(index + 1); if (index === total) goTo(0); }
  function prev() { goTo(index - 1); if (index === 0) goTo(0); }

  // Autoplay
  function startAutoplay() {
    stopAutoplay();
    intervalId = setInterval(() => {
      index = (index + 1) % total;
      updateSlider();
    }, AUTOPLAY_DELAY);
    autoplay = true;
    if (playBtn) playBtn.textContent = '⏸';
  }
  function stopAutoplay() {
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
    autoplay = false;
    if (playBtn) playBtn.textContent = '▶';
  }
  function toggleAutoplay() { if (autoplay) stopAutoplay(); else startAutoplay(); }

  // Events
  nextBtn?.addEventListener('click', () => { next(); stopAutoplay(); });
  prevBtn?.addEventListener('click', () => { prev(); stopAutoplay(); });

  dotsWrap?.addEventListener('click', (e) => {
    const btn = e.target.closest('.slider-dot');
    if (!btn) return;
    goTo(Number(btn.dataset.index));
    stopAutoplay();
  });

  thumbs?.addEventListener('click', (e) => {
    const btn = e.target.closest('.thumb');
    if (!btn) return;
    const i = Number(btn.dataset.index || Array.from(thumbs.children).indexOf(btn));
    goTo(i);
    stopAutoplay();
  });

  playBtn?.addEventListener('click', toggleAutoplay);

  // Resize
  window.addEventListener('resize', updateSlider);

  // Swipe support
  let startX = 0, deltaX = 0, dragging = false;
  track?.addEventListener('pointerdown', (e) => {
    dragging = true;
    startX = e.clientX;
    track.style.transition = 'none';
    track.setPointerCapture(e.pointerId);
  });
  track?.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    deltaX = e.clientX - startX;
    const width = track.parentElement.clientWidth;
    track.style.transform = `translateX(${ -index * width + deltaX }px)`;
  });
  track?.addEventListener('pointerup', (e) => {
    if (!dragging) return;
    dragging = false;
    track.style.transition = '';
    const width = track.parentElement.clientWidth;
    if (Math.abs(deltaX) > width * 0.15) {
      if (deltaX < 0) index = Math.min(index + 1, total - 1);
      else index = Math.max(index - 1, 0);
    }
    deltaX = 0;
    updateSlider();
    stopAutoplay();
    try { track.releasePointerCapture(e.pointerId); } catch (err) {}
  });
  track?.addEventListener('pointercancel', () => { dragging = false; deltaX = 0; updateSlider(); });

  // Lightbox
  function openLightbox(src) {
    if (!src || !lightbox) return;
    lightboxImage.src = src;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImage.src = '';
    document.body.style.overflow = '';
  }

  // Open lightbox on click/dblclick of current slide
  track?.addEventListener('click', (e) => {
    const slide = e.target.closest('.slide');
    if (!slide) return;
    const src = slide.dataset.src || slide.querySelector('img')?.src;
    openLightbox(src);
  });
  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

  // Zoom toggle
  let zoomed = false;
  lightboxZoom?.addEventListener('click', () => {
    zoomed = !zoomed;
    lightboxImage.style.transform = zoomed ? 'scale(2)' : 'scale(1)';
    lightboxZoom.textContent = zoomed ? '—' : '🔍';
  });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (lightbox?.classList.contains('open')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') { index = Math.min(index + 1, total - 1); openLightbox(slides[index].dataset.src); }
      if (e.key === 'ArrowLeft') { index = Math.max(index - 1, 0); openLightbox(slides[index].dataset.src); }
    } else {
      if (e.key === 'ArrowRight') { index = Math.min(index + 1, total - 1); updateSlider(); stopAutoplay(); }
      if (e.key === 'ArrowLeft') { index = Math.max(index - 1, 0); updateSlider(); stopAutoplay(); }
    }
  });

  // Init dots and autoplay
  buildDots();
  updateSlider();
  startAutoplay();

  // Pause autoplay on hover/focus
  const sliderEl = document.getElementById('slider');
  sliderEl?.addEventListener('mouseenter', stopAutoplay);
  sliderEl?.addEventListener('mouseleave', startAutoplay);
  sliderEl?.addEventListener('focusin', stopAutoplay);
  sliderEl?.addEventListener('focusout', startAutoplay);

  // Ensure thumbs have data-index
  if (thumbs) {
    thumbs.querySelectorAll('.thumb').forEach((t, i) => t.dataset.index = i);
  }
});
