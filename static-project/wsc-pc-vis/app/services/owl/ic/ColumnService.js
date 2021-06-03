// 打卡活动相关接口
const BaseService = require('../../base/BaseService');

class ColumnService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.ic.api.column.ColumnFacade';
  }

  /**
   * 根据别名查询专栏基本信息
   *
   * @see http://zanapi.qima-inc.com/site/service/view/200929
   * @param {number} kdtId - kdtId
   * @param {string} alias - 专栏别名
   *
   * */
  async getColumnDTOByAlias(kdtId, alias) {
    const result = this.invoke('getColumnDTOByAlias', [kdtId, alias]);

    return result;
  }
}

module.exports = ColumnService;
