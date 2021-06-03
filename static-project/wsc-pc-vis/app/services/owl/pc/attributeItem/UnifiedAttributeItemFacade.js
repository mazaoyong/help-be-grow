/**
 * com.youzan.owl.pc.api.attributeitem.UnifiedAttributeItemFacade
 */
const BaseService = require('../../../base/BaseService');

class UnifiedAttributeItemFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.attributeitem.UnifiedAttributeItemFacade';
  }

  /**
   *  获取B端资料项列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/606853
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {number} query.sceneId - 场景id 1 学员报名 2 线索管理 3 报名表单 5 官网表单插件
   *  @see @{link com.youzan.owl.oc.api.attributeitem.enums.AttributeSceneEnum}
   *  @param {Array.<Array>} query.excludeAttrKeys[] -
   *  @param {Array} query.excludeAttrKeys[] -
   *  @return {Promise}
   */
  async findAttributes(kdtId, query) {
    return this.invoke('findAttributes', [kdtId, query]);
  }
}

module.exports = UnifiedAttributeItemFacade;
