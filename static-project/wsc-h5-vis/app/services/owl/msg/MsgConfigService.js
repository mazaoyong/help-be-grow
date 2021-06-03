const BaseService = require('../../base/BaseService');

class MsgConfigService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.msg.config.MsgConfigService';
  }

  /**
   *  是否应该拉起消息弹窗
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/701686
   *
   *  @param {Object} pullUpMsgQuery -
   *  @param {Object} pullUpMsgQuery.subscriptionTmplListParam - 订阅模板列表查询参数
   *  @param {integer} pullUpMsgQuery.subscriptionTmplListParam.uid - 用户ID
   *  @param {string} pullUpMsgQuery.subscriptionTmplListParam.scene - 场景识别
   *  @param {number} pullUpMsgQuery.kdtId - 当前登录店铺的KdtId
   *  @param {string} pullUpMsgQuery.bizJudgePram - 业务判断参数(用来判断是否有必要查询配置)
   *  @param {number} pullUpMsgQuery.hqKdtId - 总店id
   *  @param {Array.<Object>} pullUpMsgQuery.msgConfigGetParams[] - 消息查询参数
   *  @return {Promise}
   */
  async shouldPullUpMsgDialog(pullUpMsgQuery) {
    return this.invoke('shouldPullUpMsgDialog', [pullUpMsgQuery]);
  }

  /**
   *  保存用户消息配置
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/701685
   *
   *  @param {Object} saveCommand -
   *  @param {number} saveCommand.kdtId - 当前登录的店铺id
   *  @param {number} saveCommand.hqKdtId - 总店id
   *  @param {Object} saveCommand.subscriptionCallbackParam - 消息中心的参数
   *  @param {integer} saveCommand.subscriptionCallbackParam.uid - 用户ID
   *  @param {[object Object]} saveCommand.subscriptionCallbackParam.templateIdList - 用户授权的模板ID列表
   *  @param {Array.<Object>} saveCommand.configSaveParams[] - 保存的用户选项
   *  @param {string} saveCommand.scene - 场景识别（配置分组）
   *  @return {Promise}
   */
  async saveMsgConfig(saveCommand) {
    return this.invoke('saveMsgConfig', [saveCommand]);
  }
}

module.exports = MsgConfigService;
