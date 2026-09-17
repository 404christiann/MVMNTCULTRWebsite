(() => {
  const stage = document.querySelector('.logo-marquee');
  if (!stage) return;
  const originals = [...stage.querySelectorAll('img')].slice(0, 13);
  stage.classList.add('depth-carousel');
  stage.setAttribute('role', 'region');
  stage.setAttribute('aria-roledescription', 'carousel');
  stage.setAttribute('aria-label', 'Our partners. Use the arrow keys or swipe to explore.');
  stage.tabIndex = 0;
  const items = originals.map((img, index) => {
    const item = document.createElement('span');
    item.className = 'depth-logo';
    img.draggable = false;
    img.alt = `Partner logo ${index + 1} of ${originals.length}`;
    item.append(img);
    return item;
  });
  stage.replaceChildren(...items);
  const controls = document.createElement('div');
  controls.className = 'depth-controls';
  controls.innerHTML = '<button type="button" aria-label="Previous partner">&#8592;</button><button type="button" class="depth-pause" aria-label="Pause carousel">❚❚</button><button type="button" aria-label="Next partner">&#8594;</button>';
  stage.after(controls);
  const [previous, pause, next] = controls.children;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = motion.matches, visible = false, hovering = false, focused = false;
  let offset = 0, width = 0, gap = 0, raf = 0, last = 0, pointer = null;
  const wrap = (value, range) => ((value % range) + range) % range;
  function draw() {
    const total = gap * items.length;
    items.forEach((item, i) => {
      const x = wrap(i * gap - offset + total / 2, total) - total / 2;
      const distance = Math.min(1, Math.abs(x) / (width * .52));
      const depth = distance ** 1.45;
      const scale = 1 - .48 * depth;
      item.style.transform = `translate(-50%, -50%) translateX(${x.toFixed(2)}px) scale(${scale.toFixed(3)})`;
      item.style.opacity = String(1 - .76 * distance ** 2.4);
      item.style.filter = `blur(${((width <= 600 ? .8 : 1.6) * distance ** 2.5).toFixed(2)}px)`;
      item.style.visibility = Math.abs(x) > width / 2 + 110 ? 'hidden' : 'visible';
    });
  }
  function active() { return visible && !document.hidden && !paused && !hovering && !focused && !pointer; }
  function animate(time) {
    raf = 0;
    if (!active()) { last = 0; return; }
    if (last) offset += Math.min(time - last, 50) / 1000 * (width <= 600 ? 18 : 28);
    last = time;
    offset = wrap(offset, gap * items.length);
    draw();
    raf = requestAnimationFrame(animate);
  }
  function sync() {
    if (!active()) { cancelAnimationFrame(raf); raf = 0; last = 0; }
    else if (!raf) raf = requestAnimationFrame(animate);
  }
  function updatePause() {
    pause.innerHTML = paused ? '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.5 10 6 3 10.5Z" fill="currentColor"/></svg>' : '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 2v8M9 2v8" stroke="currentColor" stroke-width="2"/></svg>';
    pause.setAttribute('aria-label', paused ? 'Play carousel' : 'Pause carousel');
    pause.setAttribute('aria-pressed', String(paused));
    sync();
  }
  function step(direction) { offset = Math.round(offset / gap) * gap + direction * gap; draw(); }
  new ResizeObserver(() => {
    const oldGap = gap;
    width = stage.clientWidth;
    gap = width <= 600 ? Math.max(118, Math.min(145, width * .35)) : Math.max(174, Math.min(234, width * .185));
    if (oldGap) offset = offset / oldGap * gap;
    draw();
  }).observe(stage);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }).observe(stage);
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', () => { paused = motion.matches; updatePause(); draw(); });
  stage.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { hovering = true; sync(); } });
  stage.addEventListener('pointerleave', () => { hovering = false; sync(); });
  stage.addEventListener('focus', () => { focused = true; sync(); });
  stage.addEventListener('blur', () => { focused = false; sync(); });
  stage.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    pointer = { id: e.pointerId, x: e.clientX, y: e.clientY, offset, horizontal: false };
    sync();
  });
  stage.addEventListener('pointermove', e => {
    if (!pointer || e.pointerId !== pointer.id) return;
    const dx = e.clientX - pointer.x, dy = e.clientY - pointer.y;
    if (!pointer.horizontal) {
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) { pointer = null; sync(); return; }
      if (Math.abs(dx) < 6) return;
      pointer.horizontal = true;
      stage.setPointerCapture(e.pointerId);
      stage.classList.add('is-dragging');
    }
    offset = pointer.offset - dx;
    draw();
  });
  function release() { pointer = null; stage.classList.remove('is-dragging'); sync(); }
  window.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);
  stage.addEventListener('lostpointercapture', release);
  stage.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); step(e.key === 'ArrowRight' ? 1 : -1); }
  });
  previous.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  pause.addEventListener('click', () => { paused = !paused; updatePause(); });
  updatePause();
})();
