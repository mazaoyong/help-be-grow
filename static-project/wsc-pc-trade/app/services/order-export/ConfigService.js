const BaseService = require('../base/BaseService');

/**
 *
 * @class ConfigService
 * @extends {BaseService}
 */
class ConfigService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.trade.orderexport.api.v2.service.ConfigService';
  }

  /**
   * 按照条件获取可配置的报表字段
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/292602
   *
   * @param {Object} fetchFieldsParam -
   * @param {string} fetchFieldsParam.exportType - 报表类型, 见 ExportAPIConstants.[STANDARD,CUSTOMIZED]
   * @param {string} fetchFieldsParam.source - 调用源
   * @param {string} fetchFieldsParam.dimension - 导出维度, 见 ExportDimension: order, goods
   * @return {Promise}
   */
  async fetchReportFieldsV2(fetchFieldsParam) {
    return this.invoke('fetchReportFieldsV2', [fetchFieldsParam]);
  }

  /**
   * 获取商家自定义的报表配置
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/126080
   *
   * @param {Object} query -
   * @param {string} query.bizType - 导出业务类型, order, refund, etc
   * @param {number} query.kdtId - 店铺ID
   * @param {string} query.format - 导出文件格式, csv or excel
   * @param {string} query.dimension - 导出数据维度, goods, order, refund, etc
   * @return {Promise}
   */
  async queryCustomizedConfig(query) {
    return this.invoke('queryCustomizedConfig', [query]);
  }

  /**
   * 保存商家自定义报表配置
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/126081
   *
   * @param {Object} customizedExportConfig -
   * @param {string} customizedExportConfig.bizType - 导出业务类型, order, refund, etc
   * @param {number} customizedExportConfig.kdtId - 店铺ID
   * @param {string} customizedExportConfig.extra - 额外备注信息
   * @param {string} customizedExportConfig.format - 导出文件格式, csv or excel
   * @param {string} customizedExportConfig.options - 导出其他选项
   * @param {Array.<Array>} customizedExportConfig.fields[] - 导出字段集合
   * @param {Array} customizedExportConfig.fields[] -
   * @param {string} customizedExportConfig.dimension - 导出数据维度, goods, order, refund, etc
   * @return {Promise}
   */
  async saveCustomizedConfig(customizedExportConfig) {
    return this.invoke('saveCustomizedConfig', [customizedExportConfig]);
  }
}

module.exports = ConfigService;
