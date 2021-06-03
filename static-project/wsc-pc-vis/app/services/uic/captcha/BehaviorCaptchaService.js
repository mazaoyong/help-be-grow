const BaseService = require('../../base/BaseService');

/* com.youzan.uic.captcha.api.service.BehaviorCaptchaService -  */class BehaviorCaptchaService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.uic.captcha.api.service.BehaviorCaptchaService';
  }

  /**
   *  token二次校验,检查token是否通过校验
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/456193
   *
   *  @param {Object} reCaptchaCheckDto -
   *  @param {string} reCaptchaCheckDto.token - token
   *  @return {Promise}
   */
  async secondCheckBehaviorToken(reCaptchaCheckDto) {
    return this.invoke('secondCheckBehaviorToken', [reCaptchaCheckDto]);
  }
}

module.exports = BehaviorCaptchaService;
