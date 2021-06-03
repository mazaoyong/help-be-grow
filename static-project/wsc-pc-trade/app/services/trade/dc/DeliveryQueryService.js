const DcBaseService = require('./DcBaseService');

/**
 * 发货查询
 */
class DeliveryQueryService extends DcBaseService {
  get SERVICE_NAME() {
    return 'com.youzan.trade.dc.api.service.query.DeliveryQueryService';
  }

  /**
   *  根据单号查询发货单列表信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/125586
   *
   *  @param {Object} queryRequestDTO -
   *  @param {Object} queryRequestDTO.queryParamOption - 发货查询选项
   *  @param {string} queryRequestDTO.orderNo - 订单号
   *  @param {number} queryRequestDTO.kdtId - 店铺id
   *  @return {Promise}
   */
  async queryByOrderNo(queryRequestDTO) {
    return this.invoke('queryByOrderNo', [queryRequestDTO]);
  }
}

module.exports = DeliveryQueryService;
