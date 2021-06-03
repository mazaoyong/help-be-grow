const BaseService = require('../base/BaseService');

/**
 * 零售组件相关接口
 */
class ComponentService extends BaseService {
  /**
   * @return {string}
   */
  get SERVICE_NAME() {
    return 'com.youzan.retail.ump.biz.api.service.ComponentService';
  }

  /**
   * 获取优惠组简要信息
   * http://zanapi.qima-inc.com/site/service/view/55438
   *
   * @param {number} kdtId
   * @param {number} adminId
   * @param {number} pageNo
   * @param {number} pageSize
   * @param {string} keyword
   * @return {Promise<any>}
   */
  async findCouponGroupList({ kdtId, adminId, pageNo, pageSize, keyword }) {
    const params = {
      kdtId,
      adminId,
      pageNo,
      pageSize,
      retailSource: 'wsc-pc-ump',
      type: 'wsc-pc-ump',
    };
    if (keyword) {
      params.keyword = keyword;
    }
    return this.invoke('findCouponGroupList', [params]);
  }

  /**
   * 批量获取优惠券组信息
   * http://zanapi.qima-inc.com/site/service/view/55439
   *
   * @param {number} kdtId - kdtId
   * @param {number} adminId - 操作人id
   * @param {Array<string>} ids
   * @return {Promise<any>}
   */
  async getsCouponGroup({ kdtId, adminId, ids }) {
    const result = await this.invoke('getsCouponGroup', [
      {
        kdtId,
        adminId,
        ids,
        retailSource: 'wsc-pc-vis', // 请求来源,系统名称或前端终端(替代source)
        type: 'wsc-pc-vis',
      },
    ]);

    return result;
  }
}

module.exports = ComponentService;
