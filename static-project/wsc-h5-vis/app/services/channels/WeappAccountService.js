const BaseService = require('../base/BaseService');

class WeappAccountService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.channels.service.WeappAccountService';
  }

  /**
   * 获取小程序版本信息
   *
   * @param {number} kdtId: 店铺id
   * 文档地址：https://doc.qima-inc.com/pages/viewpage.action?pageId=46077433
   */
  async getWeappCodeLcByKdtId(kdtId) {
    const result = await this.invoke('getWeappCodeLcByKdtId', [kdtId]);
    return result;
  }

  /**
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/119048
   *
   *  @param {number} kdtId：店铺id
   *  @return {Promise}
   */
  async getWeappAccountByKdtId(kdtId) {
    return this.invoke('getWeappAccountByKdtId', [kdtId]);
  }
}

module.exports = WeappAccountService;
