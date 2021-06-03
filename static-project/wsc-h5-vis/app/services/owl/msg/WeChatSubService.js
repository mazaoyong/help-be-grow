const BaseService = require('../../base/BaseService');

class WeChatSubService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.msg.WeChatSubService';
  }

  /**
   *  判断公众号是否可用
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/706557
   *
   *  @param {Object} tmplAvailableDTO -
   *  @param {number} tmplAvailableDTO.uid -
   *  @param {number} tmplAvailableDTO.kdtId -
   *  @return {Promise}
   */
  async isMpTemplateMsgAvailable(tmplAvailableDTO) {
    return this.invoke('isMpTemplateMsgAvailable', [tmplAvailableDTO]);
  }

  /**
   *  获取模板
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/706559
   *
   *  @param {Object} templateGetDTO -
   *  @param {number} templateGetDTO.uid -
   *  @param {number} templateGetDTO.kdtId -
   *  @param {string} templateGetDTO.scene -
   *  @return {Promise}
   */
  async getTemplate(templateGetDTO) {
    return this.invoke('getTemplate', [templateGetDTO]);
  }

  /**
   *  保存用户消息配置
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/706558
   *
   *  @param {Object} subMsgCallBackDTO -
   *  @param {number} subMsgCallBackDTO.uid -
   *  @param {number} subMsgCallBackDTO.kdtId -
   *  @param {Array.<Array>} subMsgCallBackDTO.acceptedTemplateIdList[] -
   *  @param {Array} subMsgCallBackDTO.acceptedTemplateIdList[] -
   *  @param {string} subMsgCallBackDTO.scene -
   *  @return {Promise}
   */
  async subscriptionCallback(subMsgCallBackDTO) {
    return this.invoke('subscriptionCallback', [subMsgCallBackDTO]);
  }
}

module.exports = WeChatSubService;
