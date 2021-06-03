const DeliveryBaseService = require('./DeliveryBaseService');

/**
 * 微信物流助手
 */
class WechatDeliveryService extends DeliveryBaseService {
  get SERVICE_NAME() {
    return 'com.youzan.logistics.api.waybill.service.WechatDeliveryService';
  }

  /**
   *  物流助手-快递配置查询
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/893321
   *
   *  @param {Object} reqeustDTO -
   *  @param {boolean} reqeustDTO.includePrinterInfo - 是否查询打印员信息
   *  @param {number} reqeustDTO.kdtId -
   *  @param {boolean} reqeustDTO.includeAllSupportDeliveryAddress - 是否返回店铺的所有发货地址
   *  @return {Promise}
   */
  async searchWechatDeliveryConfig(reqeustDTO) {
    return this.invoke('searchWechatDeliveryConfig', [reqeustDTO]);
  }

  /**
   *
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/894426
   *
   *  @param {Object} requestDTO -
   *  @param {Object} requestDTO.addressDTO - 该账号关联的发货地址
   *  @param {Object} requestDTO.serviceTypeDTO - 该账号已选择的服务类型
   *  @param {number} requestDTO.kdtId -
   *  @param {string} requestDTO.bindNo - 商家绑定的快递账号在物流侧的编码由logistics生产、维护
   *  @param {string} requestDTO.bizId - 商家在快递公司的客户编码(或者账号)
   *  @return {Promise}
   */
  async updateWechatDelvieryConfig(requestDTO) {
    return this.invoke('updateWechatDelvieryConfig', [requestDTO]);
  }

  /**
   *  触发微信物流绑定账号的刷新
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/893322
   *
   *  @param {Object} requestDTO -
   *  @param {number} requestDTO.kdtId -
   *  @return {Promise}
   */
  async refreshWechatDeliveryAccount(requestDTO) {
    return this.invoke('refreshWechatDeliveryAccount', [requestDTO]);
  }

  /**
   *  分页查询微信物流打印员信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/893324
   *
   *  @param {Object} requestDTO -
   *  @param {number} requestDTO.kdtId -
   *  @param {number} requestDTO.pageSize -
   *  @param {number} requestDTO.page -
   *  @return {Promise}
   */
  async searchWechatDeliveryPrinter(requestDTO) {
    return this.invoke('searchWechatDeliveryPrinter', [requestDTO]);
  }

  /**
   *  提交微信物流打印员信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/893323
   *
   *  @param {Array} reqeustDTOS -
   *  @return {Promise}
   */
  async submitWechatDeliveryPrinter(reqeustDTOS) {
    return this.invoke('submitWechatDeliveryPrinter', [reqeustDTOS]);
  }

  /**
   *
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/894726
   *
   *  @param {Object} requestDTO -
   *  @param {string} requestDTO.uid - 用户在有赞的账号ID
   *  @param {number} requestDTO.kdtId -
   *  @return {Promise}
   */
  async deleteWechatDeliveryPrinter(requestDTO) {
    return this.invoke('deleteWechatDeliveryPrinter', [requestDTO]);
  }
}

module.exports = WechatDeliveryService;
