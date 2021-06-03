const BaseService = require('../base/BaseService');

class GrayService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.rig.front.api.service.GrayService';
  }

  /**
   *  判断是否在灰度规则中
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/505804
   *
   *  @param {Object} baseReqDTO -
   *  @param {string} baseReqDTO.thirdUserId - 外部用户id 店铺域为adminId值
   *  @param {string} baseReqDTO.thirdTenantId - 外部id 店铺域为kdtId值
   *  @param {string} baseReqDTO.bizCode - 业务身份标识
   *  @param {number} baseReqDTO.pageNo - 分页
   *  @param {string} baseReqDTO.namespace - 命名空间 namespace 店铺域namespace:np_yz_shop
   *  @param {number} baseReqDTO.pageSize - 分页大小
   *  @return {Promise}
   */
  async isInGrayRelease(baseReqDTO) {
    return this.invoke('isInGrayRelease', [baseReqDTO]);
  }
}

module.exports = GrayService;
