const BaseService = require('../../base/BaseService');

class EnrollFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.enrollform.EnrollFacade';
  }

  /**
   *  C端 — 用户填写表单信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/992584
   *
   *  @param {number} kdtId - 店铺id
   *  @param {number} userId - 用户userId
   *  @param {number} id - 表单信息id
   *  @return {Promise}
   */
  async getRegistrationInfoById(kdtId, userId, id) {
    return this.invoke('getRegistrationInfoById', [kdtId, userId, id]);
  }
}

module.exports = EnrollFacade;
