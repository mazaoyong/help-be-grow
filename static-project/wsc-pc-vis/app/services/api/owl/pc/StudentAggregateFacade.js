const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.pc.api.student.StudentAggregateFacade */
class StudentAggregateFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.student.StudentAggregateFacade';
  }

  /**
   * 提交导出学员信息任务
   * @link http://zanapi.qima-inc.com/site/service/view/1011307
   * @param {number} kdtId -
   * @param {Object} pageRequest - 分页请求
   * @param {number} pageRequest.pageNumber -
   * @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   * @param {number} pageRequest.pageSize -
   * @param {Object} pageRequest.sort -
   * @param {Object} query - 学员列表导出请求
   * @param {number} query.kdtId - 校区店铺kdtId todo待迁移
   * @param {string} query.endDate - 结束时间
   * @param {number} query.hasSubMp - 是否关注公众号: 1:已关注,2:未关注;
   * @param {string} query.nickName - 用户名称（操作人）
   * @param {string} query.mobile - 用户手机号（操作人）
   * @param {string} query.studentNo - 学号
   * @param {number} query.targetKdtId - 目标店铺id
   * @param {string} query.keyword - 学员姓名和手机号
   * @param {string} query.startDate - 开始时间
   * @param {string} query.customerName - 客户姓名
   * @param {Object} query.operator - 操作人
   * @param {number} query.learnStatus - 状态类型 1：在读，2：结业，3：试听，4：无状态
   * @return {Promise}
   */
  async submitStudentExportTask(kdtId, pageRequest, query) {
    return this.invoke('submitStudentExportTask', [kdtId, pageRequest, query]);
  }
}

module.exports = StudentAggregateFacade;
