const BaseService = require('../../../../base/BaseService');

/* com.youzan.owl.pc.api.clue.enrollsetting.ClueTransferReasonPcFacade -  */
class ClueTransferReasonPcService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.clue.enrollsetting.ClueTransferReasonPcFacade';
  }

  /**
    *  分页查询流转原因
    *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/417313
    *
    *  @param {number} kdtId - 店铺id
    *  @param {Object} pageRequest -
    *  @param {number} pageRequest.pageNumber -
    *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
    *  @param {number} pageRequest.pageSize -
    *  @param {Object} pageRequest.sort -
    *  @param {Object} query -
    *  @param {number} query.applyGiveUpClue - 适用放弃线索 0：不适用 1：适用 2：全部
    *  @param {number} query.applyTransferClue - 适用转让线索 0：不适用 1：适用 2：全部
    *  @return {Promise}
    */
  async findTransferReasonPageByQuery(kdtId, pageRequest, query) {
    return this.invoke('findTransferReasonPageByQuery', [kdtId, pageRequest, query]);
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

  /**
    *  创建流转原因
    *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/417314
    *
    *  @param {number} kdtId - 店铺id
    *  @param {Object} command - 保存实体
    *  @param {string} command.reason - 流转原因
    *  @param {Object} command.config - 配置值
    *  @param {number} command.config.applyGiveUpClue - 适用放弃线索 1：适用 0：不适用
    *  @param {number} command.config.applyTransferClue - 适用转让线索 1：适用 0：不适用
    *  @param {number} command.serialNo - 序号
    *  @return {Promise}
    */
  async createTransferReason(kdtId, command) {
    return this.invoke('createTransferReason', [kdtId, command]);
  }

  /**
    *  更新流转原因
    *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/417315
    *
    *  @param {number} kdtId - 店铺id
    *  @param {Object} command - 保存实体
    *  @param {string} command.reason - 流转原因
    *  @param {number} command.reasonId - id
    *  @param {Object} command.config - 配置值
    *  @param {number} command.config.applyGiveUpClue - 适用放弃线索 1：适用 0：不适用
    *  @param {number} command.config.applyTransferClue - 适用转让线索 1：适用 0：不适用
    *  @param {number} command.serialNo - 序号
    *  @return {Promise}
    */
  async updateTransferReason(kdtId, command) {
    return this.invoke('updateTransferReason', [kdtId, command]);
  }

  /**
   *  删除
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/417316
   *
   *  @param {number} kdtId - 店铺id
   *  @param {number} reasonId - id
   *  @return {Promise}
   */
  async deleteTransferReason(kdtId, reasonId) {
    return this.invoke('deleteTransferReason', [kdtId, reasonId]);
  }
}

module.exports = ClueTransferReasonPcService;
