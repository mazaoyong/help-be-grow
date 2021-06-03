const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.ump.api.giftshare.GiftShareFacade -  */
class GiftShareFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.ump.api.giftshare.GiftShareFacade';
  }

  /**
   *  获取礼包详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/263835
   *
   *  @param {integer} kdtId - 店铺id
   *  @param {object} giftShareQuery - 查询实体
   *  @param {string} giftShareQuery.orderNo - 订单号
   *  @param {string} giftShareQuery.unReceiveUrl - 未领取数
   *  @param {number} giftShareQuery.fromUserId - 来源粉丝id
   *  @param {string} giftShareQuery.orderAlias - 送礼订单alias
   *  @param {number} giftShareQuery.channelType - 渠道类型
   *  @param {string} giftShareQuery.giftNo - 共享ump礼物编号
   *  @param {number} giftShareQuery.userId - 用户id
   *  @param {string} giftShareQuery.productAlias - 商品alias
   *  @param {string} giftShareQuery.giftSign - 共享ump礼物标示
   *  @param {string} giftShareQuery.shareAlias - 分享alias
   *  @param {string} giftShareQuery.receiveUrl - 已领取数
   *  @param {string} giftShareQuery.clientIp - 客户端ip
   *  @param {number} giftShareQuery.fromFansType - 来源粉丝类型
   *  @param {number} giftShareQuery.fansType - 粉丝类型
   *  @return {object}
   */
  async getGiftDetail(kdtId, giftShareQuery) {
    return this.owlInvoke('getGiftDetail', [kdtId, giftShareQuery]);
  }

  /**
   *  领取中间页，获取活动详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/263832
   *
   *  @param {integer} kdtId - 店铺id
   *  @param {object} giftShareQuery - 查询实体
   *  @param {string} giftShareQuery.orderNo - 订单号
   *  @param {string} giftShareQuery.unReceiveUrl - 未领取数
   *  @param {number} giftShareQuery.fromUserId - 来源粉丝id
   *  @param {string} giftShareQuery.orderAlias - 送礼订单alias
   *  @param {number} giftShareQuery.channelType - 渠道类型
   *  @param {string} giftShareQuery.giftNo - 共享ump礼物编号
   *  @param {number} giftShareQuery.userId - 用户id
   *  @param {string} giftShareQuery.productAlias - 商品alias
   *  @param {string} giftShareQuery.giftSign - 共享ump礼物标示
   *  @param {string} giftShareQuery.shareAlias - 分享alias
   *  @param {string} giftShareQuery.receiveUrl - 已领取数
   *  @param {string} giftShareQuery.clientIp - 客户端ip
   *  @param {number} giftShareQuery.fromFansType - 来源粉丝类型
   *  @param {number} giftShareQuery.fansType - 粉丝类型
   *  @return {object}
   */
  async getGiftShareContent(kdtId, giftShareQuery) {
    return this.owlInvoke('getGiftShareContent', [kdtId, giftShareQuery]);
  }

  /**
   *  领取礼物
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/278266
   *
   *  @param {integer} kdtId - 店铺id
   *  @param {object} giftShareQuery - 领取礼物请求实体
   *  @param {string} giftShareQuery.orderNo - 订单号
   *  @param {string} giftShareQuery.unReceiveUrl - 未领取数
   *  @param {number} giftShareQuery.fromUserId - 来源粉丝id
   *  @param {string} giftShareQuery.orderAlias - 送礼订单alias
   *  @param {number} giftShareQuery.channelType - 渠道类型
   *  @param {string} giftShareQuery.giftNo - 共享ump礼物编号
   *  @param {number} giftShareQuery.userId - 用户id
   *  @param {string} giftShareQuery.productAlias - 商品alias
   *  @param {string} giftShareQuery.giftSign - 共享ump礼物标示
   *  @param {string} giftShareQuery.shareAlias - 分享alias
   *  @param {string} giftShareQuery.receiveUrl - 已领取数
   *  @param {string} giftShareQuery.clientIp - 客户端ip
   *  @param {number} giftShareQuery.fromFansType - 来源粉丝类型
   *  @param {number} giftShareQuery.fansType - 粉丝类型
   *  @return {object}
   */
  async receive(kdtId, giftShareQuery) {
    return this.owlInvoke('receive', [kdtId, giftShareQuery]);
  }

  /**
   *  获取领取礼物的排名信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/278267
   *
   *  @param {number} pageRequest.pageNumber -
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {string} giftShareQuery.orderNo - 订单号
   *  @param {string} giftShareQuery.unReceiveUrl - 未领取数
   *  @param {number} giftShareQuery.fromUserId - 来源粉丝id
   *  @param {string} giftShareQuery.orderAlias - 送礼订单alias
   *  @param {number} giftShareQuery.channelType - 渠道类型
   *  @param {string} giftShareQuery.giftNo - 共享ump礼物编号
   *  @param {number} giftShareQuery.userId - 用户id
   *  @param {string} giftShareQuery.productAlias - 商品alias
   *  @param {string} giftShareQuery.giftSign - 共享ump礼物标示
   *  @param {string} giftShareQuery.shareAlias - 分享alias
   *  @param {string} giftShareQuery.receiveUrl - 已领取数
   *  @param {string} giftShareQuery.clientIp - 客户端ip
   *  @param {number} giftShareQuery.fromFansType - 来源粉丝类型
   *  @param {number} giftShareQuery.fansType - 粉丝类型
   *  @return {object}
   */
  async getGiftShareRankInfo(kdtId, pageRequest, giftShareQuery) {
    return this.owlInvoke('getGiftShareRankInfo', [
      kdtId,
      pageRequest,
      giftShareQuery,
    ]);
  }

  /**
   *  获取分享别名
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/263830
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} giftShareQuery - 查询实体
   *  @param {string} giftShareQuery.orderNo - 订单号
   *  @param {string} giftShareQuery.unReceiveUrl - 未领取数
   *  @param {number} giftShareQuery.fromUserId - 来源粉丝id
   *  @param {string} giftShareQuery.orderAlias - 送礼订单alias
   *  @param {number} giftShareQuery.channelType - 渠道类型
   *  @param {string} giftShareQuery.giftNo - 共享ump礼物编号
   *  @param {number} giftShareQuery.userId - 用户id
   *  @param {string} giftShareQuery.productAlias - 商品alias
   *  @param {string} giftShareQuery.giftSign - 共享ump礼物标示
   *  @param {string} giftShareQuery.shareAlias - 分享alias
   *  @param {string} giftShareQuery.receiveUrl - 已领取数
   *  @param {string} giftShareQuery.clientIp - 客户端ip
   *  @param {number} giftShareQuery.fromFansType - 来源粉丝类型
   *  @param {number} giftShareQuery.fansType - 粉丝类型
   *  @return {Promise}
   */
  async getShareAlias(kdtId, giftShareQuery) {
    return this.owlInvoke('getShareAlias', [kdtId, giftShareQuery]);
  }
}

module.exports = GiftShareFacade;
