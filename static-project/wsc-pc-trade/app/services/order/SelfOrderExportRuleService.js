const OrderBaseService = require('./OrderBaseService');

/**
 * 订单自定义字段导出相关
 */
class SelfOrderExportRuleService extends OrderBaseService {
  /**
   * SERVICE_NAME
   */
  get SERVICE_NAME() {
    return 'com.youzan.ebiz.mall.trade.seller.api.service.exportrule.SelfOrderExportRuleService';
  }

  /**
   * 查询是否存在已定义字段，已定义字段个数
   * api: http://zanapi.qima-inc.com/site/service/view/197707
   * @param {integer} kdtId
   */
  async definedExportRule(kdtId) {
    return this.invoke('definedExportRule', [kdtId]);
  }

  /**
   * 查询所有可自定义字段及已自定义字段
   * api: http://zanapi.qima-inc.com/site/service/view/197708
   * @param {integer} kdtId
   */
  async queryReportFields(kdtId) {
    return this.invoke('queryReportFields', [kdtId]);
  }

  /**
   * 新增/修改 导出自定义字段
   * api: http://zanapi.qima-inc.com/site/service/view/197709
   * @param {object} selfOrderExportDTO
   */
  async saveReportFields(selfOrderExportDTO) {
    return this.invoke('saveReportFields', [selfOrderExportDTO]);
  }
}

module.exports = SelfOrderExportRuleService;
