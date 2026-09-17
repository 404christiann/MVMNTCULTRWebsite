(() => {
  const stage = document.querySelector('.logo-marquee');
  if (!stage) return;
  // The original duplicated strip remains the fallback when JavaScript is off.
  const originals = [...stage.querySelectorAll('img')].filter((image, index, images) =>
    images.findIndex(candidate => candidate.getAttribute('src') === image.getAttribute('src')) === index
  );
  if (!originals.length) return;
  stage.classList.add('depth-carousel');
  stage.setAttribute('role', 'img');
  stage.setAttribute('aria-label', 'MVMNT CULTR partner logos');
  const items = originals.map(img => {
    const item = document.createElement('span');
    item.className = 'depth-logo';
    item.setAttribute('aria-hidden', 'true');
    img.draggable = false;
    img.alt = '';
    item.append(img);
    return item;
  });
  stage.replaceChildren(...items);

  let width = 0, gap = 0, phase = 0, last = performance.now();
  const wrap = (value, range) => ((value % range) + range) % range;
  function advance(time) {
    if (gap) phase = wrap(phase + (time - last) / 1000 * 60 / gap, items.length);
    last = time;
  }
  function draw() {
    const total = gap * items.length;
    items.forEach((item, index) => {
      const x = wrap((index - phase) * gap + total / 2, total) - total / 2;
      const distance = Math.min(1, Math.abs(x) / (width * .52));
      const scale = 1 - .48 * distance ** 1.45;
      item.style.transform = `translate(-50%, -50%) translateX(${x.toFixed(2)}px) scale(${scale.toFixed(3)})`;
      item.style.opacity = String(1 - .76 * distance ** 2.4);
      item.style.filter = `blur(${((width <= 600 ? .8 : 1.6) * distance ** 2.5).toFixed(2)}px)`;
      item.style.visibility = Math.abs(x) > width / 2 + 110 ? 'hidden' : 'visible';
    });
  }
  function resize() {
    advance(performance.now());
    width = stage.clientWidth;
    gap = width <= 600 ? Math.max(118, Math.min(145, width * .35)) : Math.max(174, Math.min(234, width * .185));
    if (width) draw();
  }
  function animate(time) {
    // Elapsed time preserves the loop position when the browser suspends a background tab.
    // Hover, focus and pointer interactions never change playback.
    advance(time);
    if (width) draw();
    requestAnimationFrame(animate);
  }
  resize();
  new ResizeObserver(resize).observe(stage);
  requestAnimationFrame(animate);
})();
