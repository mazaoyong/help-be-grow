const BaseController = require('../base/BaseNewController');
const GroupOnRouteService = require('../../services/ump/goods/details/GroupOnRouteService');
const ClientEduProductFacade = require('../../services/owl/client/product/ClientEduProductFacade');
const ClientCourseFacade = require('../../services/owl/api/courseitem/offlinecourse/ClientCourseFacade');
const BehaviorQueryService = require('../../services/scrm/behavior/BehaviorQueryService');
class GrouponController extends BaseController {
  // 拼团详情页
  async renderGrouponDetailHtml(ctx) {
    await this.baseAcl({
      forceOauthLogin: true,
      weixinOauthScope: 'snsapi_userinfo',
    });

    await this.initGlobalTheme();
    await this.hideFooter();
    this.setSpm('eduGroupon', 0);

    // 获取拼团详情
    const [grouponDetail = {}, courseDetail = {}] = await Promise.all([
      new GroupOnRouteService(ctx).getGroupOnDetail(this.grouponParams),
      new ClientEduProductFacade(ctx).getProductBriefInfoWithUmpActivity(ctx.kdtId, {
        alias: ctx.query.alias,
        userId: ctx.userId,
      }),
    ]);

    const { groupInfo = {} } = grouponDetail;
    if (groupInfo.groupType === 1) {
      const params = {
        kdtId: +ctx.kdtId,
        userId: ctx.userId,
      };
      const hasBookedOrder = await new BehaviorQueryService(ctx).hasBookedOrder(params);
      ctx.setGlobal('hasBookedOrder', hasBookedOrder);
    }

    ctx.setGlobal('grouponDetail', grouponDetail || {});
    ctx.setGlobal('courseDetail', courseDetail || {});

    const { type } = courseDetail;
    if (type === 6) {
      const skuFormatModel = await new ClientCourseFacade(ctx).getSkuFormatModel(ctx.kdtId, ctx.query.alias);
      ctx.setGlobal('skuFormatModel', skuFormatModel || {});
    }

    await ctx.render('ump/groupon.html');
  }

  // 场景:用户在开团之后,查看自己的拼团详情信息
  async getGroupOnDetail(ctx) {
    const param = this.grouponParams;

    const result = await new GroupOnRouteService(ctx).getGroupOnDetail(param);
    ctx.json(0, 'ok', result);
  }

  // 拼接拼团接口入参
  get grouponParams() {
    const { query = {}, kdtId, userId } = this.ctx;
    const { order_no: orderNo, group_alias: groupAlias, activity_type: activityType } = query;
    const { fansId, fansType } = this.buyer;
    const param = {
      kdtId: +kdtId,
      orderNo,
      groupAlias,
      activityType,
      user: {
        buyerId: userId,
        fansId,
        fansType,
      },
    };

    !groupAlias && this.validator.required(orderNo, '缺少必要的参数 - orderNo');
    !orderNo && this.validator.required(groupAlias, '缺少必要的参数 - groupAlias');
    return param;
  }

  // 拼接查询商品类型的接口入参
  get courseTypeParams() {
    const { kdtId, query = {} } = this.ctx.kdtId;
    let aliases = [];
    query.aliases && (aliases = query.aliases.split(','));

    const basicQueryCommand = {};
    aliases.length > 0 && (basicQueryCommand.aliases = aliases);
    return {
      kdtId,
      basicQueryCommand,
    };
  }

  // 获取用户参与某个活动的团
  async getJoinedGroupsByUser(ctx) {
    const kdtId = ctx.kdtId;
    const { query = {} } = ctx;
    const param = {
      kdtId,
      activityType: query.activityType,
      activityId: query.activityId,
      user: {
        buyerId: ctx.userId,
      },
    };

    const result = await new GroupOnRouteService(ctx).getJoinedGroupsByUser(param);
    ctx.json(0, 'ok', result);
  }

  // 获取具体团下面的参团成员列表
  async getJoinFansInfoList(ctx) {
    const params = {
      kdtId: +ctx.kdtId,
      groupId: +ctx.query.groupId,
      pageNo: +ctx.query.pageNo || 1,
      pageSize: +ctx.query.pageSize || 6,
      umpType: +ctx.query.umpType,
    };
    const result = await new GroupOnRouteService(ctx).getJoinFansInfoList(params);
    ctx.json(0, 'ok', result);
  }
}

module.exports = GrouponController;
