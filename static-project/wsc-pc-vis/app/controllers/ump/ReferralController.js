// 推荐有奖
const BaseController = require('../base/BaseController');

const MarketingReferralService = require('../../services/paidcontent/referral/MarketingReferralService');
const GoodsComponentService = require('../../services/paidcontent/GoodsComponentService');
const ReferralService = require('../../services/paidcontent/referral/ReferralService');
const ItemGroupService = require('../../services/common/ItemGroupService');
const ItemQueryService = require('../../services/common/ItemQueryService');
const OwlGoodsService = require('../../services/common/OwlGoodsService');
const ProductActivityService = require('../../services/common/ProductActivityService');
// const GoodsSelectorConfigService = require('../../services/ump/manage/GoodsSelectorConfigService');
const { checkEduChainStore } = require('@youzan/utils-shop');
const ReferralPCFacade = require('../../services/ump/referral/ReferralPCFacade');

class ReferralController extends BaseController {
  async getIndexHtml(ctx) {
    ctx.setState('isEduChainStore', checkEduChainStore(ctx.getState('shopInfo')));
    // 获取商品选择器配置
    /* const gsConfig = await new GoodsSelectorConfigService(ctx).queryGoodsSelectorConfig({
      shopId: ctx.kdtId,
      domain: 'UMP',
      umpType: 22,
    });
    ctx.setGlobal('gsConfig', gsConfig); */
    await this.setPointsName();
    await ctx.render('ump/referral/index.html');
  }

  // 查询活动列表
  async getListJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.query || {};
    req.kdtId = kdtId;

