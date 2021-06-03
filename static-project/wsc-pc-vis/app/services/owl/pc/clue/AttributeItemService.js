const BaseService = require('../../../base/BaseService');

/**
 * 线索相关
 */
class AttributeItemService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.clue.AttributeItemFacade';
  }

  /**
   *  查询店铺下学员资料项列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/415546
   *
   *  @param {number} kdtId - 店铺id
   *  @return {Promise}
   */
  async findAttributeItemsByKdtId(kdtId) {
    return this.invoke('findAttributeItemsByKdtId', [kdtId]);
  }
}

module.exports = AttributeItemService;
