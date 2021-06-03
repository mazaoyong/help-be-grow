const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.api.shop.ShopFacade -  */
class ShopFacade extends BaseService {
  get SHOP_COURSE_SETTING_FACADE() {
    return 'com.youzan.owl.api.shop.ShopFacade';
  }

  /**
   *  获取店铺名称
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/720797
   *
   *  @param {number} kdtId - 店铺id
   *  @return {Promise}
   */
  async getShopName(kdtId) {
    const result = await this.owlInvoke(this.SHOP_COURSE_SETTING_FACADE, 'getShopName', [kdtId]);

    return result;
  }
}

module.exports = ShopFacade;
