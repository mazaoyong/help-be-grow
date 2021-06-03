const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.api.common.ExistenceCheckFacade -  */
class ExistenceCheckFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.common.ExistenceCheckFacade';
  }

  /**
   *  检查用户是否拥有专栏、内容、课程、打卡等信息，用于前端是否展示tab页
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/476060
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {number} userId - 用户ID
   *  @return {Promise}
   */
  async checkExist(kdtId, userId) {
    return this.invoke('checkExist', [kdtId, userId]);
  }
}

module.exports = ExistenceCheckFacade;
