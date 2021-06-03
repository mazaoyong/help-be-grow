const BaseService = require('../base/BaseService');

/**
 *  com.youzan.scrm.api.verification.service.BenefitVerificateExportService -
 */
class BenefitVerificateExportService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.scrm.api.verification.service.BenefitVerificateExportService';
  }

  /**
   *  权益导出接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/529946
   *
   *  @param {Object} searchDTO -
   *  @param {string} searchDTO.beginAt - 开始时间
   *  @param {number} searchDTO.kdtId - 店铺id
   *  @param {number} searchDTO.pluginId - 权益元件Id
   *  @param {string} searchDTO.appName -
   *  @param {Object} searchDTO.carrierTplInfo - 权益来源Id
   *  @param {number} searchDTO.sourceKdtId - 店铺来源id
   *  @param {number} searchDTO.pageSize - 每页查询数量
   *  @param {string} searchDTO.endAt - 结束时间
   *  @param {number} searchDTO.userId - 客户id
   *  @param {string} searchDTO.requestId -
   *  @param {number} searchDTO.page - 查询页码
   *  @param {string} searchDTO.keyword - 关键字
   *  @param {number} searchDTO.operatorId - 操作员
   *  @return {Promise}
   */
  async export(searchDTO) {
    return this.invoke('export', [searchDTO]);
  }
}

module.exports = BenefitVerificateExportService;
