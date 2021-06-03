const PCBaseService = require('@youzan/wsc-pc-base/app/services/base/PCBaseService');

/**
 * 渠道配置查询接口
 */
class MpAccountService extends PCBaseService {
  /**
   * SERVICE_NAME
   *
   * @return {string}
   * @constructor
   */
  get SERVICE_NAME() {
    return 'com.youzan.channels.service.MpAccountService';
  }

  /**
   * 获取微信公众号详情
   * 文档：https://doc.qima-inc.com/pages/viewpage.action?pageId=27934583
   *
   * @param {string} kdtId
   * @return {Promise<Object>}
   */
  async getMpAccount(kdtId) {
    return this.invoke('getMpAccountByKdtId', [kdtId]);
  }

  /**
   * 获取绑定微博详情
   *
   * @param {string} kdtId
   * @return {Promise<Object>}
   */
  async getWeiboInfo(kdtId) {
    return this.apiCall(
      {
        url: '/sinaweibo/user/getUserByKdtId',
        method: 'GET',
        data: {
          kdt_id: kdtId,
        },
      },
      {
        processCb: r => r,
        allowBigNumberInJSON: true,
      }
    );
  }
}

module.exports = MpAccountService;
