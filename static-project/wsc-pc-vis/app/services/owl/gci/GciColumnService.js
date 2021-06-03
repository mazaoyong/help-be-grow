// 打卡日记相关接口
const BaseService = require('../../base/BaseService');

class GciColumnService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.gci.api.facade.GciColumnFacade';
  }

  /**
   * 分页查询专栏列表，包含是否可以绑定打卡的状态及不能绑定的原因
   *
   * @memberof GciColumnService
   * @see http://zanapi.qima-inc.com/site/service/view/200903
   * @param {number} kdtId - kdtId
   * @param {number} page - 页码
   * @param {number} size - 每夜大小
   */
  async getCloumnList(req) {
    const result = await this.invoke('listColumn', [req]);

    result.content.forEach(item => {
      item.id = item.columnAlias;
    });

    return result;
  }
}

module.exports = GciColumnService;
