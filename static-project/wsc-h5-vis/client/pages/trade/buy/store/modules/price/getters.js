import { sum, includes } from 'lodash';

// 已选中礼品卡/储值卡的总金额
const getChosenCardAmount = ({ list, checked }) => {
  const checkedCard = list.filter((card) =>
    includes(checked, card.summaryCardNo),
  );
  return sum(checkedCard.map((item) => item.balance));
};

// 礼品卡/储值卡的可用的总金额
const getCardAvailableAmount = (list) =>
  sum(list.filter((card) => card.usable).map((item) => item.balance));

export const getters = {
  // 优惠券抵扣金额
  couponDecrease(state, getters) {
    return getters.chosenCoupon ? getters.chosenCoupon.value || 0 : 0;
  },

  // 优惠券抵扣后的待支付金额
  // 新优惠券流程 realPay 会减去优惠卷的抵扣金额
  couponDecreasedPrice(state, getters) {
    return state.pay.realPay;
  },

  // 选中礼品卡的总金额
  chosenGiftCardAmount(state) {
    return getChosenCardAmount(state.giftCard);
  },

  // 选中储值卡的总金额
  chosenValueCardAmount(state) {
    return getChosenCardAmount(state.valueCard);
  },

  // 选中预付卡的总金额
  chosenPrepayCardAmount(_state, getters) {
    return getters.chosenGiftCardAmount || getters.chosenValueCardAmount;
  },

  // 预付卡可以抵扣的最大金额
  prepayCardAvailableAmount(state) {
    const valueCardAvailableAmount = getCardAvailableAmount(
      state.valueCard.list,
    );
    const giftCardAvailableAmount = getCardAvailableAmount(state.giftCard.list);

    return Math.max(valueCardAvailableAmount, giftCardAvailableAmount);
  },

  // 礼品卡抵扣金额
  giftCardDecrease(_state, getters) {
    return Math.min(getters.couponDecreasedPrice, getters.chosenGiftCardAmount);
  },

  // 储值卡抵扣金额
  valueCardDecrease(_state, getters) {
    return Math.min(
      getters.couponDecreasedPrice,
      getters.chosenValueCardAmount,
    );
  },

  // 预付卡抵扣金额
  prepayCardDecrease(_state, getters) {
    return getters.valueCardDecrease || getters.giftCardDecrease;
  },

  // 资产抵扣金额
  // 优惠卷抵扣金额 + 预付卡抵扣金额
  assetsDecrease(_state, getters) {
    return getters.couponDecrease + getters.prepayCardDecrease;
  },

  // 商品级别活动的优惠金额
  activityDecrease(state, getters) {
    if (getters.isPackageBuy) {
      return state.packageBuy.decrease;
    }
    return (
      getters.singleGoods.price * getters.singleGoods.num - state.pay.itemPay
    );
  },

  // 订单级其他优惠活动
  orderPromotions(state, getters) {
    return state.pay.orderPromotions || [];
  },

  // 订单原价
  // 优惠套餐是套餐内商品价格之和
  // 单商品是商品原价*数量
  orderOriginPrice(state, getters) {
    if (getters.isPackageBuy) {
      return state.packageBuy.originPrice;
    }
    return getters.singleGoods.price * getters.singleGoods.num;
  },

  // 订单最终金额
  orderFinalPrice(_state, getters) {
    return getters.couponDecreasedPrice - getters.prepayCardDecrease;
  },

  // 学费兑换优惠
  tuitionDecrease(state, getters) {
    const { tuition } = state;
    const { realEnableDeduction } = tuition;
    if (getters.isUseTuition) {
      return {
        label: '学费兑换',
        value: realEnableDeduction / 100,
      };
    }
    return void 0;
  },
};
