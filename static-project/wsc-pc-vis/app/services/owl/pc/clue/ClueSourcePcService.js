const BaseService = require('../../../base/BaseService');

/**
 * 线索相关
 */
class ClueSourcePcService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.clue.enrollsetting.ClueSourcePcFacade';
  }

  /**
   *  分页查询线索来源分组（含有线索来源）
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/422952
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页参数
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {[object Object]} pageRequest.sort.orders -
   *  @param {Object} query -
   *  @param {boolean} query.needSystemDefault - 是否需要系统默认
   *  @return {Promise}
   */
  async findSourceGroupPage(kdtId, pageRequest, query) {
    return this.invoke('findSourceGroupPage', [kdtId, pageRequest, query]);
  }
}

module.exports = ClueSourcePcService;
