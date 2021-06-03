const BaseService = require('../../../base/BaseService');

/* com.youzan.ump.marketing.seckill.service.SeckillPromotionService -  */
class SeckillPromotionService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ump.marketing.seckill.service.SeckillPromotionService';
  }

  /**
   *  秒杀提醒，秒杀预约提醒
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/566070
   *
   *  @param {Object} remindInfo -
   *  @param {number} remindInfo.fansId -
   *  @param {number} remindInfo.seckillId -
   *  @param {number} remindInfo.kdtId -
   *  @param {number} remindInfo.buyerId -
   *  @param {number} remindInfo.fansType -
   *  @return {Promise}
   */
  async remind(remindInfo) {
    return this.invoke('remind', [remindInfo]);
  }
}

module.exports = SeckillPromotionService;
