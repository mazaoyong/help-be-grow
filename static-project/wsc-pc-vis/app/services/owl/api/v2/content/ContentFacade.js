const BaseService = require('../../../../base/BaseService');

/**
 * 内容商品相关接口
 * @class ContentFacadeService
 * @extends {BaseService}
 */
class ContentFacadeService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.v2.content.ContentFacade';
  }

  /**
   * 复制内容商品
   *
   * @see http://zanapi.qima-inc.com/site/service/view/319572
   * @param {*} kdtId
   * @param {*} alias 商品id
   * @return {Object}
   * @memberof ContentFacadeService
   */
  async putDuplicateContent(kdtId, alias) {
    const result = await this.invoke('copy', [kdtId, alias]);
    return result;
  }
}

module.exports = ContentFacadeService;
