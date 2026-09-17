const title = document.querySelector('#approach-title');
const titleText = title.textContent;
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
let mode = 'reveal';
let previewReduced = false;
let slowMotion = false;
let animations = [];
let run = 0;

function clearMotion() {
  animations.forEach(animation => animation.cancel());
  animations = [];
  title.replaceChildren();
  const accessible = document.createElement('span');
  accessible.className = 'sr-only';
  accessible.textContent = titleText;
  const visual = document.createElement('span');
  visual.className = 'motion-visual';
  visual.setAttribute('aria-hidden', 'true');
  title.append(accessible, visual);
  return visual;
}

function animate(element, frames, options) {
  const animation = element.animate(frames, {...options, fill:'both'});
  animation.playbackRate = slowMotion ? 0.3 : 1;
  animations.push(animation);
  return animation;
}

function report(status) {
  parent.postMessage({type:'method-motion-status', status, mode, height:Math.ceil(document.querySelector('main').getBoundingClientRect().height)}, '*');
}

function play() {
  const thisRun = ++run;
  const visual = clearMotion();
  if (motionPreference.matches || previewReduced) {
    visual.textContent = titleText;
    report('Reduced motion: static heading');
    return;
  }

  if (mode === 'sweep') {
    visual.textContent = titleText;
    visual.classList.add('motion-shine');
    animate(visual, [{backgroundPosition:'100% 0'}, {backgroundPosition:'0% 0'}], {
      duration:1450, easing:'cubic-bezier(.4,0,.2,1)'
    });
  } else {
    let letterIndex = 0;
    titleText.split(' ').forEach((word, wordIndex) => {
      if (wordIndex) visual.append(document.createTextNode(' '));
      const mask = document.createElement('span');
      mask.className = 'motion-mask';
      const wordElement = document.createElement('span');
      wordElement.className = 'motion-word';
      mask.append(wordElement);
      visual.append(mask);
      if (mode === 'reveal') {
        wordElement.textContent = word;
        animate(wordElement, [
          {transform:'translateY(110%)', opacity:0},
          {transform:'translateY(0)', opacity:1}
        ], {duration:760, delay:wordIndex*120, easing:'cubic-bezier(.16,1,.3,1)'});
      } else {
        for (const letter of word) {
          const span = document.createElement('span');
          span.className = 'motion-letter';
          span.textContent = letter;
          wordElement.append(span);
          animate(span, [
            {transform:'perspective(400px) translateY(-.7em) rotateX(95deg)', opacity:0},
            {transform:'perspective(400px) translateY(0) rotateX(0deg)', opacity:1}
          ], {duration:620, delay:letterIndex++*35, easing:'cubic-bezier(.2,.8,.2,1)'});
        }
      }
    });
  }
  report('Playing');
  Promise.all(animations.map(animation => animation.finished)).then(() => {
    if(thisRun !== run) return;
    // Return to the original text rendering after the entrance.
    const finalVisual = clearMotion();
    finalVisual.textContent = titleText;
    report('Finished · replay to compare');
  }).catch(() => {});
}

addEventListener('message', event => {
  if(event.source !== parent || event.data?.type !== 'method-motion-preview') return;
  if(!['reveal','roll','sweep'].includes(event.data.mode)) return;
  mode = event.data.mode;
  previewReduced = event.data.reduced === true;
  slowMotion = event.data.slow === true;
  play();
});
motionPreference.addEventListener('change', play);
new ResizeObserver(() => report(motionPreference.matches || previewReduced ? 'Reduced motion: static heading' : animations.length ? 'Playing' : 'Finished · replay to compare')).observe(document.querySelector('main'));
document.fonts.ready.then(play);
