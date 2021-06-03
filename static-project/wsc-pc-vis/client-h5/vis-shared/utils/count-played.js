/**
 * 用于上传统计各业务视频播放量的埋点事件
 */

const VALID_TIME = 5000;
// 已播放的 videoId
const videoedMap = {};

/**
 * v-count-played="{ channel: '', videoId: '', component }"
 */
export const drective = {
  bind: bindFn,
};

// 注册一个指令，可以直接在 video 标签上使用
export const mixin = {
  directives: {
    countPlayed: drective,
  },
};

export function bindFn(el, {
  value: {
    channel,
    videoId,
    component,
  } = {},
}) {
  bindEl(el, {
    channel,
    videoId,
    component,
  });
}

/**
 * 如果能获取到元素，可以选择这种使用方式
 *
 * @param {HTMLVideoElement} el 视频元素
 * @param {Object} param1 channel, videoId, component
 */
export function bindEl(el, {
  channel,
  videoId,
  component,
}) {
  if (el) {
    el.addEventListener('play', () => {
      setValidTimer({
        channel,
        videoId,
        component,
      });
    });
  }
}

// 如果已经监听了video的play事件，直接在play事件的回调中调用这个方法就行
export function setValidTimer({
  channel,
  videoId,
  component,
}) {
  if (!videoedMap[videoId]) {
    setTimeout(() => {
      countVideoPlayed({
        channel,
        videoId,
        component,
      });
    }, VALID_TIME);
  }
}

// 单纯地上传埋点事件
export function countVideoPlayed({
  channel = '',
  videoId = '',
  component = '',
}) {
  if (!videoId) return;

  window.yzlogInstance && window.yzlogInstance.log({
    et: 'custom',
    ei: 'video_valid_played',
    en: '视频有效播放',
    params: {
      partner_biz_id: _global.kdt_id || _global.kdtId,
      partner_biz_type: 1,
      video_id: videoId,
      channel,
      component,
    },
  });
  videoedMap[videoId] = videoId;
}
