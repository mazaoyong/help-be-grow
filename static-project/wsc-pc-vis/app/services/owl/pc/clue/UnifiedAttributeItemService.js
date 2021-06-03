const BaseService = require('../../../base/BaseService');

/**
 * 线索相关
 */
class UnifiedAttributeItemService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.attributeitem.UnifiedAttributeItemFacade';
  }

  /**
   *  查询客户资料项列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/606853
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} query -
   *  @param {Array} query.excludeAttrKeys -
   *  @param {number} query.scene - 场景id 1 学员报名 2 线索管理 3 报名表单 5 官网表单插件
   *  @return {Promise}
   */
  async findAttributeItemsByKdtId(kdtId, query) {
    console.log(kdtId, query);
    return this.invoke('findAttributes', [kdtId, query]);
  }
}

module.exports = UnifiedAttributeItemService;
