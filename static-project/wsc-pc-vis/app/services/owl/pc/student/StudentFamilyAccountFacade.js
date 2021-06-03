const BaseService = require('../../../base/BaseService');
/**
 *
 * com.youzan.owl.pc.api.student.StudentFamilyAccountFacade
 */

class StudentFamilyAccountFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.student.StudentFamilyAccountFacade';
  }

  /**
   *  查询学员关联的家庭帐号信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/664721
   *
   *  @param {number} kdtId - 店铺id
   *  @param {integer} studentId - 学员id
   *  @return {Promise}
   */
  async getByStudentId(kdtId, studentId) {
    return this.invoke('getByStudentId', [kdtId, studentId]);
  }
}
module.exports = StudentFamilyAccountFacade;
