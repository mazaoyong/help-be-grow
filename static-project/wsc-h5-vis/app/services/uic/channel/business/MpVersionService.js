const BaseService = require('../../../base/BaseService');

class MpVersionService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.uic.channel.business.api.service.MpVersionService';
  }

  /**
  *  获取当前kdtId对应的渠道版本号信息，如果当前kdtId没有对应的渠道信息，那么会获取此kdtId在店铺模型中上一层的渠道帐号信息
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/461684
  *
  *  @param {Object} requestParam - 支持两种纬度的查询(1)externalId-对应kdtId，不能为空
          accountType 1(公众号)、2（微信小程序）不能为空
          (2) mpId不能为空，accountType不能为空
  *  @param {number} requestParam.accountType
  *  @param {string} requestParam.appId
  *  @param {number} requestParam.externalId
  *  @param {number} requestParam.businessType
  *  @param {number} requestParam.mpId
  *  @return {Promise}
  */
  async getMpVersion(requestParam) {
    return this.invoke('getMpVersion', [requestParam]);
  }
}

module.exports = MpVersionService;