    // const res = await new MarketingReferralService(ctx).list(req);
    const res = await new ReferralPCFacade(ctx).findActivities(req);
    ctx.json(0, 'ok', res);
  }

  // 查询数据列表
  async getEffectListJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.query || {};
    req.kdtId = kdtId;

    const res = await new MarketingReferralService(ctx).effectList(req);
    ctx.json(0, 'ok', res);
  }

  // 创建活动
  async postActiveJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.body || {};
    req.kdtId = kdtId;

    const res = await new ReferralService(ctx).create(req);

    return ctx.json(0, 'ok', res);
  }

  // 更新活动
  async putActiveJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.body || {};
    req.kdtId = kdtId;

    const res = await new ReferralService(ctx).update(req);

    return ctx.json(0, 'ok', res);
  }

  // 获取活动详情（轻量级接口，性能更优，无需获取详细的奖励内容详情时使用）
  async getActiveJson(ctx) {
    const kdtId = ctx.kdtId;
    const { activityId } = ctx.request.query || {};

    const res = await new ReferralService(ctx).detail([kdtId, activityId]);
    return ctx.json(0, 'ok', res);
  }

  // 获取活动详情（基于上层接口包装，包含阶梯任务优惠券和赠品详情）
  async getDetailByActivityId(ctx) {
    const { kdtId } = ctx;
    const { activityId } = ctx.request.query || {};
    const res = await new ReferralPCFacade(ctx).getDetailByActivityId(kdtId, activityId);

    let goods = {};

    try {
      goods = await new ItemQueryService(ctx).getById(kdtId, res.goodsId);
    } catch (error) {
      // 推荐有奖结束商品被删除时不抛出错误
      if (error.code !== 122001001) throw error;
    }

    res.goods = goods;

    ctx.json(0, 'ok', res);
  }

  // 删除活动
  async deleteActiveJson(ctx) {
    const kdtId = ctx.kdtId;
    const { activityId } = ctx.request.body || {};

    const res = await new ReferralService(ctx).delete([kdtId, activityId]);

    return ctx.json(0, 'ok', res);
  }

  // 结束活动
  async endActive(ctx) {
    const kdtId = ctx.kdtId;
    const { activityId } = ctx.request.body || {};
    const res = await new ReferralService(ctx).end([kdtId, activityId]);

    return ctx.json(0, 'ok', res);
  }

  // 商品列表
  async getGoodsList(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.query || {};
    req.kdtId = kdtId;
    const { items, count } = await new ItemQueryService(ctx).listItemsPaged(req);
    if (items.length) {
      const goodsIds = items.map((item) => item.id);

      const findJoinStateByGoodsIds = new GoodsComponentService(ctx).findJoinStateByGoodsIds(
        kdtId,
        goodsIds,
        'recommendGift',
      );

      // 知识付费商品类型
      const getOwlTypeByItemIds = new OwlGoodsService(ctx).getOwlTypeByItemIds(goodsIds);

      // 知识付费互斥活动
      const findOwlJoinStateByGoodsIds = new ProductActivityService(ctx).findJoinStateByGoodsIds(
        kdtId,
        goodsIds,
        'recommendPolite',
      );

      await Promise.all([
        findJoinStateByGoodsIds,
        findOwlJoinStateByGoodsIds,
        getOwlTypeByItemIds,
      ]).then(([joinStates, joinOwlState, owlTypes]) => {
        items.forEach((item, i) => {
          item.activityJoins = [];
          const joinState = joinStates[item.id];
          if (joinState) {
            item.isConflict = joinState.isConflict;
            item.activityJoins.push(...joinState.activityJoins);
          }

          const owlJoinState = joinOwlState[item.id];

          if (owlJoinState.isConflict) {
            item.isConflict = owlJoinState.isConflict;
            item.activityJoins.push(...owlJoinState.activityJoins);
          }

          if (owlTypes[i] !== 1 && owlTypes[i] !== 2) {
            item.isConflict = true;
          }
        });
      });
    }

    ctx.json(0, 'ok', { items, count });
  }

  // 商品组
  async getGoodsGroupList(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.query || {};
    req.kdtId = kdtId;
    const res = await new ItemGroupService(ctx).listGroupPaged(req);

    ctx.json(0, 'ok', res);
  }

  async getOverview(ctx) {
    const { kdtId } = ctx;
    const { activityId } = ctx.request.query || {};
    const res = await new ReferralPCFacade(ctx).getOverview(kdtId, activityId);
    ctx.json(0, 'ok', res);
  }

  async findRankDataByPage(ctx) {
    const { kdtId } = ctx;
    const { activityId, page, pageSize } = ctx.request.query || {};
    const pageRequest = {
      pageNumber: page,
      pageSize,
    };
    const res = await new ReferralPCFacade(ctx).findRankDataByPage(kdtId, pageRequest, {
      activityId,
    });
    ctx.json(0, 'ok', res);
  }

  async findDetailDataByPage(ctx) {
    const { kdtId } = ctx;
    const { params, page, pageSize } = ctx.getQueryParse();
    const pageRequest = {
      pageNumber: page,
      pageSize,
    };
    const res = await new ReferralPCFacade(ctx).findDetailDataByPage(kdtId, pageRequest, {
      ...params,
    });
    ctx.json(0, 'ok', res);
  }

  async exportReferralRewardData(ctx) {
    const { kdtId } = ctx;
    const { params } = ctx.getQueryParse();
    const res = await new ReferralPCFacade(ctx).exportReferralRewardData(kdtId, {
      operatorName: this.formatOperator.nickName,
      operatorMobile: this.formatOperator.mobile,
      ...params,
    });
    ctx.json(0, 'ok', res);
  }

  // 查询推荐人奖励发放明细
  async findRewardDetail(ctx) {
    const { kdtId } = ctx;
    const { activityId, page, pageSize, userId, rewardType } = ctx.getQueryParse();
    const pageRequest = {
      pageNumber: page,
      pageSize,
    };
    const res = await new ReferralPCFacade(ctx).findRewardDetail(kdtId, pageRequest, {
      activityId,
      userId,
      rewardType,
    });
    ctx.json(0, 'ok', res);
  }
}

module.exports = ReferralController;
