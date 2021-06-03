const BaseService = require('../../../../base/BaseService');

/**
 * 内容商品相关接口
 * @class ColumnFacadeService
 * @extends {BaseService}
 */
class ColumnFacadeService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.v2.column.ColumnFacade';
  }

  /**
   * 复制内容商品
   *
   * @see http://zanapi.qima-inc.com/site/service/view/319573
   * @param {*} kdtId
   * @param {*} alias 商品id
   * @return {Object}
   * @memberof ColumnFacadeService
   */
  async putDuplicateColumn(kdtId, alias) {
    const result = await this.invoke('copy', [kdtId, alias]);
    return result;
  }
}

module.exports = ColumnFacadeService;
