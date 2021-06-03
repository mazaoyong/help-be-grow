const BaseService = require('../../../base/BaseService');

/**
 * com.youzan.scrm.api.customer.service.customize.CustomizeService
 */
class CustomizeService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.scrm.api.customer.service.customize.CustomizeService';
  }

  /**
   * 根据版本获取敏感信息的明文
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/488539
   *
   *  @param {Object} userIdentifyDTO - dto
   *  @param {number} userIdentifyDTO.kdtId - 店铺Id
   *  @param {string} userIdentifyDTO.requestId - 调用请求Id
   *  @param {string} userIdentifyDTO.appName - 调用方应用名
   *  @param {string} userIdentifyDTO.customizeUid - 定制用户id
   *  @param {number} userIdentifyDTO.customizeType - 客户类型学员为1
   *  @param {number} userIdentifyDTO.version - 敏感信息版本，修改敏感信息之后会变，如果为1则敏感信息（目前只有身份证有更新过
   *  @param {number} userIdentifyDTO.yzUid - 有赞uid
   *  @return {Promise}
   */
  async queryPrivateAttrInfo(userIdentifyDTO) {
    return this.invoke('queryPrivateAttrInfo', [userIdentifyDTO]);
  }
}

module.exports = CustomizeService;
