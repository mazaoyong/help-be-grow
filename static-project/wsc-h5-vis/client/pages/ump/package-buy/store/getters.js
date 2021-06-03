import get from 'lodash/get';
import some from 'lodash/some';
import { moneyToYuan } from '../common';

const getters = {
  fetchPrices(state) {
    const { isMatchPackage, payGoodsList } = state;
    let { totalPrice, savePrice } = state.btnPrices;

    if (isMatchPackage) {
      totalPrice = 0;
      savePrice = 0;
      payGoodsList.forEach(v => {
        totalPrice += v.collocationPrice * v.num;
        savePrice += (v.price - v.collocationPrice) * v.num;
      });
    } else {
      let originPrice = 0;
      payGoodsList.forEach(v => {
        originPrice += v.price * v.num;
      });

      savePrice = originPrice - totalPrice;
    }

    return {
      totalPrice: moneyToYuan(totalPrice),
      // savePrice: moneyToYuan(savePrice),
      savePrice,
    };
  },

  initialSku(state) {
    const { sku, currentGoods } = state;
    const skuId = get(currentGoods, 'currentSkuId', null);

    const defaultSku = get(sku, 'list', [])
      .filter(item => item.id === skuId)
      .pop();

    return defaultSku;
  },

  // 活动是否开始
  isCanBuy(state) {
    const { currentActivity = {}, packages = [], isMatchPackage, mainGoods } = state;
    const startAt = currentActivity.startAt * 1000 || 0;
    const endAt = currentActivity.endAt * 1000 || 0;
    const today = new Date(Date.now());
    let isValid = true;

    if (isMatchPackage &&
        ((mainGoods.owlType !== 10 && mainGoods.isPaid) || (mainGoods.owlType === 10 && mainGoods.totalStock === 0))) {
      isValid = false;
    } else if (packages.length > 1) {
      isValid = some(packages, { isCanSelectSolidPackage: true });
    } else {
      !isMatchPackage && packages.forEach(pk => {
        (pk.goodsList || []).forEach(good => {
          if ((good.owlType !== 10 && good.isPaid) || (good.owlType === 10 && good.totalStock === 0)) {
            isValid = false;
          }
        });
      });
    }
    return today.getTime() > startAt && today.getTime() < endAt && isValid;
  },
};

export default getters;
