let prev = Date.now();

function fallback(fn) {
  const curr = Date.now();
  const ms = Math.max(0, 16 - (curr - prev));
  const id = setTimeout(fn, ms);
  prev = curr + ms;
  return id;
}

const iRaf = window.requestAnimationFrame || fallback;

function raf(fn) {
  return iRaf.call(window, fn);
}

function getRootScrollTop() {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

function setScrollTop(element, value) {
  'scrollTop' in element ? (element.scrollTop = value) : element.scrollTo(element.scrollX, value);
}

function setRootScrollTop(value) {
  setScrollTop(window, value);
  setScrollTop(document.body, value);
}

export function getElementTop(element) {
  return (
    (element === window ? 0 : element.getBoundingClientRect().top) +
    getRootScrollTop()
  );
}

export function getVisibleTop(element) {
  return element === window ? 0 : element.getBoundingClientRect().top;
}

export function scrollTopTo(to, duration, cb) {
  let current = getRootScrollTop();
  const isDown = current < to;
  const frames = duration === 0 ? 1 : Math.round((duration * 1000) / 16);
  const step = (to - current) / frames;

  function animate() {
    current += step;

    if ((isDown && current > to) || (!isDown && current < to)) {
      current = to;
    }

    setRootScrollTop(current);

    if ((isDown && current < to) || (!isDown && current > to)) {
      raf(animate);
    } else {
      cb && cb();
    }
  }

  animate();
}
