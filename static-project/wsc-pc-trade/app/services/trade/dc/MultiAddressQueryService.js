const DcBaseService = require('./DcBaseService');
/**
 * 送礼子订单物流相关接口
 * @extends BusinessBaseService
 */
class MultiAddressQueryService extends DcBaseService {
  /**
   * service name
   */
  get SERVICE_NAME() {
    return 'com.youzan.trade.dc.api.service.query.MultiAddressQueryService';
  }

  /**
   * 获取物流信息
   * @param {*} params config
   *
   * 文档: http://zanapi.qima-inc.com/site/service/view/204425
   */
  async queryDistOrderByRecordNo(params) {
    return this.invoke('queryDistOrderByRecordNo', [params]);
  }
}

module.exports = MultiAddressQueryService;
