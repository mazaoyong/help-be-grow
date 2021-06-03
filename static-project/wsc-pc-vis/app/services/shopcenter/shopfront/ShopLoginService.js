const BaseService = require('../../base/BaseService');
/**
 */
class ShopLoginService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.shopcenter.shopfront.api.service.session.ShopLoginService';
  }

  /**
   *  查询店铺列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/322823
   *
   *  @param {Object} dto -
   *  @param {string} dto.kdtId - 店铺id
   *  @param {string} dto.sid - sessionId
   *
   */
  async login(dto) {
    return this.invoke('login', [dto]);
  }
}

module.exports = ShopLoginService;
