const BaseService = require('../../../base/BaseService');

/* com.youzan.ump.goods.details.api.service.GroupOnRouteService -  */
class GroupOnRouteService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ump.goods.details.api.service.GroupOnRouteService';
  }

  /**
   *  场景:用户在开团之后,查看自己的拼团详情信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/606113
   *
   *  @param {Object} queryGroupDetailParam - 团详情查询参数
   *  @param {string} queryGroupDetailParam.orderNo - 订单号
   *  @param {number} queryGroupDetailParam.kdtId - 店铺标识
   *  @param {string} queryGroupDetailParam.groupAlias - 拼团别名
   *  @param {number} queryGroupDetailParam.offlineId - 多网点 Id
   *  @param {number} queryGroupDetailParam.activityType - 拼团类型 4.普通拼团/老带新拼团  26.阶梯团
   *  @param {Object} queryGroupDetailParam.user - 用户信息
   *  @return {Promise}
   */
  async getGroupOnDetail(queryGroupDetailParam) {
    return this.invoke('getGroupOnDetail', [queryGroupDetailParam]);
  }

  /**
             *  获取用户参与某个活动的团
*  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/701995
*
             *  @param {Object} param - 包含用户信息和活动alias
             *  @param {number} param.kdtId - 店铺 Id
             *  @param {number} param.hqKdtId - 总店 Id
             *  @param {string} param.alias - 活动别名
             *  @param {number} param.buyerId - 用户 Id
             *  @param {number} param.activityType - 拼团类型
 4 普通拼团
 26 阶梯拼团
             *  @param {Object} param.user - 用户信息
             *  @return {Promise}
             */
  async getJoinedGroupsByUser(param) {
    return this.invoke('getJoinedGroupsByUser', [param]);
  }

  /**
             *  分页 获取 团员的头像昵称， 需要区分活动类型
*  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/603381
*
             *  @param {Object} param -
             *  @param {number} param.kdtId - 店铺 Id
             *  @param {number} param.pageNo -
             *  @param {number} param.groupId - 团 Id
             *  @param {number} param.umpType - 活动类型
 4 普通拼团
 26 阶梯拼团
             *  @param {number} param.pageSize -
             *  @return {Promise}
             */
  async getJoinFansInfoList(param) {
    return this.invoke('getJoinFansInfoList', [param]);
  }
}

module.exports = GroupOnRouteService;
