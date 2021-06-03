const BaseService = require('../base/BaseService');
/**
 */
class ShopQueryService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.shop.ShopQueryFacade';
  }

  /**
   *  获取店铺列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/364041
   *
   *  @param {string} kdtId - 店铺id
   *  @param {Object} page -
   *  @param {string} page.pageNumber - 当前页
   *  @param {string} page.pageSize - 页数
   *  @param {Object} query -
   *  @param {string} query.shopTypeValues - 大的行业解决方案
   *  @param {string} query.shopTopics - 表示某个店铺类型下细分类型
   *
   */
  async queryShopSummaries(kdtId, page, query) {
    return this.invoke('queryShopSummaries', [kdtId, page, query]);
  }

  /**
   *  获取当前机构的信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/364040
   *
   *  @param {number} kdtId - 店铺id
   *
   */
  async getShopBaseInfoByKdtId(kdtId) {
    return this.invoke('getShopBaseInfoByKdtId', [kdtId]);
  }

  /**
   *  搜索连锁总部下面的店铺
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/428865
   *
   *  @param {Object} shopCampusQuery -
   *  @param {number} shopCampusQuery.hqKdtId - 总部店铺id
   *  @param {string} shopCampusQuery.shopLifecycleStatus - 搜索店铺生命周期
   *  @param {string} shopCampusQuery.name - 搜索店铺名称
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @return {Promise}
   */
  async findPageAllCampus(shopCampusQuery, pageRequest) {
    return this.invoke('findPageAllCampus', [shopCampusQuery, pageRequest]);
  }

  /**
   *  获取连锁总部下面所有的子店铺
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/427175
   *
   *  @param {number} kdtId -
   *  @return {Promise}
   */
  async findListAllCampus(kdtId) {
    return this.invoke('findListAllCampus', [kdtId]);
  }
}

module.exports = ShopQueryService;
