const BaseService = require('../../../base/BaseService');
// const { CHANNELS, GOODS_TYPES, PCT_GROUPS } = require('../../constants/goods-selector');

/** com.youzan.owl.ic.api.aggregate.OwlProductAggregateFacade -  */
class GoodsSelectorItemService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.ic.api.aggregate.OwlProductAggregateFacade';
  }

  /**
   *  组合商品分页查询，查商品中心
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/283831
   *
   *  @param {integer} kdtId - 店铺ID
   *  @param {Object} pageRequest - 分页请求
   *  @param {Object} query - 查询条件
   *  @param {number} query.channel - 0 自营 1 分销 现在只有专栏有分销，其他都是自营
   *  @param {number} query.subType - 知识付费类型
   *  @return {Object}
   */
  async findPageWithIc(kdtId, pageRequest, query) {
    return this.invoke('findPageWithIc', [kdtId, pageRequest, query]);
  }

  /**
   *  组合商品分页查询，查商品中心
   *
   *  @see http://zanapi.qima-inc.com/site/service/view/283832
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} aggregateProductQuery - 查询条件
   *  @return {Object}
   */
  async find(kdtId, aggregateProductQuery) {
    return this.invoke('find', [kdtId, aggregateProductQuery]);
  }

  /**
   *  组合商品分页查询，并且吐出skuInfo
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/559650
   *
   *  @param {number} kdtId -
   *  @param {Object} aggregateProductQuery -
   *  @param {Array.<Array>} aggregateProductQuery.aliases[] - aliases和productIds二者填其一
   *  @param {Array} aggregateProductQuery.aliases[] -
   *  @param {Array.<Array>} aggregateProductQuery.productIds[] - aliases和productIds二者填其一
   *  @param {Array} aggregateProductQuery.productIds[] -
   *  @return {Promise}
   */
  async findWithSku(kdtId, aggregateProductQuery) {
    return this.invoke('findWithSku', [kdtId, aggregateProductQuery]);
  }

  /**
   *  查询知识付费商品、线下课
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/519558
   *
   *  @param {number} kdtId -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query -
   *  @param {number} query.showSoldOut - 是否显示售罄, 常量是 ItemIsSoldOutEnum: 0: 在售, sold_status in (0, 1, 3) 1: 售罄或部分售罄, sold_status in (2, 3) 2: 全部 0,1,2,3 3: 有赞出售中 1,3 4: 有赞全部  1,2,3 5: 全部售罄  2 6: 部分售罄  3 see ItemSoldEnum
   *  @param {boolean} query.showHide - 是否显示隐藏的商品
   *  @param {number} query.channel - 0 自营 1 分销 现在只有专栏有分销，其他都是自营
   *  @param {number} query.subType - 知识付费类型 0 全部 1 专栏 2 内容 4 直播 10课程商品
   *  @param {number} query.mediaType - 内容类型 1:图文内容 2:音频内容 3:视频内容
   *  @param {string} query.keyword - 搜索关键字 目前只支持title
   *  @return {Promise}
   */
  async findOwlWithCourseProduct(kdtId, pageRequest, query) {
    return this.invoke('findOwlWithCourseProduct', [kdtId, pageRequest, query]);
  }
}

module.exports = GoodsSelectorItemService;
