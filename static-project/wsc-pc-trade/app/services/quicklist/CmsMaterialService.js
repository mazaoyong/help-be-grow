const BaseService = require('../base/BaseService');

/**
 * CmsMaterialService
 */
class CmsMaterialService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ebiz.mall.gemini.api.service.cms.CmsMaterialService';
  }

  /**
   *  单个查询
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/392275
   *
   *  @param {Object} request -
   *  @param {string} request.channelAlias - 频道别名
   *  @param {number} request.bizCode - 业务线编码 CmsBizEnums
   *  @param {number} request.pageSize - 页数 默认20
   *  @param {string} request.resourceAlias - 资源位别名
   *  @param {number} request.page - 页码 默认1
   *  @param {string} request.referenceUrl - 页面来源
   *  @return {Promise}
   */
  async query(request) {
    return this.invoke('query', [request]);
  }
}

module.exports = CmsMaterialService;
