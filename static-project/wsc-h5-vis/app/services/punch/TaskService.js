const BaseService = require('../base/BaseService');

class TaskService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.gci.api.facade.GciTaskFacade';
  }

  get CUSTOMER_SERVICE_NAME() {
    return 'com.youzan.owl.gci.api.facade.GciCustomerFacade';
  }

  async getTaskDetail(query) {
    let result = await this.owlInvoke(this.CUSTOMER_SERVICE_NAME, 'getGciDetail', [query]);

    return result;
  }

  async getShareCardInfo(query) {
    let result = await this.owlInvoke(this.CUSTOMER_SERVICE_NAME, 'getGciPromotion', [query]);

    return result;
  }

  // 打卡页-获取打卡任务要求
  async getTaskContent(query) {
    let result = await this.owlInvoke(this.SERVICE_NAME, 'getGciTask', query);

    return result;
  }

  // 日历页-获取打卡任务详情
  async getTaskContentByDate(query) {
    let result = await this.owlInvoke(this.SERVICE_NAME, 'getGciTaskByTaskDate', query);

    return result;
  }
}

module.exports = TaskService;
