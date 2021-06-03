const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.api.client.edu.student.StudentFacade -  */
class StudentFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.edu.student.StudentFacade';
  }

  /**
   *  下单根据用户id查学员列表，如果班级列表为空则校验学员所在班级
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/713836
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} query - 用户ID
   *  @param {Array.<Array>} query.classIdList[] - 班级ID列表
   *  @param {Array} query.classIdList[] -
   *  @param {number} query.userId - 用户ID
   *  @return {Promise}
   */
  async findByTradeStudentQuery(kdtId, query) {
    return this.invoke('findByTradeStudentQuery', [kdtId, query]);
  }
}

module.exports = StudentFacade;
