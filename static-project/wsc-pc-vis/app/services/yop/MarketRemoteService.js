const PCBaseService = require('@youzan/wsc-pc-base/app/services/base/PCBaseService');

/**
 * 商业化相关接口
 */
class MarketRemoteService extends PCBaseService {
  /**
   * SERVICE_NAME
   *
   * @return {string}
   * @constructor
   */
  get SERVICE_NAME() {
    return 'com.youzan.yop.api.MarketRemoteService';
  }

  /**
   * 获取插件服务状态
   * 文档：http://zanapi.qima-inc.com/site/service/view/2643
   *
   * @param {number} kdtId
   * @param {number} appId
   * @return {Promise<Object>}
   */
  async findApplicationStatus(kdtId, appId) {
    return this.invoke('findApplicationStatus', [kdtId, appId]);
  }

  /**
   * 小程序订购状态
   * 文档：http://zanapi.qima-inc.com/site/service/view/204422
   *
   * @param {number} kdtId
   * @return {Promise<{hasOrderedWeApp: boolean, isVipWeApp: boolean}>} res
   * @returns {boolean} res.useCommon - 是否点过立刻使用
   * @returns {boolean} res.isValid - 专享版是否有效
   * @returns {number} res.expiredTime - 专享版过期时间
   */
  async getWeAppStatus(kdtId) {
    const result = await this.invoke('isWeappAuthTeam', [kdtId]);
    return result;
  }
}

module.exports = MarketRemoteService;
