const BaseService = require('../../base/BaseService');

/**
 *  认证查询服务
 */
class AuthenticationService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.trade.business.service.authentication.AuthenticationService';
  }

  /**
   *  根据店铺kdtId查询认证信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/477158
   *
   *  @param {Object} authenticationRequestDTO - 请求入参
   *  @param {number} authenticationRequestDTO.kdtId - 店铺ID
   *  @param {string} authenticationRequestDTO.source - 请求来源
   *  @return {Promise}
   */
  async queryAuthenticationStatus(authenticationRequestDTO) {
    return this.invoke('queryAuthenticationStatus', [authenticationRequestDTO]);
  }
}

module.exports = AuthenticationService;
