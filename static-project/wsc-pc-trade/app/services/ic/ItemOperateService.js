const BaseService = require('./IcBaseService');

/**
 * com.youzan.ic.service.ItemOperateService
 */
class ItemOperateService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ic.service.ItemOperateService';
  }

  /**
   *  根据kdtId,itemIds,批量更新商品的税收分类编码
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/114973
   *
   *  @param {object} param -
   *  @param {string} param.taxClassCode - 税收分类编码
   *  @param {number} param.kdtId - kdtId
   *  @param {string} param.fromApp - 请求来源
   *  @param {string} param.requestId - UUID
   *  @param {Array<Array<number>>} param.itemIds[] - 商品ids
   *  @param {string} param.operator - 操作人信息，{'user_id': userId, 'nick_name': nickName, 'client_ip': clientIp}
   *  @return {Promise<any>}
   */
  async updateTaxClassCode(param) {
    return this.invoke('updateTaxClassCode', [param]);
  }
}

module.exports = ItemOperateService;
