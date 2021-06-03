const BaseService = require('../../../base/BaseService');

/**
 *  com.youzan.owl.pc.api.asset.AssetFacade
 * */
class AssetFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.asset.AssetFacade';
  }

  /**
   *  updateValidity 修改课程有效期
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/367939
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {number} command.studentId - 学员id
   *  @param {string} command.startTime - 开始时间
   *  @param {string} command.endTime - 结束时间
   *  @param {string} command.assetNo - 资产编号
   *  @return {Promise}
   */
  async updateValidity(kdtId, command) {
    return this.invoke('updateValidity', [kdtId, command]);
  }

  /**
  *  校验课时是否可扣减
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/428079
  *
  *  @param {number} kdtId - 店铺id
  *  @param {Object} command - 课时对象
  *  @param {number} command.studentId - 学员id
  *  @param {number} command.updateCourse - 修改课时
  *  @param {string} command.remark - 操作备注
  *  @param {string} command.assetNo - 资产编号
  *  @param {number} command.updateType - 修改类型com.youzan.owl.edu.enums.asset.AssetCourseUpdateTypeEnum
  *  @return {Promise}
  */
  async checkCourseTime(kdtId, command) {
    return this.invoke('checkCourseTime', [kdtId, command]);
  }

  /**
  *  修改课时
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/428078
  *
  *  @param {number} kdtId - 店铺id
  *  @param {Object} command - 课时对象
  *  @param {number} command.studentId - 学员id
  *  @param {number} command.updateCourse - 修改课时
  *  @param {string} command.remark - 操作备注
  *  @param {string} command.assetNo - 资产编号
  *  @param {number} command.updateType - 修改类型com.youzan.owl.edu.enums.asset.AssetCourseUpdateTypeEnum
  *  @return {Promise}
  */
  async updateCourseTime(kdtId, command) {
    return this.invoke('updateCourseTime', [kdtId, command]);
  }
}

module.exports = AssetFacade;
