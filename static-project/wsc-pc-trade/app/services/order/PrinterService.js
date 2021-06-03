const BaseService = require('../base/BaseService');

/**
 * PrinterService
 */
class PrinterService extends BaseService {
  /**
   * PrinterService
   */
  get SERVICE_NAME() {
    return 'com.youzan.mall.shop.api.service.printer.PrinterService';
  }

  /**
   *  获取打印机列表
   *  文档地址: http://zanapi.qima-inc.com/site/service/view/657672
   *  @param {object} PrinterInfoQueryDTO
   *  @return {Array}
   */
  listPrinters(PrinterInfoQueryDTO) {
    return this.invoke('listPrinters', [PrinterInfoQueryDTO]);
  }

  /**
   *  打印堂食小票
   *  文档地址: http://zanapi.qima-inc.com/site/service/view/657678
   *  @param {object} params
   *  @return {string}
   */
  printCateringTicket(params) {
    return this.invoke('printCateringTicket', [params]);
  }

  /**
   *  查询所有打印机(多网点)
   *  kdtId不为null或者0，storeId为null或者0 查询店铺开启多网点时，店铺下所有连接着的打印机
   *  如果kdtId不为null或者0，storeId也不为null或者0 则查询网点id为storeId 下的所有连接着的打印机
   *  接口文档地址 http://doc.qima-inc.com/pages/viewpage.action?pageId=44811191
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/182738
   *  @param {number} kdtId -
   *  @param {number} storeId - 门店id
   *  @return {Promise}
   */
  async listAllLinkedPrinters(kdtId, storeId) {
    return this.invoke('listAllLinkedPrinters', [kdtId, storeId]);
  }

  /**
   *  打印订单（开启多网点）
   *  接口文档地址 http://doc.qima-inc.com/pages/viewpage.action?pageId=41271932
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/182731
   *
   *  @param {Object} multiStorePrinterOrderReqDTO
   *  @param {string} multiStorePrinterOrderReqDTO.orderNo - 订单号
   *  @param {number} multiStorePrinterOrderReqDTO.kdtId - 口袋通id
   *  @param {number} multiStorePrinterOrderReqDTO.adminId - 操作人id
   *  @param {number} multiStorePrinterOrderReqDTO.printerId - 打印机id
   *  @param {number} multiStorePrinterOrderReqDTO.storeId - 门店id
   *  @return {Promise}
   */
  async printOrderAfterMultiStore(multiStorePrinterOrderReqDTO) {
    return this.invoke('printOrderAfterMultiStore', [multiStorePrinterOrderReqDTO]);
  }

  /**
   *  打印订单（未开启多网点）
   *  接口文档地址 http://doc.qima-inc.com/pages/viewpage.action?pageId=41271930
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/182730
   *  @param {Object} printerOrderReqDTO
   *  @param {string} printerOrderReqDTO.orderNo - 订单号
   *  @param {number} printerOrderReqDTO.kdtId - 口袋通id
   *  @param {number} printerOrderReqDTO.adminId - 操作人id
   *  @param {number} printerOrderReqDTO.printerId - 打印机id
   *  @return {Promise}
   */
  async printOrder(printerOrderReqDTO) {
    return this.invoke('printOrder', [printerOrderReqDTO]);
  }
}

module.exports = PrinterService;
