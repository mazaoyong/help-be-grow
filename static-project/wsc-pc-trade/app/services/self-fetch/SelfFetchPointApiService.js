const SelfFetchBaseService = require('./SelfFetchBaseService');
/**
 * 自提点相关
 */
class SelfFetchPointApiService extends SelfFetchBaseService {
  get SERVICE_NAME() {
    return 'com.youzan.retail.trademanager.biz.api.service.SelfFetchPointApi';
  }
  /**
   *  更新自提点的配置
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/835823
   *
   *  @param {Object} config - 配置参数
   *  @return {Promise}
   */
  async updateTicket(config) {
    return this.invoke('updateTicket', [config]);
  }
  /**
   *  查询自提点的配置
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/835823
   *
   *  @param {Object} query - 查询参数
   *  @return {Promise}
   */
  async querySelfFetchPoint(query) {
    return this.invoke('querySelfFetchPoint', [query]);
  }
}

module.exports = SelfFetchPointApiService;
