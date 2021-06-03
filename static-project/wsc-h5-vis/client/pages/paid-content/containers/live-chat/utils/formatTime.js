import get from 'lodash/get';
/**
 * formatTime
 * 给部分条目展示时间信息
 */
const FIDD_TIME = 5 * 60 * 1000;
const formatTime = (list) => {
  if (Array.isArray(list) && list.length > 0) {
    let initTime;
    list.reduce((all, curr) => {
      const currTime = curr.fromMsg.createTime;
      if (!all.length || (currTime - initTime > FIDD_TIME)) {
        initTime = currTime;
      }
      curr.showTime = initTime;
      return [...all, curr];
    }, []);
  }
};

/**
 * formatLastTime
 *
 * @param {Array} list
 * 给最后一条 item 设置时间展示
 */
const formatLastTime = (list, index = -1) => {
  if (Array.isArray(list) && list.length > 0) {
    let last;
    let lastSecond;
    if (index === -1) {
      last = list[list.length - 1];
      lastSecond = list[list.length - 2];
    } else {
      last = list[index];
      lastSecond = list[index - 1];
    }
    console.info('[utils formatLastTime] last.fromMsg.createTime', get(last, 'fromMsg.createTime'));
    console.info('[utils formatLastTime] lastSecond.showTime', get(lastSecond, 'showTime', 0));
    if (get(last, 'fromMsg.createTime', 0) - get(lastSecond, 'showTime', 0) > FIDD_TIME || !lastSecond) {
      last.showTime = last.fromMsg.createTime;
    } else if (lastSecond) {
      last.showTime = lastSecond.showTime || 0;
    }
  }
};

export default formatTime;
export { formatLastTime };
