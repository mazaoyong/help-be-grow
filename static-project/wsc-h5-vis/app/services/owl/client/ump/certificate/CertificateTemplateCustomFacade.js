const BaseService = require('../../../../base/BaseService');

class CertificateTemplateCustomFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.ump.certificate.CertificateTemplateCustomFacade';
  }

  /**
   *
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/393484
   *
   *  @param {number} kdtId -
   *  @param {number} templateId -
   *  @return {Promise}
   */
  async increaseQrScanNum(kdtId, templateId) {
    return this.invoke('increaseQrScanNum', [kdtId, templateId]);
  }
}

module.exports = CertificateTemplateCustomFacade;
