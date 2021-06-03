const BaseService = require('../../../base/BaseService');

/**
 * com.youzan.owl.pc.api.shop.ChainShopQueryFacade
 */
class ChainShopQueryFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.shop.ChainShopQueryFacade';
  }

  /**
   *  查询用户归属连锁体系下的校区，支持客户、学员两种角色
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/425056
   *
   *  @param {number} operateKdtId -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} userRelatedShopQuery -
   *  @param {number} userRelatedShopQuery.role - 0:客户，1:学员
   *  @param {number} userRelatedShopQuery.userId - 用户的id（可以是客户或者学员）
   *  @return {Promise}
   */
  async findPageByUser(operateKdtId, pageRequest, userRelatedShopQuery) {
    return this.invoke('findPageByUser', [operateKdtId, pageRequest, userRelatedShopQuery]);
  }

  /**
   *  根据校区kdtIds批量查询校区店铺基础信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/466515
   *
   *  @param {number} operateKdtId -
   *  @param {Object} shopChainInfoQuery - 总部关联校区信息
   *  @param {Array.<Array>} shopChainInfoQuery.campusKdtIds[] - 选中的校区kdtId集合，如果isAllCampus为false，则取此字段值
   *  @param {Array} shopChainInfoQuery.campusKdtIds[] -
   *  @param {boolean} shopChainInfoQuery.isAllCampus - 是否是全部店铺
   *  @return {Promise}
   */
  async findListByKdtIds(operateKdtId, shopChainInfoQuery) {
    return this.invoke('findListByKdtIds', [operateKdtId, shopChainInfoQuery]);
  }
}

module.exports = ChainShopQueryFacade;
