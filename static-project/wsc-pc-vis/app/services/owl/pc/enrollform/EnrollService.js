const BaseService = require('../../../base/BaseService');

/**
 * 线索相关
 */
class EnrollService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.enrollform.EnrollFacade';
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
    *  @param {number} apptCommand.userId - 线索对应的userID（如果有）这种情况针对通过线上录入的线索
    *  @return {Promise}
   */
  async createPreAppointmentForClue(kdtId, apptCommand) {
    return this.invoke('createPreAppointmentForClue', [kdtId, apptCommand]);
  }
}

module.exports = EnrollService;
