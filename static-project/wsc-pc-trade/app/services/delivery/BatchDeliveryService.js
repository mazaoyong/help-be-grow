const DeliveryBaseService = require('./DeliveryBaseService');

/**
 * 批量发货
 *
 * @class BatchDeliveryService
 * @extends {DeliveryBaseService}
 */
class BatchDeliveryService extends DeliveryBaseService {
  /**
   * 服务名称
   *
   * @readonly
   * @memberof BatchDeliveryService
   */
  get SERVICE_NAME() {
    return 'com.youzan.trade.dc.api.service.extra.BatchDeliveryService';
  }

  /**
   * 根据批次号获取处理进度
   *
   * @param {number} kdtId
   * @param {string} batchNo
   *
   * @return {Promise.<object>}
   *
   * @memberof BatchDeliveryService
   *
   * doc: http://zanapi.qima-inc.com/site/service/view/187888
   */
  getBatchProgress(kdtId, batchNo) {
    return this.invoke('batchProgress', [{ kdtId, batchNo }]);
  }

  /**
   * 批次详情列表信息
   *
   * @param {object} data
   * @param {number} data.kdtId       批次号
   * @param {string=} data.batchNo     批次号
   * @param {number=} data.batchStatus 批次状态 - 1: 处理中: 2: 处理完成；
   * @param {string=} data.operator    操作人
   * @param {string=} data.operatorId  操作人ID
   * @param {number=} data.startDate   开始时间
   * @param {number=} data.endDate     结束时间
   * @param {number} data.page        页码
   * @param {number} data.pageSize    每页数量
   *
   * @return {Promise.<Array.<object>>}
   *
   * @memberof BatchDeliveryService
   *
   * doc: http://zanapi.qima-inc.com/site/service/view/187889
   */
  getBatchDetails(data) {
    return this.invoke('listBatchDetail', [data]);
  }

  /**
   *
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/286869
   *
   *  @param {Object} req -
   *  @param {number} req.kdtId -
   *  @param {string} req.operatorId -
   *  @param {string} req.operator -
   *  @return {Promise}
   */
  async getUploadToken(req) {
    return this.invoke('getToken', [req]);
  }

  /**
   * 批次接入
   *
   * @param {object} data
   * @param {number} data.kdtId                  店铺ID
   * @param {string} data.operator               操作人
   * @param {string} data.remark                 备注
   * @param {string} data.batchSource            批次业务来源 如零售：RETAIL；微商城：WSC; 零售连锁：RETAIL_CHAIN
   * @param {string} data.batchBiz               批次业务
   *                                             批量发货：BATCH_DELIVERY；
   *                                             批量退款：BATCH_REFUND;
   *                                             批量修改物流 - BATCH_MODIFY_EXPRESS
   * @param {string} data.version                SDK 版本，用于逻辑兼容 默认：1.0
   * @param {object} data.batchParamDTO
   * @param {string} data.batchParamDTO.filePath 文件路径
   *
   * @return {Promise.<{batchNo: string}>}
   *
   * @memberof BatchDeliveryService
   *
   * doc: http://zanapi.qima-inc.com/site/service/view/187887
   */
  access(data) {
    return this.invoke('access', [data]);
  }
}

module.exports = BatchDeliveryService;
