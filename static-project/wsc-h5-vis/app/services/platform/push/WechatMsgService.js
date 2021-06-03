const BaseService = require('../../base/BaseService');

class WechatMsgService extends BaseService {
  get WECHAT_TEMPLTE_SERVICE_NAME() {
    return 'com.youzan.platform.push.api.auxiliary.WechatTemplateService';
  }

  get WECHAT_MINI_SUBSCRIPTION_SERVICE() {
    return 'com.youzan.platform.push.api.WechatMiniSubscriptionService';
  }

  /**
    *  是否能发送公众号模板消息 && 是否绑定了公众号 && 是否有公众号模板消息的能力 && 是否关注了公众号
    *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/662346
    *
    *  @param {Object} isMpTemplateMsgAvailableRequest -
    *  @param {number} isMpTemplateMsgAvailableRequest.uid - 用户id
    *  @param {number} isMpTemplateMsgAvailableRequest.kdtId - 店铺Id
    *  @return {Promise}
    */
  async isMpTemplateMsgAvailable(isMpTemplateMsgAvailableRequest) {
    return this.invoke(this.WECHAT_TEMPLTE_SERVICE_NAME, 'isMpTemplateMsgAvailable', [
      isMpTemplateMsgAvailableRequest,
    ]);
  }

  /**
   *  获取小程序订阅模板接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/628458
   *
   *  @param {Object} subscriptionTemplateListGetRequest - 获取小程序订阅模板ID集合请求参数
   *  @param {number} subscriptionTemplateListGetRequest.uid - 用户Id
   *  @param {number} subscriptionTemplateListGetRequest.kdtId - 店铺Id
   *  @param {string} subscriptionTemplateListGetRequest.scene - 场景标识
   *  @return {Promise}
   */
  async getTemplate(subscriptionTemplateListGetRequest) {
    return this.invoke(this.WECHAT_MINI_SUBSCRIPTION_SERVICE, 'getTemplate', [subscriptionTemplateListGetRequest]);
  }

  /**
   *  获取小程序订阅模板列表接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/693884
   *
   *  @param {Object} getRequest - 获取小程序订阅模板列表请求参数
   *  @param {number} getRequest.uid - 用户Id
   *  @param {number} getRequest.kdtId - 店铺Id
   *  @param {string} getRequest.scene - 场景标识
   *  @return {Promise}
   */
  async getTemplateV2(getRequest) {
    return this.invoke('getTemplateV2', [getRequest]);
  }

  /**
   *  用户模板授权回调
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/628461
   *
   *  @param {Object} subscriptionCallbackRequest -
   *  @param {number} subscriptionCallbackRequest.uid - 用户Id
   *  @param {Array.<Array>} subscriptionCallbackRequest.templateIdList[] - 授权的模板id列表
   *  @param {Array} subscriptionCallbackRequest.templateIdList[] -
   *  @param {number} subscriptionCallbackRequest.kdtId - 店铺Id
   *  @param {string} subscriptionCallbackRequest.scene - 场景标识
   *  @return {Promise}
   */
  async subscriptionCallback(subscriptionCallbackRequest) {
    return this.invoke(this.WECHAT_MINI_SUBSCRIPTION_SERVICE, 'subscriptionCallback', [subscriptionCallbackRequest]);
  }
}

module.exports = WechatMsgService;
