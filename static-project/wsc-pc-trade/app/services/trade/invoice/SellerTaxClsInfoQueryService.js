const BaseService = require('../../base/BaseService');

/**
 * com.youzan.trade.invoice.api.seller.query.SellerTaxClsInfoQueryService
 */
class SellerTaxClsInfoQueryService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.trade.invoice.api.seller.query.SellerTaxClsInfoQueryService';
  }

  /**
   *  分页查询税收分类信息实体
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/6871
   *
   *  @param {object} reqDTO -
   *  @param {number} reqDTO.kdtId -
   *  @param {number} reqDTO.pageNo -
   *  @param {number} reqDTO.pageSize -
   *  @return {Promise<any>}
   */
  async getSellerTaxClassByPage(reqDTO) {
    return this.invoke('getSellerTaxClassByPage', [reqDTO]);
  }

  /**
   *  店铺税收分类信息实体查询
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/10290
   *
   *  @param {number} kdtId -
   *  @param {string} taxClsCode -
   *  @return {Promise<any>}
   */
  async getSellerTaxClassByCode(kdtId, taxClsCode) {
    return this.invoke('getSellerTaxClassByCode', [kdtId, taxClsCode]);
  }

  /**
   *  批量查询税收分类信息实体
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/100080
   *
   *  @param {number} kdtId -
   *  @param {array} taxClsCodes -
   *  @return {object}
   */
  async getTaxClassByCodeList(kdtId, taxClsCodes) {
    return this.invoke('batchQuerySellerTaxClass', [kdtId, taxClsCodes]);
  }

  /**
   *  查询商家设置的运费编码及税率
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/662366
   *
   *  @param {number} kdtId -
   *  @return {Promise}
   */
  async queryFreightTax(kdtId) {
    return this.invoke('queryFreightTax', [kdtId]);
  }
}

module.exports = SellerTaxClsInfoQueryService;
