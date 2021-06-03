const BaseService = require('../../base/BaseService');

/**
 * 客户学员service
 * @class StudentFacade
 * @extends {BaseService}
 */
class StudentService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.edu.api.student.StudentFacade';
  }

  /**
   *  获取客户学员列表「不分页」
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/217549
   *
   *  @param {Object} req -
   *  @param {number} req.kdtId - kdtId
   *  @param {string} req.alias - 学员alias
   *  @param {number} req.customerUserId - 客户有赞user id
   *  @return {Object}
   */
  async getCustomerStudentList(req) {
    return this.invoke('getCustomerStudentList', [req]);
  }

  /**
   *  新增学员
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/217186
   *
   *  @param {Object} req - 创建学员参数
   *  @param {string} req.wechatAccount - 微信号
   *  @param {number} req.customerFansId - 客户粉丝id
   *  @param {number} req.customerFansType - 客户粉丝类型
   *  @param {string} req.phoneNumber - 手机号码
   *  @param {string} req.address - 地址
   *  @param {number} req.gender - 性别「1.男 2.女」
   *  @param {number} req.kdtId - kdtId「必填」
   *  @param {string} req.grade - 年级
   *  @param {string} req.name - 学员姓名「必填」
   *  @param {number} req.customerUserId - 客户有赞user_id「必填」
   *  @param {string} req.bornDate - 出生日期「年月日」
   *  @param {Object} req.operator - 操作人
   *  @return {Object}
   */
  async createStudent(req) {
    return this.invoke('createStudent', [req]);
  }
}

module.exports = StudentService;
