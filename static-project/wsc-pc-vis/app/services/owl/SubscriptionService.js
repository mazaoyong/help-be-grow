const BaseService = require('../base/BaseService');

/**
 */
class SubscriptionService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.SubscriptionService';
  }

  /**
   * 查询订购记录列表
   *
   * @param {*} kdtId
   * @param {*} orderNo
   * @param {*} startDate
   * @param {*} endDate
   * @param {*} kdtIdList
   * @param {*} page
   * @param {*} size
   */
  async getSubRecordList(kdtId, orderNo = '', startDate = '', endDate = '', kdtIdList = [], page = 1, size = 20) {
    const res = await this.invoke('getSubRecordList', [
      {
        kdtId,
        orderNo,
        startDate,
        endDate,
        kdtIdList,
        page,
        size,
      },
    ]);
    return res;
  }

  /**
   * 导出订购记录
   *
   * @param {*} kdtId
   * @param {*} orderNo
   * @param {*} startDate
   * @param {*} endDate
   * @param {*} kdtIdList
   * @param {*} operatorName
   * @param {*} operatorMobile
   */
  async exportOrderExcelFile(
    kdtId,
    orderNo = '',
    startDate = '',
    endDate = '',
    kdtIdList = [],
    operatorName,
    operatorMobile = ''
  ) {
    const res = await this.invoke('exportOrderExcelFile', [
      {
        kdtId,
        orderNo,
        startDate,
        endDate,
        kdtIdList,
        operatorName,
        operatorMobile,
      },
    ]);
    return res;
  }

  /**
   * @param {*} kdtId
   * @param {*} page
   * @param {*} size
   */
  async getPageList(kdtId, page, size) {
    const res = await this.invoke('getPageList', [
      {
        kdtId,
        page,
        size,
      },
    ]);
    return res;
  }
}

module.exports = SubscriptionService;
