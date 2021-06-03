const BaseService = require('../../../base/BaseService');

class LiveRewardOrderFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.order.LiveRewardOrderFacade';
  }

  /**
   *  打赏简要记录查询
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/896448
   *
   *  @param {number} kdtId -
   *  @param {string} query -
   *  @return {Promise}
   */
  async queryRewardBriefInfo(kdtId, query) {
    return this.invoke('queryRewardBriefInfo', [kdtId, query]);
  }

  /**
   *  打赏记录查询
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/896447
   *
   *  @param {number} kdtId -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {[object Object]} pageRequest.sort.orders -
   *  @param {string} query -
   *  @return {Promise}
   */
  async findByCondition(kdtId, pageRequest, query) {
    return this.invoke('findByCondition', [kdtId, pageRequest, query]);
  }

  /**
   *  打赏记录导出请求
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/905648
   *
   *  @param {number} kdtId -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query -
   *  @param {number} query.fansId - 粉丝id
   *  @param {string} query.nickName - 用户名称
   *  @param {string} query.clientIp - 客户端ip
   *  @param {string} query.mobile - 用户手机号
   *  @param {string} query.alias - 直播间alias
   *  @param {string} query.userNameOrPhone - 用户名或手机号（数值类型是手机号，否则是用户名）
   *  @param {string} query.source - 操作来源
   *  @param {number} query.userId - 用户id
   *  @param {number} query.fansType - 粉丝type
   *  @return {Promise}
   */
  async exportByCondition(kdtId, pageRequest, query) {
    return this.invoke('exportByCondition', [kdtId, pageRequest, query]);
  }
}

module.exports = LiveRewardOrderFacade;
