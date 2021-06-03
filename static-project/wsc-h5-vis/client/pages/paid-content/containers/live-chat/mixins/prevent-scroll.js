const _ = {
  getScrollEventTarget(element, rootParent = window) {
    let currentNode = element;
    // bugfix, see http://w3help.org/zh-cn/causes/SD9013 and http://stackoverflow.com/questions/17016740/onscroll-function-is-not-working-for-chrome
    while (currentNode && currentNode.tagName !== 'HTML' && currentNode.tagName !== 'BODY' && currentNode.nodeType === 1) {
      const overflowY = this.getComputedStyle(currentNode).overflowY;
      if (overflowY === 'scroll' || overflowY === 'auto') {
        return currentNode;
      }
      currentNode = currentNode.parentNode;
      if (currentNode === rootParent) {
        return currentNode;
      }
    }
    return false;
  },
  getComputedStyle: document.defaultView.getComputedStyle.bind(document.defaultView),
};

const pos = {
  x: 0,
  y: 0,
};

export default {
  methods: {
    _stopEvent(e) {
      e.preventDefault();
      e.stopPropagation();
    },
    _recordPosition(e) {
      pos.x = e.touches[0].clientX;
      pos.y = e.touches[0].clientY;
    },
    _watchTouchMove(e) {
      const currEle = e.target;
      const parent = _.getScrollEventTarget(e.target, document.querySelector('.js-scroller'));
      let el = null;
      if (currEle.classList.contains('js-scroller')) {
        el = currEle;
      } else if (parent) {
        el = parent;
      } else {
        return this._stopEvent(e);
      }
      const dx = e.touches[0].clientX - pos.x;
      const dy = e.touches[0].clientY - pos.y;
      const direction = dy > 0 ? '10' : '01';
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight;
      const offsetHeight = el.offsetHeight;
      const isVertical = Math.abs(dx) < Math.abs(dy);
      let status = '11';
      if (scrollTop === 0) {
        status = offsetHeight >= scrollHeight ? '00' : '01';
      } else if (scrollTop + offsetHeight >= scrollHeight) {
        status = '10';
      }

      if (status !== '11' && isVertical && !(parseInt(status, 2) & parseInt(direction, 2))) return this._stopEvent(e);
    },
  },
  mounted() {
    document.addEventListener('touchstart', this._recordPosition, { passive: false });
    document.addEventListener('touchmove', this._watchTouchMove, { passive: false });
  },
  destroyed() {
    document.removeEventListener('touchstart', this._recordPosition, { passive: false });
    document.removeEventListener('touchmove', this._watchTouchMove, { passive: false });
  },
};
