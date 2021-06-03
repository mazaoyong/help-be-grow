const BaseService = require('../../../../base/BaseService');

/* com.youzan.owl.api.client.ump.activity.ActivityFacade -  */
class ActivityFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.ump.activity.ActivityFacade';
  }

  /**
             *  查询活动的海报信息
*  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/470025
*
             *  @param {number} kdtId - 店铺ID
             *  @param {Object} posterQuery - 海报查询条件
             *  @param {string} posterQuery.activityAlias - 活动alias
             *  @param {number} posterQuery.type - 活动的类型
 7: 优惠套餐
             *  @return {Promise}
             */
  async findActivityPosterByAlias(kdtId, posterQuery) {
    return this.invoke('findActivityPosterByAlias', [kdtId, posterQuery]);
  }
}

module.exports = ActivityFacade;
