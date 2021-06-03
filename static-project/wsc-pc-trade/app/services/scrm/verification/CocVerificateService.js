const BaseService = require('../../base/BaseService');

/** com.youzan.scrm.api.coc.verification.CocVerificateService -  */
class CocVerificateService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.scrm.api.coc.verification.CocVerificateService';
  }

  /**
   *  权益核销接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/953375
   *
   *  @param {Array} benefitVerificateDTO - 请求参数
   *  @return {Promise}
   */
  async verificate(benefitVerificateDTO) {
    return this.invoke('verificate', [benefitVerificateDTO]);
  }
}

module.exports = CocVerificateService;
