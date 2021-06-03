const BaseService = require('../../../base/BaseService');

/**
 * com.youzan.owl.oc.api.setting.EduConfigFacade
 */
class EduConfigFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.oc.api.setting.EduConfigFacade';
  }

  /**
   *  教务设置保存
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/350457
   *
   *  @param {number} kdtId -
   *  @param {Object} eduConfigDTO -
   *  @param {number} eduConfigDTO.isAppointmentLimit - 1是限制，0是不限制
   *  @param {number} eduConfigDTO.signInRule - 用户扫描规则 1限制 0不限制
   *  @param {number} eduConfigDTO.stopAppointmentHour - 开课前几个小时不能预约
   *  @param {number} eduConfigDTO.startAppointmentDay - 开课前几天可以预约
   *  @param {number} eduConfigDTO.kdtId -
   *  @param {number} eduConfigDTO.isCancelAppointment - 是否允许取消预约 1为可以，0为不可以
   *  @param {number} eduConfigDTO.writeOffRuleTruancy - 旷课是否算核销，1算 0不算
   *  @param {number} eduConfigDTO.writeOffRule - 1、签到后自动核销、2、开课后自动核销
   *  @param {string} eduConfigDTO.createdAt - 创建时间
   *  @param {number} eduConfigDTO.startSignInRuleHour - 课程开始前几个小时可以签到
   *  @param {number} eduConfigDTO.canCancelAppointmentHour - 开课前几个小时可以取消预约
   *  @param {number} eduConfigDTO.stopSignInRuleHour - 课程结束前几个小时停止签到
   *  @param {number} eduConfigDTO.writeOffRuleLeave - 请假是否算核销，1算 0不算
   *  @param {number} eduConfigDTO.id -
   *  @param {string} eduConfigDTO.updatedAt - 更新时间
   *  @return {Promise}
   */
  async create(kdtId, eduConfigDTO) {
    return this.invoke('create', [kdtId, eduConfigDTO]);
  }

  /**
   *  更新教务设置
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/350458
   *
   *  @param {number} kdtId -
   *  @param {Object} eduConfigDTO -
   *  @param {number} eduConfigDTO.isAppointmentLimit - 1是限制，0是不限制
   *  @param {number} eduConfigDTO.signInRule - 用户扫描规则 1限制 0不限制
   *  @param {number} eduConfigDTO.stopAppointmentHour - 开课前几个小时不能预约
   *  @param {number} eduConfigDTO.startAppointmentDay - 开课前几天可以预约
   *  @param {number} eduConfigDTO.kdtId -
   *  @param {number} eduConfigDTO.isCancelAppointment - 是否允许取消预约 1为可以，0为不可以
   *  @param {number} eduConfigDTO.writeOffRuleTruancy - 旷课是否算核销，1算 0不算
   *  @param {number} eduConfigDTO.writeOffRule - 1、签到后自动核销、2、开课后自动核销
   *  @param {string} eduConfigDTO.createdAt - 创建时间
   *  @param {number} eduConfigDTO.startSignInRuleHour - 课程开始前几个小时可以签到
   *  @param {number} eduConfigDTO.canCancelAppointmentHour - 开课前几个小时可以取消预约
   *  @param {number} eduConfigDTO.stopSignInRuleHour - 课程结束前几个小时停止签到
   *  @param {number} eduConfigDTO.writeOffRuleLeave - 请假是否算核销，1算 0不算
   *  @param {number} eduConfigDTO.id -
   *  @param {string} eduConfigDTO.updatedAt - 更新时间
   *  @return {Promise}
   */
  async update(kdtId, eduConfigDTO) {
    return this.invoke('update', [kdtId, eduConfigDTO]);
  }

  /**
   *  根据kdtId获取教务设置
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/350459
   *
   *  @param {number} kdtId -
   *  @return {Promise}
   */
  async getByKdtId(kdtId) {
    return this.invoke('getByKdtId', [kdtId]);
  }
}

module.exports = EduConfigFacade;
