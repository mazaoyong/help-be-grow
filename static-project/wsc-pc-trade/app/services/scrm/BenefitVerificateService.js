const BaseService = require('../base/BaseService');

/**
 * com.youzan.scrm.api.verification.service.BenefitVerificateService
 */
class BenefitVerificateService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.scrm.api.verification.service.BenefitVerificateService';
  }

  /**
   *  权益核销接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/498067
   *
   *  @param {Array} benefitVerificateDTO -
   *  @return {Promise}
   */
  async verificate(benefitVerificateDTO) {
    return this.invoke('verificate', [benefitVerificateDTO]);
  }
}

module.exports = BenefitVerificateService;
