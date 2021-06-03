const BaseService = require('../../../base/BaseService');
class ClientLiveFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.biz.service.OwlCommonService';
  }

  /**
   *  二维码
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/120835
   *
   *  @param {Object} qrCodeDTO -
   *  @param {boolean} qrCodeDTO.isShortenUrl - 是否需要将url转短链接
   *  @param {number} qrCodeDTO.width - 宽
   *  @param {string} qrCodeDTO.url - 二维码链接
   *  @param {number} qrCodeDTO.height - 高
   *  @return {Promise}
   */
  async createQrCode(qrCodeDTO) {
    return this.owlInvoke('createQrCode', [qrCodeDTO]);
  }
}

module.exports = ClientLiveFacade;
