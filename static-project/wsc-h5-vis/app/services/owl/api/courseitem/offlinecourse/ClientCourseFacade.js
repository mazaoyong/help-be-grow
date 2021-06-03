const BaseService = require('../../../../base/BaseService');

/* com.youzan.owl.api.courseitem.offlinecourse.ClientCourseFacade -  */
class ClientCourseFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.courseitem.offlinecourse.ClientCourseFacade';
  }

  /**
   *  查询线下课商品的sku信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/911308
   *
   *  @param {number} kdtId -
   *  @param {string} alias -
   *  @return {Promise}
   */
  async getSkuFormatModel(kdtId, alias) {
    return this.invoke('getSkuFormatModel', [kdtId, alias]);
  }
}

module.exports = ClientCourseFacade;
