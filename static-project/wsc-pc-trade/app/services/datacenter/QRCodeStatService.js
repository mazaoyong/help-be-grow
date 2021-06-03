const DatacenterBaseService = require('./DatacenterBaseService');

/**
 * 扫码收款-数据统计
 */
class QRCodeStatService extends DatacenterBaseService {
  get SERVICE_NAME() {
    return 'com.youzan.bigdata.datacenter.base.api.service.source.QRCodeStatService';
  }

  /**
   *  扫码统计-概况数据
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/511777
   *
   *  @param {Object} param -
   *  @param {number} param.unitType -
   *  @param {number} param.currentDay -
   *  @param {number} param.kdtId -
   *  @param {string} param.sortType -
   *  @param {string} param.fromApp - 请求来源
   *  @param {string} param.requestId - UUID
   *  @param {string} param.sortField -
   *  @param {number} param.pageSize -
   *  @param {number} param.page -
   *  @param {number} param.type - 1、收款码名称； 2、收款码标签
   *  @param {string} param.keyword -
   *  @param {string} param.operator - 操作人信息
   *  @return {Promise}
   */
  async getSummary(param) {
    return this.invoke('getSummary', [param]);
  }

  /**
   *  扫码统计分页数据
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/511778
   *
   *  @param {Object} param -
   *  @param {number} param.unitType -
   *  @param {number} param.currentDay -
   *  @param {number} param.kdtId -
   *  @param {string} param.sortType -
   *  @param {string} param.fromApp - 请求来源
   *  @param {string} param.requestId - UUID
   *  @param {string} param.sortField -
   *  @param {number} param.pageSize -
   *  @param {number} param.page -
   *  @param {number} param.type - 1、收款码名称； 2、收款码标签
   *  @param {string} param.keyword -
   *  @param {string} param.operator - 操作人信息
   *  @return {Promise}
   */
  async getPageData(param) {
    return this.invoke('getPageData', [param]);
  }
}

module.exports = QRCodeStatService;
