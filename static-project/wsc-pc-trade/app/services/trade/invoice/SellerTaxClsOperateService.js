const BaseService = require('../../base/BaseService');

/**
 * com.youzan.trade.invoice.api.seller.operate.SellerTaxClsOperateService
 */
class SellerTaxClsOperateService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.trade.invoice.api.seller.operate.SellerTaxClsOperateService';
  }

  /**
   *  新增商家自定义税收分类信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/6874
   *
   *  @param {object} sellerTaxClsOperateReqDTO
   *  @param {string} sellerTaxClsOperateReqDTO.taxClassCode - 分类编码
   *  @param {number} sellerTaxClsOperateReqDTO.taxRate - 税率
   *  @param {string} sellerTaxClsOperateReqDTO.bizNo - 业务字段，比如说订单号
   *  @param {Object} sellerTaxClsOperateReqDTO.extension - 扩展信息
   *  @param {number} sellerTaxClsOperateReqDTO.kdtId - 店铺ID
   *  @param {string} sellerTaxClsOperateReqDTO.zeroRateIdentify - 零税率标识
   *  @param {string} sellerTaxClsOperateReqDTO.requestId - 请求幂等字段
   *  @param {string} sellerTaxClsOperateReqDTO.bizDate - 业务发生的时间(这笔请求发起的时间)
   *  @param {string} sellerTaxClsOperateReqDTO.categoryName - 分类名称
   *  @param {string} sellerTaxClsOperateReqDTO.invoiceAssetId - 商家发票资产id
   *  @return {Promise<any>}
   */
  async addSellerTaxClassInfo(sellerTaxClsOperateReqDTO) {
    return this.invoke('addSellerTaxClassInfo', [sellerTaxClsOperateReqDTO]);
  }

  /**
   *  修改商家自定义税收分类信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/6877
   *
   *  @param {object} sellerTaxClsOperateReqDTO
   *  @param {string} sellerTaxClsOperateReqDTO.taxClassCode - 分类编码
   *  @param {number} sellerTaxClsOperateReqDTO.taxRate - 税率
   *  @param {string} sellerTaxClsOperateReqDTO.bizNo - 业务字段，比如说订单号
   *  @param {Object} sellerTaxClsOperateReqDTO.extension - 扩展信息
   *  @param {number} sellerTaxClsOperateReqDTO.kdtId - 店铺ID
   *  @param {string} sellerTaxClsOperateReqDTO.zeroRateIdentify - 零税率标识
   *  @param {string} sellerTaxClsOperateReqDTO.requestId - 请求幂等字段
   *  @param {string} sellerTaxClsOperateReqDTO.bizDate - 业务发生的时间(这笔请求发起的时间)
   *  @param {string} sellerTaxClsOperateReqDTO.categoryName - 分类名称
   *  @param {string} sellerTaxClsOperateReqDTO.invoiceAssetId - 商家发票资产id
   *  @return {Promise<any>}
   */
  async modifySellerTaxClassInfo(sellerTaxClsOperateReqDTO) {
    return this.invoke('modifySellerTaxClassInfo', [sellerTaxClsOperateReqDTO]);
  }

  /**
   *  删除商家自定义税收分类信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/6880
   *
   *  @param {object} deleteSellerTaxClsReqDTO
   *  @param {string} deleteSellerTaxClsReqDTO.taxClassCode - 分类编码
   *  @param {string} deleteSellerTaxClsReqDTO.bizNo - 业务字段，比如说订单号
   *  @param {Object} deleteSellerTaxClsReqDTO.extension - 扩展信息
   *  @param {number} deleteSellerTaxClsReqDTO.kdtId - 店铺ID
   *  @param {string} deleteSellerTaxClsReqDTO.requestId - 请求幂等字段
   *  @param {string} deleteSellerTaxClsReqDTO.bizDate - 业务发生的时间(这笔请求发起的时间)
   *  @param {string} deleteSellerTaxClsReqDTO.invoiceAssetId - 商家发票资产id
   *  @return {Promise<any>}
   */
  async deleteSellerTaxClassInfo(deleteSellerTaxClsReqDTO) {
    return this.invoke('deleteSellerTaxClassInfo', [deleteSellerTaxClsReqDTO]);
  }

  /**
   *  新增商家自定义运费税收分类信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/662370
   *  @param {Object} sellerTaxClsOperateReqDTO -
   *  @param {string} sellerTaxClsOperateReqDTO.taxClassCode - 分类编码
   *  @param {string} sellerTaxClsOperateReqDTO.taxRate - 税率
   *  @param {string} sellerTaxClsOperateReqDTO.bizNo - 业务字段，比如说订单号
   *  @param {Object} sellerTaxClsOperateReqDTO.extension - 扩展信息
   *  @param {string} sellerTaxClsOperateReqDTO.zeroRateIdentify - 零税率标识
   *  @param {number} sellerTaxClsOperateReqDTO.kdtId - 店铺ID
   *  @param {string} sellerTaxClsOperateReqDTO.requestId - 请求幂等字段
   *  @param {string} sellerTaxClsOperateReqDTO.bizDate - 业务发生的时间(这笔请求发起的时间)
   *  @param {string} sellerTaxClsOperateReqDTO.invoiceId - 发票id 选填
   *  @param {string} sellerTaxClsOperateReqDTO.categoryName - 分类名称
   *  @param {string} sellerTaxClsOperateReqDTO.invoiceAssetId - 商家发票资产id
   *  @return {Promise}
   */
  async addSellerFreightTaxClassInfo(sellerTaxClsOperateReqDTO) {
    return this.invoke('addSellerFreightTaxClassInfo', [sellerTaxClsOperateReqDTO]);
  }

  /**
   *  修改商家自定义运费税收分类信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/693951
   *
   *  @param {Object} sellerTaxClsOperateReqDTO
   *  @param {string} sellerTaxClsOperateReqDTO.taxClassCode - 分类编码
   *  @param {string} sellerTaxClsOperateReqDTO.taxRate - 税率
   *  @param {string} sellerTaxClsOperateReqDTO.bizNo - 业务字段，比如说订单号
   *  @param {Object} sellerTaxClsOperateReqDTO.extension - 扩展信息
   *  @param {string} sellerTaxClsOperateReqDTO.zeroRateIdentify - 零税率标识
   *  @param {number} sellerTaxClsOperateReqDTO.kdtId - 店铺ID
   *  @param {string} sellerTaxClsOperateReqDTO.requestId - 请求幂等字段
   *  @param {string} sellerTaxClsOperateReqDTO.bizDate - 业务发生的时间(这笔请求发起的时间)
   *  @param {string} sellerTaxClsOperateReqDTO.invoiceId - 发票id 选填
   *  @param {string} sellerTaxClsOperateReqDTO.categoryName - 分类名称
   *  @param {string} sellerTaxClsOperateReqDTO.invoiceAssetId - 商家发票资产id
   *  @return {Promise}
   */
  async modifySellerFreightTaxClassInfo(sellerTaxClsOperateReqDTO) {
    return this.invoke('modifySellerFreightTaxClassInfo', [sellerTaxClsOperateReqDTO]);
  }
}

module.exports = SellerTaxClsOperateService;
