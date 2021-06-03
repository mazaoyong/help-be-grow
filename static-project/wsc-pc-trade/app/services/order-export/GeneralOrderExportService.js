const BaseService = require('../base/BaseService');

/**
 *
 * @class GeneralOrderExportService
 * @extends {BaseService}
 */
class GeneralOrderExportService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.trade.orderexport.api.v2.service.GeneralOrderExportService';
  }

  /**
   * 新的通用订单导出服务API
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/5998
   *
   * @param {Object} request - 通用导出请求
   * @param {string} request.bizType - 导出业务类型
   * @param {string} request.orderBy - 排序字段, eg. book_time
   * @param {string} request.paramHash - 运维使用，外部可不传
   * @param {string} request.source - 调用来源
   * @param {number} request.templateId - 导出模板ID, 业务方接入导出配置必传
   * @param {Object} request.reportConf - 导出报表字段的配置, 可用于直接导出ES或Hbase表的字段数据
   * @param {Object} request.generalOrderSearchParam - 订单搜索参数, 可以与 esConf 联合起来实现更灵活的ES搜索
   * @param {Array.<Object>} request.hbaseConf[] - Hbase数据源的配置, 结合数据同步可以实现更灵活的导出数据获取
   * @param {string} request.exportType - 导出报表类型, 默认为 default
   * @param {string} request.requestId - 导出请求ID
   * @param {number} request.exportTime - 运维使用，外部可不传
   * @param {Object} request.extra - 导出的额外信息，比如导出人信息等
   * @param {Object} request.options - 导出选项,目前提供以下选项
                                              isOrderDimension:  订单维度导出，只取第一条订单商品记录，会进行订单去重(后废弃)
                                              dimension: order 订单维度 goods 商品维度 ; order,goods 订单和商品维度 ; 默认商品维度
                                              format: csv , excel ; 目前只支持 csv , 默认为 csv
                                              version: old, new ; 导出版本,目前新老版本的帮助信息头不同, 以此标识
   * @param {Object} request.esConf - ES搜索配置
   * @param {Array.<Array>} request.fieldList - 直接指定导出字段列表
   * @param {string} request.exportId - 导出请求ID 运维使用，外部可不传
   * @param {string} request.order - 正序或倒序, 取值 desc or asc
   *
   * @return {Promise}
   */
  async export(request) {
    return this.invoke('export', [request]);
  }

  /**
   * 用假的链接去拿真实的下载链接
   * @param {Object} request - 通用导出请求
   * @param {string} request.filename - 文件名
   * @param {string} request.url - 假链接
   *
   * @return {Promise}
   */
  async queryPrivateUrl(request) {
    return this.invoke('queryPrivateUrl', [request]);
  }
}

module.exports = GeneralOrderExportService;
