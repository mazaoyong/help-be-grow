const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.api.client.onlinecourse.EduLiveVideoFacade -  */
class EduLiveVideoFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.onlinecourse.EduLiveVideoFacade';
  }

  /**
             *  查询直播链接
  <p>
  {@link <a herf=' http://dev.polyv.net/2018/liveproduct/l-manual/l-function-intro/l-my-live/l-page-setting/l-watchauth/external-authorization-2/'/>}
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/744788
  *
             *  @param {number} kdtId -
             *  @param {Object} liveLinkQuery - 直播链接查询参数
             *  @param {string} liveLinkQuery.alias - 别名
             *  @param {number} liveLinkQuery.userId - 用户id
             *  @return {Promise}
             */
  async getEduLiveLink(kdtId, liveLinkQuery) {
    return this.invoke('getEduLiveLink', [kdtId, liveLinkQuery]);
  }

  /**
   *  获取直播间打赏配置
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/905653
   *
   *  @param {number} kdtId -
   *  @param {Object} commonCommand -
   *  @param {string} commonCommand.tag - 直播来源
   *  @param {number} commonCommand.userId - 用户id
   *  @return {Promise}
   */
  async getLiveRewardSetting(kdtId, commonCommand) {
    return this.invoke('getLiveRewardSetting', [kdtId, commonCommand]);
  }
}

module.exports = EduLiveVideoFacade;
