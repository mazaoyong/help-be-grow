const BaseService = require('../base/BaseService');

/* com.youzan.channels.apps.service.MpVersionService -  */
class MpVersionService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.channels.apps.service.MpVersionService';
  }

  /**
   *  查询渠道版本
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/475884
   *
   *  @param {Object} getMpVersionDto -
   *  @param {number} getMpVersionDto.kdtId - 店铺ID
   *  @param {number} getMpVersionDto.accountType - 渠道帐号类型，0、1:公众号；2：微信小程序；3：DSP； 4：微信移动应用；5：饿了么;6:百度小程序
   *  @param {number} getMpVersionDto.businessType - 业务类型，1：商城；2:直播
   *  @param {number} getMpVersionDto.mpId - 渠道ID
   *  @return {Promise}
   */
  async getMpVersion(getMpVersionDto) {
    return this.invoke('getMpVersion', [getMpVersionDto]);
  }
}

module.exports = MpVersionService;
