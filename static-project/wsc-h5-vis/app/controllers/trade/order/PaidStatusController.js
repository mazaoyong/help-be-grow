const BaseController = require('../../edu/EduBaseController');
const PaySuccessAggrService = require('../../../services/owl/trade/PaySuccessAggrFacade.js');
const get = require('lodash/get');

const PAY_STATE = {
  CREATED: 1,
  WAIT_PAY: 10,
  PAID: 20,
  CLOSED: 99,
};
class PaidStatusController extends BaseController {
  /**
   * @query orderNo 订单号
   * @query lessonNo 课程号
   */
  async getIndexHtml(ctx) {
    await this.baseAcl();

    const { kdtId, query, userId } = ctx;
    const { orderNo, lessonNo } = query;

    let payStateInfo = {};
    try {
      // 获取支付状态
      payStateInfo =
        (await new PaySuccessAggrService(ctx).queryPayStatusInfo(kdtId, {
          orderNo,
          userId,
        })) || {};
    } catch (err) {}

    const { realPay: price, payStatus: payState, payWay, orderType } = payStateInfo;

    // 如果订单被关闭，直接重定向到订单详情页
    if (payState === PAY_STATE.CLOSED) {
      ctx.redirect(`/wsctrade/order/detail?order_no=${orderNo}&kdt_id=${kdtId}`);
    }

    let otherPromises = [
      // 获取店铺设置
      ctx.getShopConfigsWithKdtId(kdtId, [
        'goods_recommend',
        'goods_recommend_goods',
        'goods_recommend_cart',
        'goods_recommend_pay',
        'goods_recommend_order_list',
        'goods_recommend_order_detail',
        'goods_recommend_delivery',
        'goods_recommend_refund',
      ]),
    ];

    // 如果支付成功，获取下单奖励
    if (payState === PAY_STATE.PAID) {
      otherPromises.push(
        new PaySuccessAggrService(ctx).queryPayRewardInfo(kdtId, {
          orderNo,
          userId,
        }),
      );
    }

    // 如果获取到支付结果，或者userId不为0
    // 请求营销活动信息
    if (payState !== undefined || userId !== 0) {
      otherPromises.push(new PaySuccessAggrService(ctx).getPaySuccessInfoV2(kdtId, { orderNo, userId }));
    }

    let otherInfo = [];
    try {
      otherInfo = await Promise.all(otherPromises);
    } catch (err) {}
    const [recommendSettings = {}, payRewardInfo = {}, umpInfo = {}] = otherInfo;
    let { simpleItems: orderItemList } = umpInfo;
    if (!orderItemList) {
      orderItemList = payRewardInfo.simpleItems || [];
    }

    // 购买单间商品，非套餐
    const isSingleGoods = get(orderItemList, 'length', 0) === 1;

    // 获取粉丝推广信息
    let joinGroupSetting, alias;
    if (isSingleGoods && (alias = get(orderItemList, '[0].alias', ''))) {
      joinGroupSetting = await new PaySuccessAggrService(ctx).queryPayJoinGroupSettingInfo(kdtId, alias);
    }

    // 知识付费订单
    // 如果没有设置加群引导、奖励、入学奖励、赠品、优惠券、积分、裂变优惠券等
    // 跳转至商品详情页
    if (isSingleGoods && payState === PAY_STATE.PAID) {
      const orderItem = orderItemList[0];
      const { alias, owlType } = orderItem;

      // 获取详情链接
      const courseDetailUrl = {
        '1': `/wscvis/knowledge/index?kdt_id=${kdtId}&p=columnshow&alias=${alias}`,
        '2': `/wscvis/knowledge/index?kdt_id=${kdtId}&p=contentshow&alias=${alias}`,
        '3': `/wscvis/knowledge/index?kdt_id=${kdtId}&p=vipbenefit&alias=${alias}`,
        '4': `/wscvis/knowledge/index?kdt_id=${kdtId}&p=livedetail&alias=${alias}`,
      }[owlType];

      if (
        owlType !== 10 &&
        !get(joinGroupSetting, 'enrollmentSuccessPageOpen', 0) &&
        !get(umpInfo, 'activitiesInfo.length', 0) &&
        !get(umpInfo, 'orderCouponDTO', null) &&
        !get(payRewardInfo, 'rewardMemberCardList.length', 0) &&
        !get(payRewardInfo, 'rewardPointDTO.rewardPoint', 0)
      ) {
        ctx.redirect(courseDetailUrl);
      }
    }

    // 设置页面初始化状态
    const initialState = {
      orderItemList,
      payState,
      payWay,
      orderType,
      price,
      lessonNo,
      payRewardInfo,
      umpInfo,
      joinGroupSetting,
      showRecommend: +get(recommendSettings, 'goods_recommend', 1) &&
        +get(recommendSettings, 'goods_recommend_pay', 1),
    };
    ctx.setGlobal('initialState', initialState);

    this.setSpm('paidStatus', kdtId);
    await this.setPointsName();
    await this.initGlobalTheme();
    await ctx.render('trade/paid-status.html');
  }

  async queryPayStateInfo(ctx) {
    const { kdtId, userId, query } = ctx;
    const { orderNo } = query;
    const result = await new PaySuccessAggrService(ctx).queryPayStatusInfo(kdtId, {
      orderNo,
      userId,
    });
    ctx.json(0, 'ok', result);
  }

  async queryPayRewardInfo(ctx) {
    const { kdtId, userId, query } = ctx;
    const { orderNo } = query;
    const result = await new PaySuccessAggrService(ctx).queryPayRewardInfo(kdtId, {
      orderNo,
      userId,
    });
    ctx.json(0, 'ok', result);
  }

  async getPaySuccessInfoV2(ctx) {
    const { kdtId, userId } = ctx;
    const { orderNo } = ctx.query;
    const payStateQuery = {
      orderNo,
      userId,
    };
    const result = await new PaySuccessAggrService(ctx).getPaySuccessInfoV2(kdtId, payStateQuery);

    ctx.json(0, 'ok', result);
  }

  async getRecommendGoods(ctx) {
    const { kdtId } = ctx;
    const result = await new PaySuccessAggrService(ctx).queryPayGoodsRecommendInfo(kdtId);
    ctx.json(0, 'ok', result);
  }

  async getGoodsRecommendInfo(ctx) {
    const { kdtId, query } = ctx;
    const { scene } = query;
    const result = await new PaySuccessAggrService(ctx).queryGoodsRecommendInfo(kdtId, {
      scene,
    });
    ctx.json(0, 'ok', result);
  }

  async inWhiteList(ctx) {
    const inWhiteList = await this.callService(
      'iron-base/common.GrayReleaseService',
      'isInGrayReleaseByKdtId',
      'paid_refactoring',
      +ctx.kdtId,
    );
    return inWhiteList;
  }

  async getInWhiteList(ctx) {
    const inWhiteList = await this.inWhiteList(ctx);
    ctx.json(0, 'ok', inWhiteList);
  }

  async getJoinGroupSetting(ctx) {
    const { kdtId, query } = ctx;
    const { alias } = query;
    const joinGroupSetting = await new PaySuccessAggrService(ctx).queryPayJoinGroupSettingInfo(kdtId, alias);
    ctx.json(0, 'ok', joinGroupSetting);
  }
}

module.exports = PaidStatusController;
