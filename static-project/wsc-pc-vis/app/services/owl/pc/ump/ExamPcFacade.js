const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.pc.api.ump.ExamPCFacade -  */
class ExamPCFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.ump.ExamPCFacade';
  }

  /**
   *  测验是否能修改
      当有用户参与时，不能修改
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/726444
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {number} query.kdtId - 店铺id
   *  @param {number} query.examId - 测验id
   *  @return {Promise}
   */
  async examExistUser(kdtId, query) {
    return this.invoke('examExistUser', [kdtId, query]);
  }
}

module.exports = ExamPCFacade;
