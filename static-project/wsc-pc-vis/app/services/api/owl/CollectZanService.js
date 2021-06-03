const BaseService = require('../../base/BaseService');

/**
 *  好友助力 dubbo 接口
 */
class CollectZanService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.CollectZanService';
  }

  /**
   * 创建好友助力
   *
   * @param {*} req
   */
  async create(req) {
    const result = await this.invoke('create', [req]);
    return result;
  }

  /**
   * 删除好友助力
   *
   * @param {number} kdtId
   * @param {number} id - 活动 ID
   */
  async delete(kdtId, id) {
    const result = await this.invoke('delete', [kdtId, id]);
    return result;
  }

  /**
   * 编辑好友助力
   *
   * @param {*} req
   */
  async update(req) {
    const result = await this.invoke('update', [req]);
    return result;
  }

  /**
   * 结束活动
   *
   * @param {number} kdtId
   * @param {number} id - 活动 ID
   */
  async invalid(kdtId, id) {
    const result = await this.invoke('invalid', [kdtId, id]);
    return result;
  }

  /**
   * @param {*} kdtId
   * @param {*} id
   */
  async getCollectZan(kdtId, id) {
    const result = await this.invoke('getCollectZan', [kdtId, id]);
    return result;
  }

  /**
   * @param {*} kdtId
   * @param {*} keyword
   * @param {*} state
   * @param {*} page
   * @param {*} pageSize
   */
  async findCollectZanListByKdtId(kdtId, keyword, state = 3, page = 1, pageSize = 20) {
    const result = this.invoke('findCollectZanListByKdtId', [
      {
        kdtId,
        keyword,
        state,
        page,
        pageSize,
      },
    ]);
    return result;
  }

  /**
   * @param {*} kdtId
   * @param {*} keyword
   * @param {*} page
   * @param {*} types
   * @param {*} pageSize
   */
  async findGoodsListByKdtId(kdtId, keyword, page, types, pageSize = 10) {
    const result = this.invoke('findGoodsListByKdtId', [
      {
        kdtId,
        keyword,
        page,
        types,
        pageSize,
      },
    ]);
    return result;
  }

  /**
   * @param {*} kdtId
   * @param {Array} goodsIds
   */
  async findGoodsListByKdtIdAndGoodsIds(kdtId, goodsIds) {
    const result = await this.invoke('findGoodsListByKdtIdAndGoodsIds', [kdtId, goodsIds]);
    return result;
  }
}

module.exports = CollectZanService;
