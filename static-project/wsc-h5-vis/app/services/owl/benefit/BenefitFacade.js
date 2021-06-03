const BaseService = require('../../base/BaseService');

class BenefitFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.benefit.BenefitFacade';
  }

  /**
   *  获取权益包详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/440015
   *
   *  @param {number} operatorKdtId - 操作ID
   *  @param {Object} query - 查询条件
   *  @param {number} query.kdtId - 店铺ID
   *  @param {string} query.alias - 权益包别名
   *  @param {number} query.userId - 用户ID
   *  @return {Promise}
   */
  async getBenefitPackageDetail(operatorKdtId, query) {
    return this.invoke('getBenefitPackageDetail', [operatorKdtId, query]);
  }

  /**
   *  分页条件查询权益包项
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/431821
   *
   *  @param {number} operatorKdtId - 操作店铺ID
   *  @param {Object} pageRequest - 分页请求
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query - 查询条件
   *  @param {number} query.kdtId - 店铺ID
   *  @param {number} query.type - 类型，0：内容，1：专栏
   *  @param {string} query.packageAlias - 权益包ID
   *  @return {Promise}
   */
  async findBenefitItemDetailPage(operatorKdtId, pageRequest, query) {
    return this.invoke('findBenefitItemDetailPage', [
      operatorKdtId,
      pageRequest,
      query,
    ]);
  }

  /**
   *  获取用户所有领取过的权益包
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/586287
   *
   *  @param {number} kdtId -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {[object Object]} pageRequest.sort.orders -
   *  @param {number} buyerId -
   *  @return {Promise}
   */
  async getBenefitPackageAllBuyDetail(kdtId, page, pageSize, buyerId) {
    return this.invoke('getBenefitPackageAllBuyDetail', [kdtId, page, pageSize, buyerId]);
  }

  /**
   *  获取用户所有领取过的权益包
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/600984
   *
   *  @param {number} kdtId -
   *  @param {number} buyerId -
   *  @return {Promise}
   */
  async getVipBenefitPackages(kdtId, buyerId) {
    return this.invoke('getVipBenefitPackages', [kdtId, buyerId]);
  }
}

module.exports = BenefitFacade;
