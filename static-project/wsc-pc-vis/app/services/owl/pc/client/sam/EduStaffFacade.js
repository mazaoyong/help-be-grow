const BaseService = require('../../../../base/BaseService');

class EduStaffFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.client.sam.EduStaffFacade';
  }

  /**
   * 全量获取某角色下的雇员列表
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/406124
   *
   * @param {number} kdtId -
   * @param {Array} roleIds -
   * @return {Promise}
   *
   * 1: 高级管理员
   * 2: 总店-行政/其它-普通客服
   * 7: 财务
   * 8: 普通管理员
   * 9: 隐形管理员
   * 16: 广告投放员
   * 17: 设计专员
   * 20: 体验角色
   * 21: 老师
   * 22: 课程顾问
   * 24: 教务专员
   * 25: 新媒体专员
   * 26: 市场专员
   */
  async findStaffByRoles(kdtId, roleIds) {
    return this.invoke('findStaffByRoles', [kdtId, roleIds]);
  }

  /**
   *  查询具有指定权限的员工列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/442659
   *
   *  @param {number} kdtId -
   *  @param {Object} request -
   *  @param {number} request.pageNumber -
   *  @param {boolean} request.countEnabled - 是否开启count，默认为开启
   *  @param {number} request.pageSize -
   *  @param {Object} request.sort -
   *  @param {Object} cluePowerQuery -
   *  @param {string} cluePowerQuery.staffName - 员工姓名，用于Sam模糊匹配员工列表
   *  @param {Array.<Array>} cluePowerQuery.powerTypes[] - 线索员工权限类别，{@link com.youzan.owl.pc.enums.clue.CluePowerEnum}
   *  @param {number} cluePowerQuery.targetKdtId - 目标店铺id，如果单店，传值和当前店铺保持一致
   *  @return {Promise}
   */
  async findPagePowerStaffs(kdtId, request, cluePowerQuery) {
    return this.invoke('findPagePowerStaffs', [kdtId, request, cluePowerQuery]);
  }
}

module.exports = EduStaffFacade;
