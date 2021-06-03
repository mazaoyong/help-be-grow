const BaseService = require('../../base/BaseService');

/* com.youzan.owl.api.common.ShortenUrlFacade -  */
class ShortenUrlFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.common.ShortenUrlFacade';
  }

  /**
   *  获取商品短链
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/918656
   *
   *  @param {string} url -
   *  @return {Promise}
   */
  async getShortenUrl(url) {
    return this.invoke('getShortenUrl', [url]);
  }
}

module.exports = ShortenUrlFacade;
