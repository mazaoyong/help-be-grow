const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.api.common.UploadTokenFacade */
class UploadTokenFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.common.UploadTokenFacade';
  }

  /**
   * 语音高保真获取语音下载URL
   * @link http://zanapi.qima-inc.com/site/service/view/540344
   * @param {number} kdtId -
   * @param {string} mediaId -
   * @param {boolean} useHigh -
   * @return {Promise}
   */
  async highWxMediaDownLoadAsyn(kdtId, mediaId, useHigh) {
    return this.invoke('highWxMediaDownLoadAsyn', [kdtId, mediaId, useHigh]);
  }
}

module.exports = UploadTokenFacade;
