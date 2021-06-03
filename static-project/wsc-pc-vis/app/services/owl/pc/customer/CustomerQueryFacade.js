const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.pc.api.customer.CustomerQueryFacade -  */
class CustomerQueryFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.customer.CustomerQueryFacade';
  }

  /**
   *  分页查询客户信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/722430
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页和排序的条件
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query - 查询条件
   *  @param {number} query.kdtId - 店铺id
   *  @param {string} query.keyword - 模糊搜索的关键词，搜客户昵称或者名字或者手机号
   *  @return {Promise}
   */
  async findPage(kdtId, pageRequest, query) {
    return this.invoke('findPage', [kdtId, pageRequest, query]);
  }
}

module.exports = CustomerQueryFacade;
