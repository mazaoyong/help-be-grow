const BaseService = require('../../../base/BaseService');

class StudentAttributeFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.attributeitem.StudentAttributeFacade';
  }

  /**
   *  C端根据kdtId和applicableScene查询学员资料项列表,目前B创建线索/C端创建学员等场景使用
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/486889
   *
   *  @param {number} kdtId -
   *  @param {string} query -
   *  @return {Promise}
   */
  async listByApplicableScene(kdtId, query) {
    return this.invoke('listByApplicableScene', [kdtId, query]);
  }
}

module.exports = StudentAttributeFacade;
