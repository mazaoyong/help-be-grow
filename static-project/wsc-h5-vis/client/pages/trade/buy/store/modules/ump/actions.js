import { Toast, Dialog } from 'vant';
import { pick, get, findIndex } from 'lodash';
import * as SafeLink from '@/common/utils/custom-safe-link';

import * as Api from '../../../api';

import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';

export const actions = {
  // 兑换优惠码
  EXCHANGE_COUPON({ state, getters }, code) {
    const param = {
      goods: getters.goodsList.map(item =>
        pick(item, [
          'activityAlias',
          'activityType',
          'activityId',
          'goodsId',
          'goodsType',
          'num',
          'price',
          'skuId',
        ]),
      ),
      postage: state.pay.postage,
      seller: {
        kdtId: _global.kdt_id,
        storeId: 0,
      },
      userCouponCode: code.replace(/\s/g, ''),
    };
    return Api.getExchangeCoupon(param).catch(error => {
      Toast(error || '兑换失败');
    });
  },

  // 初始化优惠套餐信息
  INIT_PACKAGE_BUY_DATA({ commit }, packageBuy) {
    if (!packageBuy) return;
    const {
      decrease = 0,
      originPrice = 0,
      activity = {},
      goodsList = [],
    } = get(packageBuy, '[0]', {});
    commit('SET_PACKAGE_BUY_DATA', {
      originPrice,
      decrease,
      ...activity,
    });
    const extraGoodsList = goodsList.map(item => ({
      alias: item.alias,
      packageBuySkus: item.skus,
    }));
    commit('SET_GOODS_EXTRA_DATA', extraGoodsList);
  },

  // 初始化买赠信息
  INIT_MEET_REDUCE_DATA({ commit, getters, state, dispatch }, meetReduce) {
    if (!meetReduce) {
      dispatch('INIT_MEET_REDUCE_FROM_ORDER_DATA');
      return;
    }

    const present = {};
    const presentInfo = meetReduce[0] || {};
    const sku = JSON.parse(getters.singleGoods.sku) || [];
    const skuId = sku.length ? getters.singleGoods.skuId : 0;
    const presentGoodsIndex = findIndex(
      presentInfo.presentInfoList,
      item => skuId === item.skuId,
    );
    const hasSku = sku.length > 0;

    // 当前商品不参加买赠
    if (hasSku && presentGoodsIndex === -1) {
      return;
    }

    // 送赠品
    if (state.order.hasPresentGoods) {
      const index = hasSku ? presentGoodsIndex : 0;
      const presents = get(
        presentInfo,
        `presentInfoList[${index}].presentGoodsList`,
      );
      if (presents) {
        present.presents = presents;
      }
    }

    // 送优惠券
    if (presentInfo.couponId) {
      const formatMoney = money => money / 100;
      const {
        couponValueRandomTo,
        couponValueRandomFrom,
        couponDiscount,
        couponId,
        couponNum,
        couponTitle,
        couponValue,
        couponCondition,
        couponUnitDesc,
      } = presentInfo;
      const discount = +couponDiscount ? +couponDiscount / 10 : 0;

      let valueDesc;
      if (couponValueRandomTo) {
        valueDesc =
          formatMoney(couponValueRandomFrom) +
          '-' +
          formatMoney(couponValueRandomTo);
      } else {
        valueDesc = discount || formatMoney(couponValue);
      }

      const condition =
        couponCondition === 0 ? '无使用门槛' : `满${couponCondition / 100}`;

      present.coupons = [
        {
          discount,
          id: couponId,
          num: couponNum,
          title: couponTitle,
          value: couponValue,
          condition,
          unitDesc: couponUnitDesc,
          valueDesc,
        },
      ];
    }

    // 送积分
    if (presentInfo.score) {
      present.score = presentInfo.score;
    }

    commit('SET_MEET_REDUCE_DATA', present);
  },

  // 初始化买赠信息的降级
  INIT_MEET_REDUCE_FROM_ORDER_DATA({ commit, getters, state }) {
    /**
     * 多人拼团与买赠叠加的情况下，getActivity 中取不到买赠信息，需要从交易返回的
     * 数据中解析，此处交易只返回赠品信息。
     */

    // 如果订单中没有赠品，就不继续了
    if (!state.order.hasPresentGoods) {
      return;
    }

    // 找到买赠的赠品，条件是
    // 1.是赠品（item.present === true）；
    // 2.赠品来源是买赠（item.presentSrc.fromActivityType === 101 ）。
    const presents = state.goods.list.filter(item => {
      return (
        item &&
        item.present &&
        get(item, 'presentSrc.fromActivityType', 0) ===
          ACTIVITY_TYPE.MEET_REDUCE
      );
    });

    if (presents.length === 0) {
      return;
    }

    // 这里注意下 orderItems 中的赠品信息和 getActivity 中的赠品信息结构不一样，需要做一层转换
    const formattedPresents = presents.map(item => {
      const {
        /** 赠品数量 */
        num = 0,
        /** 赠品名称 */
        title = '',
        /** 赠品头图 */
        imgUrl: imageUrl = '',
        /** 赠品价格 */
        price: presentPrice = 0,
        /** 赠品 sku 描述 */
        courseSkuDesc: presentSkuDesc = '',
      } = item;

      return {
        num,
        title,
        imageUrl,
        presentPrice,
        presentSkuDesc,
        /**
         *  是否隐藏赠品价格
         *  @desc 产品需求是展示赠品的本来的价格，但这个场景下赠品价格是交易返回的，默认为 0 元（赠品无需付款），
         *        后端改动影响面、评估量较大，经协商，此时不展示赠品价格。
         */
        hidePrice: true,
      };
    });

    commit('SET_MEET_REDUCE_DATA', {
      presents: formattedPresents,
    });
  },

  CHECK_POINTS_IS_ENOUGH({ state, getters }) {
    const userPoints = state.shop.userPoints;
    const pointsPrice = state.pointsExchange.pointsPrice;
    const { pointsName = '积分' } = state;

    if (userPoints < pointsPrice) {
      return Dialog.alert({
        message: `${pointsName}不足，请返回重新下单。（当前${pointsName}余额：${userPoints}）`,
        confirmButtonText: '返回',
      }).then(() => {
        const { alias } = getters.singleGoods;
        return SafeLink.redirect({
          url: `/wscvis/course/detail/${alias}?kdt_id=${_global.kdt_id}`,
          redirectType: 'replace',
        });
      });
    }
  },

  CHOOSE_TUITION({ commit }, payload) {
    console.log('payload', payload);
    commit('SET_IS_USE_TUITION', payload);
  },
};
