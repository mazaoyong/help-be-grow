/* com.youzan.owl.pc.api.onlinecourse.ContentFacade -  */
const BaseService = require('../../../base/BaseService');

class ContentFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.onlinecourse.ContentFacade';
  }

  /**
   * 供货店铺->分销内容详情
   * ZanAPI地址： http://zanapi.qima-inc.com/site/service/view/824435
   *
   * @param {number} kdtId - 店铺id
   * @param {string} alias
   * @return {Promise}
   */
  async getDetailByAlias(kdtId, alias) {
    return this.invoke('getDetailByAlias', [kdtId, alias]);
  }
}

module.exports = ContentFacade;
