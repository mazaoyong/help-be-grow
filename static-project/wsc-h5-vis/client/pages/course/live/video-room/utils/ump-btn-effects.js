// 安全边距
const SAFE_PADDING = 8;
const UMP_BTN_BOX_STATE = {
  moving: false,
  edge: {
    // [min, max]
    bottom: [SAFE_PADDING, 0],
    right: [SAFE_PADDING, 0],
  },
  frozen: {
    x: false,
    y: false,
  },
  // 触摸开始时离中心偏移量
  offsetCenter: {
    x: 0,
    y: 0,
  },
  currentPosition: {
    offsetRightX: 8,
    offsetBottomY: 72,
  },
};
const orientationType = (screen.orientation || {}).type || 'portrait-primary';
const orientation =
  orientationType === 'portrait-primary' ||
  orientationType === 'portrait-secondary'
    ? 'portrait'
    : 'landscape';
const DEVICE_INFO = {
  screenHeight:
    orientation === 'portrait'
      ? document.documentElement.clientHeight
      : document.documentElement.clientWidth,
  screenWidth:
    orientation === 'portrait'
      ? document.documentElement.clientWidth
      : document.documentElement.clientHeight,
};

/**
 * @description 右侧的营销按钮需要在页面滚动过程中将透明度设置成.7然后停止滚动之后恢复透明度，
 * **后续如果还有其他的跟业务逻辑无关的副作用，都写在这里**
 * @param {Array<'x' | 'y'>} [frozen] 冻结某个方向上的移动
 */
function umpBtnEffect(frozen) {
  setFrozenConfig(frozen || []);

  const umpBtnBox = document.getElementById('umpBtnBox');
  if (umpBtnBox) {
    // 初始化位置
    umpBtnBox.style.bottom = getPositionString(
      UMP_BTN_BOX_STATE.currentPosition.offsetBottomY,
    );
    umpBtnBox.style.right = getPositionString(
      UMP_BTN_BOX_STATE.currentPosition.offsetRightX,
    );

    umpBtnBox.addEventListener('touchstart', handleTouchStart);
    umpBtnBox.addEventListener('touchmove', handleTouchMove);
    umpBtnBox.addEventListener('touchend', handleTouchEnd);
  }
}

export default umpBtnEffect;

function setFrozenConfig(frozen) {
  const config = {};
  if (frozen.length) {
    frozen.forEach(key => {
      config[key] = true;
    });
    UMP_BTN_BOX_STATE.frozen = {
      ...UMP_BTN_BOX_STATE.frozen,
      ...config,
    };
  }
}

/**
 * @param {TouchEvent} evt 触摸事件
 * @param {number} [index=0] 第几个手指= =
 */
function getTouchInfo(evt, index) {
  const { touches } = evt;
  return touches.item(index || 0);
}

let timer = null;
function handleTouchStart(evt) {
  if (UMP_BTN_BOX_STATE.moving) return;
  timer && clearTimeout(timer);

  UMP_BTN_BOX_STATE.moving = true;
  UMP_BTN_BOX_STATE.edge.bottom[1] =
    DEVICE_INFO.screenHeight - SAFE_PADDING - this.offsetHeight;
  UMP_BTN_BOX_STATE.edge.right[1] =
    DEVICE_INFO.screenWidth - SAFE_PADDING - this.offsetWidth;

  // 延迟设置透明度，因为用户可能是想进行点击
  timer = setTimeout(() => {
    this.classList.add('moving');
  }, 300);

  const detectTouch = getTouchInfo(evt);
  if (detectTouch) {
    const { clientX, clientY } = detectTouch;
    UMP_BTN_BOX_STATE.offsetCenter = {
      x: Math.floor(this.offsetWidth - (clientX - this.offsetLeft)),
      y: Math.floor(this.offsetHeight - (clientY - this.offsetTop)),
    };
  }
}

function handleTouchMove(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  return requestAnimationFrame(() => {
    const detectTouch = getTouchInfo(evt);
    if (detectTouch) {
      const { clientX, clientY } = detectTouch;
      const curOffsetRightX = Math.floor(
        DEVICE_INFO.screenWidth - clientX - UMP_BTN_BOX_STATE.offsetCenter.x,
      );
      if (
        curOffsetRightX >= UMP_BTN_BOX_STATE.edge.right[0] &&
        curOffsetRightX <= UMP_BTN_BOX_STATE.edge.right[1]
      ) {
        !UMP_BTN_BOX_STATE.frozen.x &&
          (this.style.right = getPositionString(curOffsetRightX));
        UMP_BTN_BOX_STATE.currentPosition.offsetRightX = curOffsetRightX;
      }

      const curOffsetBottomY = Math.floor(
        DEVICE_INFO.screenHeight - clientY - UMP_BTN_BOX_STATE.offsetCenter.y,
      );
      if (
        curOffsetBottomY >= UMP_BTN_BOX_STATE.edge.bottom[0] &&
        curOffsetBottomY <= UMP_BTN_BOX_STATE.edge.bottom[1]
      ) {
        !UMP_BTN_BOX_STATE.frozen.y &&
          (this.style.bottom = getPositionString(curOffsetBottomY));
        UMP_BTN_BOX_STATE.currentPosition.offsetBottomY = curOffsetBottomY;
      }
    }
  });
}

function handleTouchEnd() {
  timer && clearTimeout(timer);

  UMP_BTN_BOX_STATE.moving = false;
  this.classList.remove('moving');
}

function getPositionString(num) {
  return num + 'px';
}
