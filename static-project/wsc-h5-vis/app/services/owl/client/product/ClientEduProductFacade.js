const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.api.client.product.ClientEduProductFacade -  */
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
   *  教育商品简要信息统一查询接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/718758
   *
   *  @param {number} kdtId -
   *  @param {string} alias -
   *  @return {Promise}
   */
  async getSimple(kdtId, alias) {
    return this.invoke('getSimple', [kdtId, alias]);
  }

  /**
   * 分销员海报页面查询信息
   * 场景：分销员海报页面
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/895601
   *
   *  @param {number} kdtId -
   *  @param {string} alias -
   *  @return {Promise}
  */
  async getDistributorDetail(kdtId, alias) {
    return this.invoke('getDistributorDetail', [kdtId, alias]);
  }

  /**
   *  营销活动中间页查询信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/911479
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {string} query.alias - 教育商品alias，目前有专栏/内容/直播/线下课
   *  @param {number} query.userId - 用户id
   *  @return {Promise}
   */
  async getProductBriefInfoWithUmpActivity(kdtId, query) {
    return this.invoke('getProductBriefInfoWithUmpActivity', [kdtId, query]);
  }

  /**
   *  C端查询商品资产状态
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/921051
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {string} query.alias - 商品别名
   *  @param {number} query.userId - 用户id
   *  @return {Promise}
   */
  async getAssetState(kdtId, query) {
    return this.invoke('getAssetState', [kdtId, query]);
  }
}

module.exports = ClientEduProductFacade;
