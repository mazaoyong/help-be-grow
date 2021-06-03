const BaseService = require('../../../../base/BaseService');
/* com.youzan.owl.api.client.edu.signin.SignInFacade -  */
class SignInFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.edu.signin.SignInFacade';
  }

  /**
   *  无需预约签到-查询指定课程可消耗的资产列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/475956
   *
   *  @param {number} kdtId - 店铺id
   *  @param {number} studentId - 学员id
   *  @param {string} lessonNo - 学员课表编号
   *  @return {Promise}
   */
  async findUserAssetsForSignIn(kdtId, studentId, lessonNo) {
    return this.owlInvoke('findUserAssetsForSignIn', [kdtId, studentId, lessonNo]);
  }
}

module.exports = SignInFacade;
