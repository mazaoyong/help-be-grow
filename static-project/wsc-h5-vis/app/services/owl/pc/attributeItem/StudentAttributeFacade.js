/* com.youzan.owl.pc.api.attributeitem.StudentAttributeFacade -  */
const BaseService = require('../../../base/BaseService');

class StudentAttributeFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.attributeitem.StudentAttributeFacade';
  }

  /**
   *  B/C端根据kdtId查询学员资料项列表,目前B创建线索/C端创建学员等场景使用
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/467606
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {string} query.attributeTitle - 资料项标题
   *  @param {number} query.applicableScene - 资料项适用场景
   *  @return {Promise}
   */
  async listByApplicableScene(kdtId, query) {
    return this.invoke('listByApplicableScene', [kdtId, query]);
  }
}

module.exports = StudentAttributeFacade;
