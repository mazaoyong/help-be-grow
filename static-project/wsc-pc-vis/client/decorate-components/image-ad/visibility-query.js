import delay from 'lodash/delay';

function getViewportHeight() {
  return Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  );
}

export function getClipSize(node) {
  return new Promise((resolve, reject) => {
    let retryTimes = 0;
    const step = () => {
      const bb = node.getBoundingClientRect();

      // skip initial position
      if (retryTimes < 10 && bb.left === bb.top && bb.left === -100000) {
        retryTimes++;
        return delay(step, 16);
      }

      const viewportHeight = getViewportHeight();

      const maxBottom = viewportHeight;
      if (bb.bottom > maxBottom) {
        return resolve(bb.height - bb.bottom + maxBottom);
      }

      const minTop = 0;
      if (bb.top < minTop) {
        return resolve(bb.height + bb.top);
      }

      reject(0);
    };
    step();
  });
}
