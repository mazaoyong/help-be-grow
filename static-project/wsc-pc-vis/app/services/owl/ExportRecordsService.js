// 导出记录接口
const BaseService = require('../base/BaseService');

class ExportRecordsService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.ExportRecordsService';
  }

  /**
   * 导出列表
   *
   * @see http://zanapi.qima-inc.com/site/service/view/136402
   * @param {number} kdtId - kdtId
   * @param {number} [page=1] - 页码
   * @param {number} [size=10] - 每页大小
   * @returns {Promise.<Object>} 返回列表
   * @memberof ExportRecordsService
   */
  async getExportsLists(req) {
    const result = await this.invoke('getPageList', [req]);
    return result;
  }
}

module.exports = ExportRecordsService;
