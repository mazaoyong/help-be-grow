const BaseService = require('../../../base/BaseService');
/** com.youzan.owl.ump.api.core.ActivityPermissionFacade -  */
class ActivityPermissionFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.ump.api.core.ActivityPermissionFacade';
  }

  /**
   *  根据活动过滤商品权限
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/283840
   *
   *  @param {integer} kdtId -
   *  @param {Object} command -
   *  @param {Array.<Array>} command.idList[] - 需要校验的商品集合
   *  @param {Array} command.idList[] -
   *  @param {number} command.activityType - 活动类型
   *  @return {Object}
   */
  async filter(kdtId, command) {
    return this.invoke('filter', [kdtId, command]);
  }
}

module.exports = ActivityPermissionFacade;
