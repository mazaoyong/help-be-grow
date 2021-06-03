const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.pc.api.examination.ExamPluginFacade -  */
class ExamPluginFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.examination.ExamPluginFacade';
  }

  /**
   *  B端是否拥有使用考试插件的权限
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/927122
   *
   *  @param {number} kdtId -
   *  @return {Promise}
   */
  async allowedForPc(kdtId) {
    return this.invoke('allowedForPc', [kdtId]);
  }

  /**
   *  初始化考试插件
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/927123
   *
   *  @param {number} kdtId -
   *  @return {Promise}
   */
  async initExamPlugin(kdtId) {
    return this.invoke('initExamPlugin', [kdtId]);
  }
}

module.exports = ExamPluginFacade;
