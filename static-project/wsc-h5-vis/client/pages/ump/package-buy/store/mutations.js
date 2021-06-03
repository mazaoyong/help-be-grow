import fullfillImage from 'zan-utils/fullfillImage';
import makeRandomString from 'zan-utils/string/makeRandomString';
import { Toast } from 'vant';
import { moneyToYuan, getSkuPrice, getDesc, getOriginPrice } from '../common';
import Vue from 'vue';
import * as Log from '../track';

const pageRandomNumber = makeRandomString(8);
const mutations = {
  // 初始化数据
  INIT_DATA(state, payload = []) {
    const packages = payload;
    const discountPackage = packages[0] || {};
    let dafaultSelectedSolidPackage = {};

    const { goodsList = [], activity = {} } = discountPackage;
    state.goodsList = goodsList.slice();

    const endAt = activity.endAt * 1000 || 0;
    const today = new Date(Date.now());

    // 活动结束
    if (!packages.length || today.getTime() > endAt) {
      state.activityEnd = true;
      state.fetched = true;
      return;
    }

    const isMatchPackage = packages.length === 1 && discountPackage.activity.type === 1;

    packages.forEach(item => {
      item.savePrice = moneyToYuan(item.decrease);
      // 主要用于多个套餐时，标识套餐是否可选
      item.isCanSelectSolidPackage = true;

      if (isMatchPackage) {
        item.goodsList = item.goodsList.sort((a, b) => Number(!!b.major) - Number(!!a.major));
      }
      item.goodsList.forEach((v, index) => {
        const collocationPrice = getSkuPrice(v.hasMultiSkus, v.skus, v.totalStock);
        const originPriceObj = getOriginPrice(v.hasMultiSkus, v.price, v.skus, v.totalStock);

        v.isCanSelectGood = true;

        v.collocationPrice = collocationPrice.price;
        v.bannerId = `packagebuy.${item.activity.id}~list~${index + 1}~${pageRandomNumber}`;
        // v.activityPrice = collocationPrice.priceInYuan || moneyToYuan(packagePrice / goodsLen);
        v.activityPrice = collocationPrice.priceInFen;
        v.price = originPriceObj.price;
        v.originPrice = originPriceObj.originPrice;
        v.priceInFen = originPriceObj.priceInFen;
        v.currentSkuId = v.hasMultiSkus ? null : v.skus[0].id;
        v.thumbUrl = fullfillImage(v.thumbUrl, '!200x200.jpg', { toWebp: false });
        v.num = v.collocationNum || 1;
        Vue.set(v, 'desc', getDesc(v.hasMultiSkus, isMatchPackage, v.num));
        if (v.owlType === 10 && v.totalStock === 0) {
          // 标识某个商品是否可选
          v.isCanSelectGood = false;
          item.isCanSelectSolidPackage = false;
        } else if (v.owlType !== 10 && v.isPaid) {
          v.isCanSelectGood = false;
          item.isCanSelectSolidPackage = false;
        }
      });
    });

    // 如果是搭配套餐
    if (isMatchPackage) {
      const mainGoods = goodsList[0];
      state.mainGoods = mainGoods;
      discountPackage.goodsList = goodsList.slice(1);
      discountPackage.decrease = mainGoods.price - mainGoods.collocationPrice;
      activity.price = mainGoods.collocationPrice;

      this.commit('GENERATE_PAY_GOODS_LIST', {
        currentGoodsList: [state.mainGoods],
        currentActivity: activity,
      });
    } else {
      if (packages.length > 1) {
        // 某个商品参加多个套餐活动时，返回第一个可选的套餐；若套餐均不可选，默认返回第一个活动
        dafaultSelectedSolidPackage = packages.find((pk) => {
          return pk.isCanSelectSolidPackage === true;
        }) || packages[0];
      } else {
        // 只返回一个活动时，默认赋值第一个活动
        dafaultSelectedSolidPackage = packages[0];
      }

      this.commit('GENERATE_PAY_GOODS_LIST', {
        currentGoodsList: dafaultSelectedSolidPackage.goodsList,
        currentActivity: dafaultSelectedSolidPackage.activity,
      });
    }

    state.currentActivity = isMatchPackage ? activity : dafaultSelectedSolidPackage.activity;
    state.packages = packages;
    state.isMatchPackage = isMatchPackage;
    state.btnPrices.totalPrice = isMatchPackage ? activity.price : dafaultSelectedSolidPackage.activity.price;
    state.btnPrices.savePrice = isMatchPackage ? discountPackage.decrease : dafaultSelectedSolidPackage.decrease;
    state.fetched = true;

    Log.logInPage({ packageNum: packages.length });
  },

  // 生成下单所需数据
  GENERATE_PAY_GOODS_LIST(state, payload) {
    const { currentGoodsList, currentActivity } = payload;
    const firstGoodsList = state.payGoodsList[0];
    const isSameActivity = firstGoodsList && firstGoodsList.activityId === currentActivity.activityId;

    if (!isSameActivity && state.payGoodsList.length) {
      return;
    }

    const goodsList = currentGoodsList.map(item => ({
      goodsId: item.id,
      num: item.num,
      kdtId: item.kdtId,
      skuId: item.currentSkuId,
      price: item.price,
      collocationPrice: item.collocationPrice,
      activityAlias: currentActivity.activityAlias,
      activityId: currentActivity.activityId,
      activityType: 7,
      alias: item.alias,
      owlType: item.owlType,
    }));

    state.payGoodsList = state.payGoodsList.concat(goodsList);
  },

  // 展示sku弹窗
  SHOW_SKU_POPUP(state, payload) {
    const { sku, packageIndex, goodsIndex, productAlias } = payload;
    const { packages, mainGoods } = state;
    const { activity } = packages[packageIndex];
    const goods = goodsIndex > -1 ? packages[packageIndex].goodsList[goodsIndex] : mainGoods;

    if (productAlias) {
      state.goodsSkus[`${activity.activityId}${productAlias}`] = sku;
    }

    state.packageIndex = packageIndex;
    state.goodsIndex = goodsIndex;
    state.sku = sku;
    state.currentGoods = Object.assign(goods);
    state.currentActivity = activity;
    state.currentGoods.picture = goods.thumbUrl;
    state.skuPrices.originPrice = state.currentGoods.originPrice;
    state.skuPrices.activityPrice = state.currentGoods.activityPrice;
    this.commit('TOGGLE_SKU_POPUP', true);

    if (goods.totalStock === 0) {
      setTimeout(() => {
        Toast('商品已售罄');
      }, 1000);
    }
  },

  // 关闭sku弹窗
  TOGGLE_SKU_POPUP(state, payload) {
    state.skuVisible = payload;
  },

  // 当前活动
  SET_CURRENT_ACTIVITY(state, payload) {
    state.currentActivity = payload;
  },

  // 底部按钮价格
  SET_BTN_PRICES(state, payload) {
    state.btnPrices = payload;
  },

  // sku 价格
  SET_SKU_PRICES(state, payload) {
    state.skuPrices = payload;
  },

  // 设置下单数据
  RESET_PAY_GOODS_LIST(state, payload) {
    state.payGoodsList = payload;
  },

  // 优惠套餐数据
  RESET_PACKAGES(state, payload) {
    payload.forEach(item => {
      let originPrice = 0;
      item.goodsList.forEach(v => {
        originPrice += v.price * v.num;
      });

      const savePrice = originPrice - item.activity.price;
      item.savePrice = moneyToYuan(savePrice);
    });

    state.packages = payload;
  },

  // 搭配套餐主商品
  RESET_MAINGOODS(state, payload) {
    state.mainGoods = payload;
  },

  // 选完sku
  SELETED_SKU(state, payload) {
    state.isSeletedSku = true;
    state.selectedGoodsData = payload;
  },

  // 是否选完sku
  SET_IS_SELETED_SKU(state, payload) {
    state.isSeletedSku = payload;
  },

  // 复选框值
  SET_CHECKED_LIST(state, payload) {
    state.checkedList = payload;
  },
};

export default mutations;
