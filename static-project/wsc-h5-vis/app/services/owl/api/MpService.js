const BaseService = require('../../base/BaseService');

/* com.youzan.owl.api.MpService -  */
class MpService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.MpService';
  }

  /**
   *  课程提醒所用接口，根据店铺Id与userId查询该用户是否关注过该店铺对应的公众号
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/225008
   *
   *  @param {integer} kdtId - 店铺Id
   *  @param {integer} userId - 用户Id
   *  @param {string} columnAlias - 专栏别名
   *  @return {object}
   */

  async ifNeedNoticeFollow(kdtId, userId, columnAlias) {
    return this.owlInvoke(this.SERVICE_NAME, 'ifNeedNoticeFollow', [kdtId, userId, columnAlias]);
  }

  /**
   *  判断用户是否正在关注公众号
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/408829
   *
   *  @param {number} kdtId - 店铺id
   *  @param {number} userId - 用户id
   *  @return {Promise}
   */
  async checkMpFollow(kdtId, userId) {
    return this.invoke('checkMpFollow', [kdtId, userId]);
  }
}

module.exports = MpService;
