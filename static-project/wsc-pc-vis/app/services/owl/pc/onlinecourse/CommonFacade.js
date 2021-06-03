const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.pc.api.onlinecourse.CommonFacade -  */
class CommonFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.onlinecourse.CommonFacade';
  }

  /**
   *  校验门店是否授权公众号
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/701561
   *
   *  @param {number} kdtId - 店铺id
   *  @return {Promise}
   */
  async checkAuth(kdtId) {
    return this.invoke('checkAuth', [kdtId]);
  }
}

module.exports = CommonFacade;
