const BaseService = require('../../../base/BaseService');

/* com.youzan.ump.marketing.goodsscan.service.GoodsScanPromotionService -  */
class GoodsScanPromotionService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ump.marketing.goodsscan.service.GoodsScanPromotionService';
  }

  /**
             *  获取指定商品的所有扫码活动。
 页面点击推广会调用这里
*  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/303277
*
             *  @param {number} kdtId -
             *  @param {number} goodsId -
             *  @return {Promise}
             */
  async findActivities(kdtId, goodsId) {
    return this.invoke('findActivities', [kdtId, goodsId]);
  }
}

module.exports = GoodsScanPromotionService;
