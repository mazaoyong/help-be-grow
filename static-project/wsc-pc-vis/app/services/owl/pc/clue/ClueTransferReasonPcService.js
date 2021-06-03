const BaseService = require('../../../base/BaseService');

/**
 * 线索相关
 */
class ClueTransferReasonPcService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.clue.enrollsetting.ClueTransferReasonPcFacade';
  }

  /**
   *  分页查询流转原因
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/417312
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {[object Object]} pageRequest.sort.orders -
   *  @return {Promise}
   */
  async findTransferReasonPage(kdtId, pageRequest) {
    return this.invoke('findTransferReasonPage', [kdtId, pageRequest]);
  }
}

module.exports = ClueTransferReasonPcService;
