const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.pc.api.educonfig.EduConfigFacade -  */
class EduConfigFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.educonfig.EduConfigFacade';
  }

  /**
   *  查询店铺预约设置
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/921350
   *
   *  @param {number} kdtId -
   *  @return {Promise}
   */
  async getAppointmentConfig(kdtId) {
    return this.invoke('getAppointmentConfig', [kdtId]);
  }

  /**
   *  修改店铺预约设置
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/921351
   *
   *  @param {Object} appointmentConfigDTO -
   *  @param {number} appointmentConfigDTO.isAppointmentLimit - 1是限制，0是不限制
   *  @param {number} appointmentConfigDTO.stopAppointmentHour - 开课前几个小时不能预约
   *  @param {number} appointmentConfigDTO.canCancelAppointmentHour - 开课前几个小时可以取消预约
   *  @param {number} appointmentConfigDTO.startAppointmentDay - 开课前几天可以预约
   *  @param {number} appointmentConfigDTO.kdtId - 店铺id
   *  @param {number} appointmentConfigDTO.isIndependentConfig - 1:日程独立配置预约规则 0:日程不独立配置预约规则
   *  @param {number} appointmentConfigDTO.trialCourseOccupyQuota - 试听课是否占用日程名额  1:占用名额，0:不占用名额
   *  @param {number} appointmentConfigDTO.isCancelAppointment - 是否允许取消预约 1为可以，0为不可以
   *  @return {Promise}
   */
  async updateAppointmentConfig(appointmentConfigDTO) {
    return this.invoke('updateAppointmentConfig', [appointmentConfigDTO]);
  }

  /**
   *  根据店铺id获取是否有预约配置的权限
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/925585
   *
   *  @param {number} kdtId -
   *  @return {Promise}
   */
  async isShopAppointmentConfigIndependent(kdtId) {
    return this.invoke('isShopAppointmentConfigIndependent', [kdtId]);
  }
}

module.exports = EduConfigFacade;
