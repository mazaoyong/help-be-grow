const mapKeysToSnakeCase = require('zan-utils/string/mapKeysToSnakeCase');
const KnowledgeBaseService = require('../KnowledgeBaseService');

class CommentService extends KnowledgeBaseService {
  /**
   * 送礼支付完和订单查看礼包获取购买礼包详情页
   */
  async getSendGiftDetail(params) {
    let ret = await this.owlApiCall({
      url: '/send/gift/detail',
      data: params,
    });
    return mapKeysToSnakeCase(ret);
  }

  /**
   * 获取未领取页面信息
   */
  async getShareUnReceive(params) {
    let ret = await this.owlApiCall({
      url: '/share/unreceive',
      data: params,
    });
    return mapKeysToSnakeCase(ret);
  }

  /**
   * 获取领取结果
   */
  async getShareReceive(params) {
    let ret = await this.owlApiCall({
      url: '/share/receive',
      data: params,
    });
    return mapKeysToSnakeCase(ret);
  }

  /**
   * 礼物领取列表
   */
  async getShareRank(params) {
    let ret = await this.owlApiCall({
      url: '/share/receive/rank',
      data: params,
    });
    return mapKeysToSnakeCase(ret);
  }

  /**
   * 获取分享别名
   */
  async getShareAlias(params) {
    let ret = await this.owlApiCall({
      url: '/share/shareAlias',
      data: params,
    });
    return mapKeysToSnakeCase(ret);
  }
}

module.exports = CommentService;
