const BaseService = require('../../base/BaseService');

/** com.youzan.shopcenter.outer.service.shop.ShopTopicModifyOuterService -  */
class ShopTopicModifyOuterService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.shopcenter.outer.service.shop.ShopTopicModifyOuterService';
  }

  /**
   *  保存微商城升级有赞教育临时类目
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/366620
   *
   *  @param {number} kdtId - 店铺kdtId
   *  @param {number} businessId - 店铺类目id
   *  @return {Promise}
   */
  async saveWsc2EduTmpBusinessId(kdtId, businessId) {
    return this.invoke('saveWsc2EduTmpBusinessId', [kdtId, businessId]);
  }
}

module.exports = ShopTopicModifyOuterService;
