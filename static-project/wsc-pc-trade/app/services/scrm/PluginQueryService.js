const BaseService = require('../base/BaseService');

/**
 * com.youzan.scrm.api.benefit.plugin.plugin.service.PluginQueryService
 */
class PluginQueryService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.scrm.api.benefit.plugin.plugin.service.PluginQueryService';
  }

  /**
   *  查询权益元件信息
   <p>
   kdtId + page + pageSize 分页查询商家权益元件
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/345654
   *
   *  @param {Object} listDTO -
   *  @param {number} listDTO.kdtId - 店铺ID
   *  @param {string} listDTO.requestId -
   *  @param {string} listDTO.appName -
   *  @param {string} listDTO.industryTplId - 行业模版ID
   *  @param {number} listDTO.pageSize - 分页大小
   *  @param {number} listDTO.page - 分页页码
   *  @return {Promise}
   */
  async list(listDTO) {
    return this.invoke('list', [listDTO]);
  }
}

module.exports = PluginQueryService;
