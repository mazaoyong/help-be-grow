const BaseService = require('../../base/BaseService');

/**
 * 报名记录
 */
class CourseScheduleService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.enrollform.EnrollFacade';
  }

  /**
   * 查询学员资料项列表
   *
   * @param {number} kdtId
   */
  async findDataItemsOld(kdtId) {
    return this.invoke('findDataItems', [kdtId]);
  }
  async findDataItems(kdtId, query) {
    return this.invoke('findDataItems', [kdtId, query]);
  }

  /**
   * 分页查询报名记录列表
   *
   * @param {number} kdtId
   * @param {Object} formRegInfoQuery
   * @param {Object} pageRequest
   */
  async findPageRegistrationInfo(kdtId, formRegInfoQuery, pageRequest) {
    return this.invoke('findPageRegistrationInfo', [kdtId, formRegInfoQuery, pageRequest]);
  }

  /**
   * 分页查询来源微页面列表
   *
   * @param {number} kdtId
   * @param {number} featureCommandQuery
   * @param {number} pageRequest
   */
  async findPageRegFeature(kdtId, featureCommandQuery, pageRequest) {
    return this.invoke('findPageRegFeature', [kdtId, featureCommandQuery, pageRequest]);
  }

  /**
   * 报表批量导出
   *
   * @param {number} kdtId
   * @param {number} exptCommand
   */
  async createExportRecord(kdtId, exptCommand) {
    return this.invoke('createExportRecord', [kdtId, exptCommand]);
  }

  /**
   * 查看已导出报表列表
   *
   * @param {number} kdtId
   * @param {number} reportFormQuery
   * @param {number} pageRequest
   */
  async findPageExportedReportForm(kdtId, reportFormQuery, pageRequest) {
    return this.invoke('findPageExportedReportForm', [kdtId, reportFormQuery, pageRequest]);
  }

  /**
   *  创建预约预处理
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/376744
   *
   *  @param {number} kdtId -
   *  @param {Object} apptCommand -
   *  @param {string} apptCommand.name - 姓名
   *  @param {string} apptCommand.telephone - 手机号
   *  @param {Array.<Object>} apptCommand.dataItemInfo[] - C端用户报名记录详情
   *  @param {integer} apptCommand.dataItemInfo[].itemId - 资料项id
   *  @param {string} apptCommand.dataItemInfo[].itemValue - 资料项值
   *  @return {Promise}
   */
  async createPreAppointment(kdtId, apptCommand) {
    return this.invoke('createPreAppointment', [kdtId, apptCommand]);
  }

  /**
    *  创建预约预处理，
    *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/824443
    *
    *  @param {number} kdtId -
    *  @param {Object} apptCommand -
    *  @param {string} apptCommand.name - 姓名
    *  @param {string} apptCommand.telephone - 手机号
    *  @param {number} apptCommand.clueId - 线索id
    *  @param {Array.<Object>} apptCommand.dataItemInfo[] - C端用户报名记录详情
    *  @param {integer} apptCommand.dataItemInfo[].itemId - 资料项id
    *  @param {string} apptCommand.dataItemInfo[].itemValue - 资料项值
    *  @param {number} apptCommand.userId - 线索对应的userID（如果有）
这种情况针对通过线上录入的线索
    *  @return {Promise}
    */
  async createPreAppointmentForClue(kdtId, apptCommand) {
    return this.invoke('createPreAppointmentForClue', [kdtId, apptCommand]);
  }
}

module.exports = CourseScheduleService;
