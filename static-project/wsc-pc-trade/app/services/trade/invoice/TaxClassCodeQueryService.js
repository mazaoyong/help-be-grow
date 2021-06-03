const BaseService = require('../../base/BaseService');

/**
 * com.youzan.trade.invoice.api.taxinfo.query.TaxClassCodeQueryService
 */
class TaxClassCodeQueryService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.trade.invoice.api.taxinfo.query.TaxClassCodeQueryService';
  }

  /**
   *  获取税收分类的根结点
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/6259
   *  @return {Promise<any>}
   */
  async getTaxClassRootNodes() {
    return this.invoke('getTaxClassRootNodes', []);
  }

  /**
   *  根据税收分类的当前节点 获取子节点
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/6262
   *
   *  @param {string} pCode -
   *  @return {Promise<any>}
   */
  async getTaxClassLeafNodesByParentCode(pCode) {
    return this.invoke('getTaxClassLeafNodesByParentCode', [pCode]);
  }

  /**
   *  根据税收分类编码前缀查询
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/14017
   *
   *  @param {object} taxClsCodeQueryReqDTO -
   *  @param {string} taxClsCodeQueryReqDTO.taxClassCode -
   *  @param {number} taxClsCodeQueryReqDTO.pageNo -
   *  @param {number} taxClsCodeQueryReqDTO.pageSize -
   *  @param {string} taxClsCodeQueryReqDTO.keyWord -
   *  @return {Promise<any>}
   */
  async getNodesByPrefixClsCode(taxClsCodeQueryReqDTO) {
    return this.invoke('getNodesByPrefixClsCode', [taxClsCodeQueryReqDTO]);
  }

  /**
   *  根据中文关键字模糊匹配
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/10929
   *
   *  @param {object} taxClsCodeQueryReqDTO -
   *  @param {string} taxClsCodeQueryReqDTO.taxClassCode -
   *  @param {number} taxClsCodeQueryReqDTO.pageNo -
   *  @param {number} taxClsCodeQueryReqDTO.pageSize -
   *  @param {string} taxClsCodeQueryReqDTO.keyWord -
   *  @return {Promise<any>}
   */
  async getLeafNodesByKeyWord(taxClsCodeQueryReqDTO) {
    return this.invoke('getLeafNodesByKeyWord', [taxClsCodeQueryReqDTO]);
  }

  /**
   *  根据税收分类编码模糊匹配
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/10926
   *
   *  @param {object} taxClsCodeQueryReqDTO -
   *  @param {string} taxClsCodeQueryReqDTO.taxClassCode -
   *  @param {number} taxClsCodeQueryReqDTO.pageNo -
   *  @param {number} taxClsCodeQueryReqDTO.pageSize -
   *  @param {string} taxClsCodeQueryReqDTO.keyWord -
   *  @return {Promise<any>}
   */
  async getLeafNodesByTaxClassCode(taxClsCodeQueryReqDTO) {
    return this.invoke('getLeafNodesByTaxClassCode', [taxClsCodeQueryReqDTO]);
  }
}

module.exports = TaxClassCodeQueryService;
