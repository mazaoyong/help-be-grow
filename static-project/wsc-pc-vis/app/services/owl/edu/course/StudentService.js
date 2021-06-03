const BaseService = require('../../../base/BaseService');

/**
 * 学员信息相关接口
 * @class
 */
class StudentService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.edu.api.student.StudentFacade';
  }

  /**
   *  获取学员详情，PC端订单列表所需
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/217547
   *
   *  @param {Object} params -
   *  @param {number} params.kdtId - kdtId
   *  @param {string} params.alias - 学员alias
   *  @param {number} params.customerUserId - 客户有赞user id
   *  @param {string} params.keyword - 关键字「现在支持姓名」
   *  @return {Object}
   */
  async getRegisterInfo(params) {
    const result = await this.invoke('getStudentDetail', [params]);
    return result;
  }
}

module.exports = StudentService;
