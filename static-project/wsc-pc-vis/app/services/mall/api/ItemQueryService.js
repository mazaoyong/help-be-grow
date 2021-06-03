const BaseService = require('../../base/BaseService');

/** com.youzan.mall.item.api.ItemQueryService -  */
class ItemQueryService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.mall.item.api.ItemQueryService';
  }

  /**
   *  分页查询商品列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/86067
   *
   *  @param {Object} param - 参考zanAPI
   *  @return {Promise}
   */
  async listItemsPaged(param) {
    return this.invoke('listItemsPaged', [param]);
  }
}

module.exports = ItemQueryService;
