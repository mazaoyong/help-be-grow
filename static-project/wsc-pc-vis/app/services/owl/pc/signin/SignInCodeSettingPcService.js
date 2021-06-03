const BaseService = require('../../../base/BaseService');

/**
 * com.youzan.owl.pc.api.signin.SignInCodeSettingPcFacade
 * */
class SignInCodeSettingPcService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.signin.SignInCodeSettingPcFacade';
  }

  /**
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/355650
   *
   *  @param {number} kdtId
   *  @param {Object} command
   *  @param {string} command.buttonCopy - 按钮名称
   *  @param {number} command.codeId - 活码id
   *  @param {string} command.organizationName - 机构名称
   *  @param {number} command.codeType - 推广码类型 0:自定义二维码，1：活码
   *  @param {string} command.guideTitle - 引导文案标题
   *  @param {string} command.codePicture - 码url
   *  @param {string} command.guideCopy - 引导文案
   *  @param {number} command.promotionSetting - 推广设置 0:关闭, 1:开启
   *  @param {number} command.codeStyle - 码样式 0:不显示店铺logo 1:显示店铺logo
   *  @param {string} command.scanGuideCopy - 扫码引导文案
   *  @param {number} command.scene - 场景 0:无效场景 1：签到码设置
   *  @return {Promise}
   */
  async create(kdtId, command) {
    return this.invoke('create', [kdtId, command]);
  }

  /**
   *
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/355651
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @return {Promise}
   */
  async change(kdtId, command) {
    return this.invoke('change', [kdtId, command]);
  }

  /**
   *
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/363858
   *
   *  @param {number} kdtId -
   *  @param {number} scene -
   *  @return {Promise}
   */
  async get(kdtId, scene) {
    return this.invoke('get', [kdtId, scene]);
  }
}

module.exports = SignInCodeSettingPcService;
