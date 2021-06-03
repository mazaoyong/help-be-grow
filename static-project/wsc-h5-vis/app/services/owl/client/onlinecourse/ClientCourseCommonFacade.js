const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.api.client.onlinecourse.ClientCourseCommonFacade -  */
class ClientCourseCommonFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.onlinecourse.ClientCourseCommonFacade';
  }

  /**
   *  此接口用来查询商品基础信息，且支持多种商品的查询，包括：专栏、内容、直播、圈子等
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/524262
   *
   *  @param {number} kdtId -
   *  @param {Object} basicQueryCommand -
   *  @param {Array.<Array>} basicQueryCommand.aliases[] - 商品中心alias集合
   *  @param {Array} basicQueryCommand.aliases[] -
   *  @param {Array.<Array>} basicQueryCommand.goodsIds[] - 商品中心id集合
   *  @param {Array} basicQueryCommand.goodsIds[] -
   *  @return {Promise}
   */
  async findSimpleCourseList(kdtId, basicQueryCommand) {
    return this.invoke('findSimpleCourseList', [kdtId, basicQueryCommand]);
  }
}

module.exports = ClientCourseCommonFacade;
