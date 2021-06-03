const KnowledgeBaseController = require('../KnowledgeBaseController');
const GrouponService = require('../../../services/knowledge/blocks/GrouponService');
const NewGrouponService = require('../../../services/owl/ump/groupon/GrouponService');
const UmpGroupOnService = require('../../../services/ump/goods/details/GroupOnService');

class GrouponController extends KnowledgeBaseController {
  /**
   * 开团成功后邀请好友拼团页面获取拼团信息
   */
  async getGroupByAliasJson(ctx) {
    const {
      group_alias: groupAlias = '',
      order_no: orderNo = '',
    } = ctx.query;
    const {
      fans_id: fansId = 0,
      fans_type: fansType = 0,
      youzan_fans_id: yzFansId = 0,
    } = ctx.getLocalSession();
    const kdtId = ctx.kdtId;
    const buyerId = ctx.buyerId;
    const ret = await new GrouponService(ctx).getGroupByAlias({
      kdtId, groupAlias, orderNo, fansId, fansType, yzFansId, buyerId,
    });
    ctx.json(0, 'ok', ret);
  }

  /**
   * 通用获取活动信息接口
   * （目前只有拼团用，后面会废弃并全部转移至activitys接口）
   */
  async getGoodsPromotionJson(ctx) {
    const { alias = '' } = ctx.query;
    const {
      fans_id: fansId = 0,
      fans_type: fansType = 0,
      youzan_fans_id: yzFansId = 0,
    } = ctx.getLocalSession();
    const kdtId = ctx.kdtId;
    const buyerId = ctx.buyerId;
    const ret = await new GrouponService(ctx).findPromotion({
      kdtId, alias, fansId, fansType, yzFansId, buyerId,
    });
    ctx.json(0, 'ok', ret);
  }

  // 获取单个团详情
  async getGrouponDetailJson(ctx) {
    const kdtId = ctx.kdtId;
    const queryParam = {
      orderNo: ctx.query.orderNo,
      groupAlias: ctx.query.groupAlias || '',
      adminId: ctx.buyerId,
      fansId: this.buyer.fansId,
      fansType: this.buyer.fansType,
    };

    console.log('queryParam', queryParam);

    const result = await new NewGrouponService(ctx).get(kdtId, queryParam);
    ctx.json(0, 'ok', result);
  }

  // 获取具体团下面的参团成员列表
  async getGroupOnJoinRecordByPageJson(ctx) {
    const result = await new UmpGroupOnService(ctx).getGroupOnJoinRecordByPage(
      ctx.kdtId,
      ctx.query.groupId || '',
      ctx.query.page || 1,
      ctx.query.pageSize || 10
    );
    ctx.json(0, 'ok', result);
  }
}

module.exports = GrouponController;
