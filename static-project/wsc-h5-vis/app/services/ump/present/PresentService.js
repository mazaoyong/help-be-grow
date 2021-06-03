const BaseService = require('../../base/BaseService');

/* com.youzan.owl.api.client.ump.present.PresentFacade -  */
class PresentService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.ump.present.PresentFacade';
  }

  /**
  *  C端查询赠品领取详情
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/689547
  *
  *  @param {number} kdtId - 店铺ID
  *  @param {Object} query - 赠品查询信息
  *  @param {string} query.orderNo - 订单号(赠品有主活动订单才传)
  *  @param {number} query.presentRecordId - 赠品记录id
  *  @param {number} query.presentSource - 赠品来源
  *  @param {string} query.alias - 商品alias
  *  @param {number} query.presentId - 赠品ID
  *  @param {number} query.receiveStatus - 领取状态 0: 未领取 1: 已领取
  *  @param {number} query.userId - 用户ID
  *  @return {Promise}
  */
  async listPresentsByCondition(kdtId, query) {
    const result = await this.invoke('listPresentsByCondition', [kdtId, query]);
    return result;
  }

  /**
   *  领取赠品
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/670868
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} receiveCommand - 领取请求
   *  @param {number} receiveCommand.studentId - 课程学员id, 线下课必填
   *  @param {string} receiveCommand.orderNo - 赠品关联的订单号（目前只有买赠需要传）
   *  @param {number} receiveCommand.presentSource - 赠品来源(买赠=16, 摇一摇=6, 幸运大抽奖=4)
   *  @param {string} receiveCommand.alias - 商品alias
   *  @param {Array.<Object>} receiveCommand.presentRecords[] - 赠品记录信息
   *  @param {number} receiveCommand.userId - 用户id
   *  @return {Promise}
   */
  async receivePresent(kdtId, receiveCommand) {
    const result = await this.invoke('receivePresent', [kdtId, receiveCommand], { timeout: 5000 });
    return result;
  }
}

module.exports = PresentService;
