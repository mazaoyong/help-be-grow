/**
 * 拖拽
 * @param moveDownEvent
 * @param movingCallback
 * @param endCallback
 */
import throttle from 'lodash/throttle';
export function drag({ moveDownEvent, movingCallback, endCallback }) {
  let moveInfo = {};
  let isMove = false;
  let isDown = true;
  let currentLeft = 0;
  let currentTop = 0;
  const elm = moveDownEvent.currentTarget;
  const { height } = elm.getBoundingClientRect();

  const mouseDown = function() {
    document.body.addEventListener('drag', throttle(mouseDrag, 150), false);
    document.body.addEventListener('dragend', mouseUp, false);
    /* 放置目标元素时触发事件 */
    document.body.addEventListener(
      'dragover',
      function(event) {
        currentLeft = event.clientX;
        currentTop = event.clientY;
        // 阻止默认动作以启用drop
        event.stopPropagation();
        event.preventDefault();
      },
      false,
    );
    document.body.addEventListener(
      'drop',
      function(event) {
        // prevent default action (open as link for some elements)
        event.preventDefault();
      },
      false,
    );
  };

  const mouseDrag = function(event) {
    if (isDown) {
      isMove = true;
      moveInfo = {
        currentLeft,
        currentTop,
        height,
      };
      if (typeof movingCallback === 'function') {
        movingCallback(Object.assign({ event }, moveInfo));
      }
    }
  };

  const mouseUp = function(event) {
    isDown = false;
    if (isMove) {
      isMove = false;
      moveInfo = {
        currentLeft,
        currentTop,
        height,
      };
      if (typeof endCallback === 'function') {
        endCallback(Object.assign({ event }, moveInfo));
      }
      document.body.removeEventListener('drag', mouseDrag, false);
      document.body.removeEventListener('dragend', mouseUp, false);
      document.body.removeEventListener('drop', mouseUp, false);
      document.body.removeEventListener('dragover', mouseUp, false);
    }
  };

  mouseDown();
}
