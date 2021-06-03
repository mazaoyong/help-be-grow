const BaseService = require('../base/BaseService');

/**
 *  买赠相关 dubbo 接口
 */
class BuyGiveActivityService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.BuyGiveActivityService';
  }

  /**
   * 获取买赠列表
   *
   * @param {*} req - 请求参数
   */
  async getLists(req) {
    const result = await this.invoke('listPageBuyGiveActivities', [req]);
    return result;
  }

  /**
   * 新建买赠活动
   *
   * @param {*} req
   */
  async create(req) {
    const result = await this.invoke('create', [req]);
    return result;
  }

  /**
   * 删除买赠活动
   *
   * @param {*} req
   */
  async delete(req) {
    const result = await this.invoke('deleteById', req);
    return result;
  }

  /**
   * 根据 id 查询买赠活动详情
   *
   * @param {*} req
   */
  async getDetail(req) {
    const result = await this.invoke('getDetailById', req);
    return result;
  }

  /**
   * 更新买赠活动
   *
   * @param {*} req
   */
  async update(req) {
    const result = await this.invoke('update', [req]);
    return result;
  }

  /**
   * 根据商品别名查询商品
   *
   * @param {*} kdtId
   * @param {*} itemIds
   * @memberof BuyGiveActivityService
   */
  async getKnowledgeByAlias(kdtId, itemIds) {
    const result = await this.invoke('listKnowledgeItemsByKdtIdAndItemsId', [kdtId, itemIds]);
    return result;
  }

  /**
   * 分页查询商品
   *
   * @param {*} kdtId
   * @param {*} size
   * @param {*} page
   * @param {*} types
   */
  async getKnowledgeList(kdtId, size = 10, page = 1, types = '') {
    const result = await this.invoke('listPageKnowledgeItems', [
      {
        kdtId,
        types,
        size,
        page,
      },
    ]);
    return result;
  }
}

module.exports = BuyGiveActivityService;
