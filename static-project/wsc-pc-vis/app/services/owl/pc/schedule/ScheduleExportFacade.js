const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.pc.api.schedule.ScheduleExportFacade -  */
class ScheduleExportFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.schedule.ScheduleExportFacade';
  }

  /**
   *
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/911236
   *
   *  @param {number} kdtId -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query -
   *  @param {number} query.type - 导出记录的类型，1:订单记录，默认0
   *  @param {number} query.taskId - 任务id
   *  @param {number} query.status - 当前导出记录的状态：0：失效，1：文件正在上传 2：上传完毕，可下载(为空查询全部)
   *  @return {Promise}
   */
  async findPageByCondition(kdtId, pageRequest, query) {
    return this.invoke('findPageByCondition', [kdtId, pageRequest, query]);
  }

  /**
   *
   * @param {number} kdtId
   * @param {Object} query
   * @param {string} query.operateName
   * @param {string} query.operateMobile
   * @param {number} query.id
   */
  async getById(kdtId, query) {
    return this.invoke('getById', [kdtId, query]);
  }
}

module.exports = ScheduleExportFacade;
