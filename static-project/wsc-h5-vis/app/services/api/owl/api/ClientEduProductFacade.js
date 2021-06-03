const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.api.client.product.ClientEduProductFacade -  */
class ClientEduProductFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.product.ClientEduProductFacade';
  }

  /**
   *  教育商品详情页统一查询接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/678904
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {number} query.fansId - 粉丝id,查询直播时需要
   *  @param {string} query.alias - 教育商品alias，目前有专栏/内容/直播/线下课
   *  @param {number} query.userId - 用户id
   *  @param {number} query.fansType - 粉丝类型,查询直播时需要
   *  @return {Promise}
   */
  async getDetail(kdtId, query) {
    return this.invoke('getDetail', [kdtId, query]);
  }

  /**
   *  查询当前内容/直播所在专栏下的下一篇内容/直播
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/757961
   *
   *  @param {number} kdtId -
   *  @param {Object} eduProductQuery -
   *  @param {string} eduProductQuery.sortType - 排序类型：desc降序 asc生序
   *  @param {string} eduProductQuery.alias - 商品别名
   *  @param {number} eduProductQuery.buyerId - 用户id
   *  @return {Promise}
   */
  async getNextEduProductInfo(kdtId, eduProductQuery) {
    return this.invoke('getNextEduProductInfo', [kdtId, eduProductQuery]);
  }

  /**
   * @description 查询商品基本信息
   * @link http://zanapi.qima-inc.com/site/service/view/931310
   */
  async getSimpleProduct(
    kdtId,
    alias
  ) {
    return this.invoke('getSimpleProduct', [kdtId, alias]);
  }
}

module.exports = ClientEduProductFacade;
