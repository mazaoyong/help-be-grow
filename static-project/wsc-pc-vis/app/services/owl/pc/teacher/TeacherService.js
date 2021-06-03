const BaseService = require('../../../base/BaseService');
/**
 */
class TeacherService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.teacher.TeacherFacade';
  }

  /**
   *  获取当前用户的信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/348423
   *
   *  @param {number} kdtId - 店铺id
   *  @param {number} teacherId - 老师id
   */
  async getById(kdtId, teacherId) {
    return this.invoke('getById', [kdtId, teacherId]);
  }
}

module.exports = TeacherService;
