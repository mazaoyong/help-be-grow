const ShopBaseService = require('./ShopBaseService');
const { appName } = require('../../constants');

/**
 * 店铺设置相关接口
 */
class WscShopService extends ShopBaseService {
  /**
   * SERVICE_NAME
   */
  get SERVICE_NAME() {
    return 'com.youzan.ebiz.mall.trade.seller.api.service.shop.WscShopService';
  }

  /**
   * 检查是否显示运费险广告
   * @param {number} kdtId
   * @param {number} userId
   */
  async checkIsShowFreightInsuranceBanner(kdtId, userId) {
    return this.invoke('isShowFreightInsuranceBanner', [
      {
        kdtId,
        source: {
          form: appName,
        },
        operator: {
          role: 'seller',
          operatorId: userId,
        },
      },
    ]);
  }

  /**
   * 不再显示运费险广告
   * @param {*} kdtId
   * @param {*} userId
   */
  async notShowFreightInsuranceBanner(kdtId, userId) {
    return this.invoke('notShowFreightInsuranceBanner', [
      {
        kdtId,
        source: {
          form: appName,
        },
        operator: {
          role: 'seller',
          operatorId: userId,
        },
      },
    ]);
  }

  /**
   *  获取店铺的所有子节点
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/426864
   *
   *  @param {number} headKdtId -
   *  @return {Promise}
   */
  async findShopNodeList(headKdtId) {
    return this.invoke('findShopNodeList', [headKdtId]);
  }
}

module.exports = WscShopService;
