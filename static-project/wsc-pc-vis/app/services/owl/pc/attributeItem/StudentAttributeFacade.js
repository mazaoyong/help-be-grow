const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.pc.api.attributeitem.StudentAttributeFacade -  */
class StudentAttributeFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.attributeitem.StudentAttributeFacade';
  }

  /**
   *  分页查询资料项池中的资料项
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/468895
   *
   *  @param {number} kdtId -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} queryDTO -
   *  @param {number} queryDTO.groupId -
   *  @param {string} queryDTO.name -
   *  @return {Promise}
   */
  async queryAttributes(kdtId, pageRequest, queryDTO) {
    return this.invoke('queryAttributes', [kdtId, pageRequest, queryDTO]);
  }

  /**
   *  B端分页查询该店铺下的学员资料项列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/464956
   *
   *  @param {number} kdtId -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query -
   *  @param {string} query.attributeTitle - 资料项标题
   *  @param {number} query.applicableScene - 资料项适用场景
   *  @return {Promise}
   */
  async findAttributes(kdtId, pageRequest, query) {
    return this.invoke('findAttributes', [kdtId, pageRequest, query]);
  }

  /**
   *  创建学员资料项
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/464958
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {Array.<Array>} command.attrItem[] - 如果是单选/多选，则该值保存选项列表
   *  @param {Array} command.attrItem[] -
   *  @param {number} command.attributeType - 资料项类型：(0,文本),(1,数字),(2,日期),(3,省市区),(4,性别),(5,图片),(6,地址),(7,单选项),(8,多选),(9,手机号)
   *  @param {Array.<Object>} command.applicableScenes[] - 适用场景
   *  @param {string} command.attributeTitle - 资料项展示名称
   *  @param {string} command.attributeKey - 资料项唯一标识符key，具体参见 {@link com.youzan.owl.crm.api.clue.enums.AttributeKeyEnum}
   *  @param {number} command.serialNo - 序号
   *  @return {Promise}
   */
  async create(kdtId, command) {
    return this.invoke('create', [kdtId, command]);
  }

  /**
   *  更新学员资料项
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/464959
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {number} command.attributeId - 资料项id
   *  @param {Array.<Array>} command.attrItem[] - 如果是单选/多选，则该值保存选项列表
   *  @param {number} command.attributeType - 资料项类型：(0,文本),(1,数字),(2,日期),(3,省市区),(4,性别),(5,图片),(6,地址),(7,单选项),(8,多选),(9,手机号)
   *  @param {Array.<Object>} command.applicableScenes[] - 适用场景
   *  @param {Array.<Object>} command.oldApplicableScenes[] - 旧的适用场景，更新时用
   *  @param {string} command.attributeTitle - 资料项展示名称
   *  @param {string} command.attributeKey - 资料项唯一标识符key，具体参见 {@link com.youzan.owl.crm.api.clue.enums.AttributeKeyEnum}
   *  @param {number} command.serialNo - 序号
   *  @return {Promise}
   */
  async update(kdtId, command) {
    return this.invoke('update', [kdtId, command]);
  }

  /**
   *  删除学员资料项
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/464960
   *
   *  @param {number} kdtId -
   *  @param {number} attrItemId -
   *  @return {Promise}
   */
  async delete(kdtId, attrItemId) {
    return this.invoke('delete', [kdtId, attrItemId]);
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

  /**
   *  批量添加标准资料项至学员资料项分组中
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/468894
   *
   *  @param {number} kdtId -
   *  @param {Array} attributeAddDTOS -
   *  @return {Promise}
   */
  async batchAddStandardAttribute(kdtId, attributeAddDTOS) {
    return this.invoke('batchAddStandardAttribute', [kdtId, attributeAddDTOS]);
  }
}

module.exports = StudentAttributeFacade;
