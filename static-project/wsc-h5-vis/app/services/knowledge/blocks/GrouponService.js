const mapKeysToSnakeCase = require('zan-utils/string/mapKeysToSnakeCase');
const KnowledgeBaseService = require('../KnowledgeBaseService');

class GrouponService extends KnowledgeBaseService {
  /**
   * 开团成功后邀请好友拼团页面获取拼团信息
   */
  async getGroupByAlias(params) {
    let ret = await this.owlApiCall({
      url: '/groupon/groupbyalias',
      data: params,
    });
    return mapKeysToSnakeCase(ret);
  }

  /**
   * 通用获取活动信息接口
   * （目前只有拼团用，后面会全部转移至activitys接口）
   */
  async findPromotion(params) {
    let ret = await this.owlApiCall({
      url: '/goodspromotion/find',
      data: params,
    });
    ret = mapKeysToSnakeCase(ret);
    if (ret.promotion_detail) {
      ret = await this.getPromotionUserStatus(
        params.kdtId, ret, params.fansId, params.fansType, params.yzFansId, params.buyerId
      );
    }
    return ret;
  }

  // ===

  /**
   * 活动用户信息
   */
  async getPromotionUserStatus(kdtId, promotion, fansId, fansType, yzFansId, buyerId) {
    if (promotion.promotion_type === 4) {
      const promotionId = promotion.promotion_id;
      const grouponUserStatus = await this.getGrouponUserStatus({
        kdtId, promotionId, fansId, fansType, yzFansId, buyerId,
      });
      if (grouponUserStatus) {
        promotion.promotion_detail.user_status = grouponUserStatus.status;
        promotion.promotion_detail.user_group_alias = grouponUserStatus.group_alias;
      } else {
        promotion.promotion_detail.user_status = 0;
        promotion.promotion_detail.user_group_alias = '';
      }
    }
    return promotion;
  }

  /**
   * 拼团用户信息
   */
  async getGrouponUserStatus(params) {
    let ret = await this.owlApiCall({
      url: '/groupon/grouponuserstatus',
      data: params,
    });
    return mapKeysToSnakeCase(ret);
  }
}

module.exports = GrouponService;
