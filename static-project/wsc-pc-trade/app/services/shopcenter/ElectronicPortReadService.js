const BaseService = require('../base/BaseService');

/**
 * @typedef {import('definitions/cross-border').IElectronicPort} IElectronicPort
 */

/**
 *  com.youzan.shopcenter.outer.service.crossborder.ElectronicPortReadService
 */
class ElectronicPortReadService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.shopcenter.outer.service.crossborder.ElectronicPortReadService';
  }

  /**
   *  查询电子口岸列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/317974
   *
   *  @param {number} kdtId - 店铺kdtId
   *  @return {Promise<IElectronicPort[]>}
   */
  async listElectronicPorts(kdtId) {
    return this.invoke('listElectronicPorts', [kdtId]);
  }
}

module.exports = ElectronicPortReadService;
