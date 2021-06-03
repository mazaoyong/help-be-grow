const BaseService = require('../../base/BaseService');

/**
 * 短信验证码服务
 */
class SmsCaptchaService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.uic.captcha.api.service.SmsCaptchaService';
  }

  /**
   *  校验验证码
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/43604
   *
   *  @param {Object} smsCaptchaDto - 不能为空字段：mobile、biz、smsCaptcha
   *  @param {string} smsCaptchaDto.subFrom - 具体业务线，允许为空，但推荐填写
   *  @param {string} smsCaptchaDto.smsCaptcha - 验证码。校验验证码时必填。发送验证码时不需要填写
   *  @param {string} smsCaptchaDto.biz - 业务线，必填
   *  @param {number} smsCaptchaDto.kdtId - 需要商家自费时需要传入，否则不需要设置该参数
   *  @param {string} smsCaptchaDto.ip - IP地址，允许为空
   *  @param {string} smsCaptchaDto.mobile - 手机号，必填
   *  @param {number} smsCaptchaDto.sendTimes - 发送次数，允许为空
   *  @param {string} smsCaptchaDto.platform - 平台，具体可填 wap、pc 等。允许为空
   *  @return {Promise}
   */
  async validSmsCaptcha(smsCaptchaDto) {
    return this.invoke('validSmsCaptcha', [smsCaptchaDto]);
  }

  /**
   *  发送手机验证码
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/43603
   *
   *  @param {Object} smsCaptchaDto - 发送验证码。不能为空字段：mobile & biz
   *  @param {string} smsCaptchaDto.subFrom - 具体业务线，允许为空，但推荐填写
   *  @param {string} smsCaptchaDto.smsCaptcha - 验证码。校验验证码时必填。发送验证码时不需要填写
   *  @param {string} smsCaptchaDto.biz - 业务线，必填
   *  @param {number} smsCaptchaDto.kdtId - 需要商家自费时需要传入，否则不需要设置该参数
   *  @param {string} smsCaptchaDto.ip - IP地址，允许为空
   *  @param {string} smsCaptchaDto.mobile - 手机号，必填
   *  @param {number} smsCaptchaDto.sendTimes - 发送次数，允许为空
   *  @param {string} smsCaptchaDto.platform - 平台，具体可填 wap、pc 等。允许为空
   *  @return {Promise}
   */
  async sendSmsCaptcha(smsCaptchaDto) {
    return this.invoke('sendSmsCaptcha', [smsCaptchaDto]);
  }
}

module.exports = SmsCaptchaService;
