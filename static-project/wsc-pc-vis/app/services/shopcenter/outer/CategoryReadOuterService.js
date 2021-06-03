const BaseService = require('../../base/BaseService');

/** com.youzan.shopcenter.outer.service.category.CategoryReadOuterService -  */
class CategoryReadOuterService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.shopcenter.outer.service.category.CategoryReadOuterService';
  }

  /**
   *  查询微商城教育版类目树
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/213952
   *
   *
   *  @return {Object}
   */
  async queryWscEduCategoryTree() {
    return this.invoke('queryWscEduCategoryTree', []);
  }
}

module.exports = CategoryReadOuterService;
