import { ajax } from '@youzan/vis-ui';

/**
 * 获取直播间链接
 *
 * @param {string} alias 商品别名
 * @return {Promise}
 */
export const getEduLiveLink = alias => {
  return ajax({
    url: '/wscvis/course/live/edu/getEduLiveLink.json',
    data: {
      alias,
    },
  });
};

/**
 * 获取保利威直播间链接
 *
 * @param {string} alias 商品别名
 * @return {Promise}
 */
export const getPolyvLiveLink = alias => {
  return ajax({
    url: '/wscvis/knowledge/getLiveLink.json',
    data: {
      alias,
    },
    rawResponse: true,
  });
};
