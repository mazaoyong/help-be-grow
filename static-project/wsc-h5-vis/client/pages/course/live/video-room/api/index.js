import { ajax } from '@youzan/vis-ui';

/**
 * 获取直播间打赏开关
 *
 * @param {string} alias 商品别名
 * @return {Promise}
 */
export const getLiveSetting = alias => {
  return ajax({
    url: '/wscvis/course/live/video/getLiveSetting.json',
    data: {
      alias,
    },
  });
};

/**
 * 提交打赏金额
 *
 * @param {Object} data 商品别名
 * @return {Promise}
 */
export const createReward = data => {
  return ajax({
    method: 'POST',
    rawResponse: true,
    url: '/wscvis/course/live/video/creat.json',
    data,
  });
};
