const BaseService = require('../../../base/BaseService');

/**
 * 线索相关
 */
class ClueRecordService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.clue.ClueRecordFacade';
  }

  /**
   *  分页查询跟进记录列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/402446
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} recordQuery - 查询参数
   *  @param {number} recordQuery.recordType - 动态记录类型，枚举值：{@link com.youzan.owl.pc.enums.clue.OwlClueRecordTypeEnum}
   *  @param {number} recordQuery.clueId - 线索id
   *  @param {Object} pageRequest - 分页参数
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @return {Promise}
   */
  async findPageClueRecords(kdtId, recordQuery, pageRequest) {
    return this.invoke('findPageClueRecords', [
      kdtId,
      recordQuery,
      pageRequest,
    ]);
  }

  /**
   *  线索详情页添加跟进记录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/413609
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} recordCommand - 创建实体
   *  @param {string} recordCommand.recordText - 跟进记录文本
   *  @param {number} recordCommand.clueId - 线索id
   *  @param {Array.<Array>} recordCommand.imageList[] - 跟进记录图片
   *  @param {string} recordCommand.revisitTime - 回访时间
   *  @param {Object} recordCommand.operator - 操作人实体
   *  @return {Promise}
   */
  async createClueRecord(kdtId, recordCommand) {
    return this.invoke('createClueRecord', [kdtId, recordCommand]);
  }

  /**
   *  线索详情页更新跟进记录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/400447
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} recordCommand - 更新实体
   *  @param {number} recordCommand.recordId - 跟进记录id
   *  @param {string} recordCommand.recordText - 跟进记录文本
   *  @param {number} recordCommand.clueId - 线索id
   *  @param {Array.<Array>} recordCommand.imageList[] - 跟进记录图片
   *  @param {string} recordCommand.revisitTime - 回访时间
   *  @param {Object} recordCommand.operator - 操作人实体
   *  @return {Promise}
   */
  async updateClueRecord(kdtId, recordCommand) {
    return this.invoke('updateClueRecord', [kdtId, recordCommand]);
  }
}

module.exports = ClueRecordService;
