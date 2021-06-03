const BaseService = require('./OrderBaseService');

/**
 * 退款订单导出
 */
class RefundExportService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ebiz.mall.trade.seller.api.service.export.RefundExportService';
  }

  /**
   * 退款导出
·· * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/262691
   *
   * @param {object} data
   * @param {string} data.bizType - 导出业务类型
   * @param {string} data.exportType -
   * @param {string} data.requestId - 导出请求ID
   * @param {string} data.account - 用户手机号
   * @param {string} data.nickName - 用户昵称
   * @param {Object} data.extra - 导出的额外信息，比如导出人信息等
   * @param {Object} data.options - 导出选项,目前提供以下选项
   * @param {string} data.options.format: csv , excel ; 目前只支持 csv , 默认为 csv
   * @param {string} data.options.version, old, new ; 导出版本,目前新老版本的帮助信息头不同, 以此标识
   * @param {string} data.orderBy - 排序字段
   * @param {string} data.source - 调用来源 'wsc'
   * @param {number} data.templateId - 微商城退款导出模板ID - 15
   * @param {Object} data.keyword - 退款搜索参数
   * @param {number} data.keyword.createTimeEnd - 退款创建 截止时间 单位s
   * @param {number} data.keyword.createTimeStart - 退款创建 起始时间 单位s
   * @param {number} data.keyword.demand - 退款方式
   * @param {number} data.keyword.involvedStatus - 退款搜索参数
   * @param {number} data.keyword.kdtId - 店铺id
   * @param {string} data.keyword.orderNo - 订单编号
   * @param {string} data.keyword.refundId - 退款编号
   * @param {number} data.keyword.phase - 退款类型/退款阶段
   * @param {number} data.keyword.searchTag - 0:待商家处理 1:待买家处理 2:客服介入中
   * @param {number} data.keyword.status - 退款状态
   * @param {string} data.order - 正序或倒序, 取值 desc or asc
   *
   * @return {object}
   */
  async export(data) {
    return this.invoke('export', [data]);
  }
}

module.exports = RefundExportService;
