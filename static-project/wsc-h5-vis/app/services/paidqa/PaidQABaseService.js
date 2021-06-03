const BaseService = require('../base/BaseService');
const ParamsError = require('../../exceptions/ParamsError');

class PaidQABaseService extends BaseService {
  /**
   * owl Api调用
   */
  async owlApiCall(ajaxOptions, config) {
    let baseUrl = this.getConfig('OWL_API');
    ajaxOptions.url = `${baseUrl}${ajaxOptions.url}`;
    const ret = await this.ajax(ajaxOptions, config);
    return ret;
  }

  /**
   * [重写]标准 Ajax 调用
   * @param {Object} ajaxOptions
   * @param {Object} config
   */
  async ajax(ajaxOptions, config) {
    const result = await this.httpCall(ajaxOptions, config);

    if (result.code === 200 && result.success) {
      return result.data;
    }
    if (result.code === 0) {
      return result.data;
    }
    if (result.code === 404) {
      throw new ParamsError(11013, result.message);
    }
    throw new ParamsError(10003, result.message);
  }
}

module.exports = PaidQABaseService;
