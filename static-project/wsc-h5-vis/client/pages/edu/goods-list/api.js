import { ajax } from '@youzan/vis-ui';
const baseUrl = '/wscvis/edu';

export default {
  /**
   * 获取商品列表
   *
   * @param {Object} data 接口入参
   * @return {Promise}
   */
  fetchGoodsList(data) {
    return ajax({
      url: `${baseUrl}/goods-list.json`,
      data,
    });
  },
};
