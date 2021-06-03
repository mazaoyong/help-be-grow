import { map, get } from 'lodash';
import { Toast } from 'vant';
import YZLocalStorage from '@youzan/utils/local_storage';
import { redirect } from '@/common/utils/custom-safe-link';
import getUserPosition from 'common/utils/get-user-position';
import { getCollectInfoSettings } from '@/common-api/collect-info';
import log from '@/pages/course/detail/utils/log';
import { COUPON_STATUS } from '@/constants/course/coupon-status';
import { checkAndLogin } from '@/common/utils/login';
import { GOODS_TYPE } from '@/constants/course/goodsType';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';

import { NeedVerifyCodeEnum } from '@/constants/course/collect-info-type';
import goodsParser from './parser/goods-parser';
import activityParser from './parser/activity-parser';
import {
  getDetail,
  getActivity,
  getNextOwl,
  receiveCoupon as receiveCouponApi,
  getCouponList,
} from './api';
import openSkuPopup from './sku-popup';

const SORT_TYPE = 'paidcolumn:sorttype';
const CONTENT_PROGRESS = 'paidcontent:progress';
const COLUMN_PROGRESS = 'paidcolumn:progress';

const couponBizNameMap = {
  take: 'goods_details_take',
  auto_take: 'goods_details_auto_take',
};

function readCache(key) {
  let cache = {};
  try {
    cache = JSON.parse(YZLocalStorage.getItem(key)) || {};
  } catch (error) {
    YZLocalStorage.setItem(key, JSON.stringify({}));
  }
  return cache;
}

function writeCache(key, value) {
  try {
    YZLocalStorage.setItem(key, JSON.stringify(value));
  } catch (error) {}
}

const sortTypeCache = readCache(SORT_TYPE);
const contentProgressCache = readCache(CONTENT_PROGRESS);
const columnProgressCache = readCache(COLUMN_PROGRESS);

function checkAndLoginPromise(callback) {
  return new Promise((resolve, reject) => {
    checkAndLogin(() => callback(resolve, reject));
  });
}

export async function receiveCouponAction({
  couponId,
  isAuto = false,
  loading = true,
}) {
  const requestId = `${couponId}-${new Date().getTime()}`;
  const bizName = isAuto ? couponBizNameMap.auto_take : couponBizNameMap.take;
  await checkAndLoginPromise(async (resolve, reject) => {
    loading &&
      Toast.loading({
        message: '领取中...',
        forbidClick: true,
      });
    try {
      const data = await receiveCouponApi({
        couponId,
        bizName,
        requestId,
      });
      resolve(data);
    } catch (err) {
      reject(err);
    }
  });
}

export async function autoReceiveCouponMessage(couponId) {
  let successMsg, errorMsg;
  try {
    await receiveCouponAction({
      couponId,
      isAuto: true,
      loading: false,
    });
    successMsg = '已为你领取1张优惠券，下单享优惠';
  } catch (error) {
    errorMsg = error || '领取失败';
  }

  return { preToastDesc: successMsg || errorMsg };
}

const actions = {
  showSkuPop() {
    openSkuPopup(null, true);
  },

  async autoReceiveCoupon({ state }) {
    const hasSku = get(state, 'goodsData.sku.hasSku', false);
    if (hasSku) return null;

    const { activityData } = state;

    const optimalCoupon = get(activityData, 'coupon.optimalSkuPreference', {});
    const { activityId: couponId } = optimalCoupon;
    const config = await autoReceiveCouponMessage(couponId);
    return { config };
  },

  async fetchCouponList({ state, commit }, payload) {
    const { activityDataMap, goodsType, goodsData } = state;
    const { goodsId } = goodsData;

    // 分销专栏，分销内容，不展示公开领券优惠券
    if (goodsType === GOODS_TYPE.FX_COLUMN || goodsType === GOODS_TYPE.FX_CONTENT) {
      return;
    }
    const toTrue = () => true;
    const forbidActivityFn = {
      [ACTIVITY_TYPE.SEC_KILL]: toTrue,
      [ACTIVITY_TYPE.POINTS_EXCHANGE]: toTrue,
      [ACTIVITY_TYPE.COLLECT_ZAN]: () => {
        return !!_global.miniprogram?.isMiniProgram;
      },
    };
    const isForbid = Object.entries(forbidActivityFn).some(
      ([key, forbidFn]) => {
        if (!activityDataMap[key]) {
          return false;
        }
        return forbidFn();
      },
    );
    if (isForbid) return;

    try {
      const coupons = await getCouponList(goodsId);
      commit('goodsCoupons', coupons);
    } catch (error) {
      console.warn('fetchCouponList', error);
    }
  },

  // 查询知识付费商品的信息采集配置
  fetchCollectInfo({ commit }, alias) {
    getCollectInfoSettings({
      aliasList: [alias],
      scene: 1,
    }).then(data => {
      const alias = get(data, '[0].alias', '');
      const collectSetting = get(data, '[0].collectSetting', []);
      const needVerifyCode = get(data, '[0].needVerifyCode', NeedVerifyCodeEnum.UNNEED);

      commit('setOnlineCourseCollectSetting', {
        alias,
        collectSetting,
        needVerifyCode: needVerifyCode === NeedVerifyCodeEnum.NEED,
      });
    });
  },

  // 单页内页面更新，在 App.vue 中使用，不会在其他地方用了
  pageUpdate({ state, commit, dispatch }, alias) {
    Promise.all([
      getDetail(alias),
      getActivity(alias),
    ]).then(([{ goodsType, goodsData, design }, activityData]) => {
      commit('selectedSku', null);
      commit('skuPopupVisiable', false);
      commit('columnFreeContentCount', 0);
      commit('audioOrVideoPlayEndRecommendGoods', null);

      const parsedGoodsData = goodsParser(goodsType, goodsData);

      commit('goodsType', goodsType);
      commit('goodsData', parsedGoodsData);
      commit('design', design);
      commit('setActivityDataCopy', activityData);
      commit('activityData', activityParser(activityData, state));

      dispatch('fetchCollectInfo', alias);

      document.title = parsedGoodsData.title;
    }).catch(error => {
      if (error === 'WSC-H5-VIS-GOODS-LOCKED') {
        redirect({
          url: '/wscvis/lock',
        });
      } else {
        Toast(error);
      }
    });
  },

  // 是否需要信息采集变更时重新计算活动数据
  reCalcActivityData({ state, getters, commit }) {
    commit('activityData', activityParser(state.activityDataCopy, state, getters));
  },

  // 以下方法为 sku-popup 和 sku-block 使用
  toAddressList({ state }) {
    log({
      et: 'custom',
      ei: 'to_address',
      en: '查看上课地点',
    });
    const addressList = get(state, 'goodsData.addressList', []);
    const storeIds = JSON.stringify(map(addressList, (item) => item.id));
    getUserPosition()
      .then((res) => {
        // 跳转到地址列表页
        const latitude = res.latitude || 0;
        const longitude = res.longitude || 0;
        redirect({
          url: '/wscvis/edu/address-list',
          query: {
            latitude,
            longitude,
            storeIds,
          },
        });
      })
      .catch(() => {
        // 用户拒绝授权或获取用户地址失败，则不传当前的地址信息
        redirect({
          url: '/wscvis/edu/address-list',
          query: {
            storeIds,
          },
        });
      });
  },
  toMap({ state }) {
    log({
      et: 'custom',
      ei: 'to_map',
      en: '查看上课校区',
    });
    const shopDetailInfo = get(state, 'goodsData.shopDetailInfo', {});
    redirect({
      url: '/wscvis/edu/map',
      query: {
        longitude: shopDetailInfo.longitude,
        latitude: shopDetailInfo.latitude,
        province: shopDetailInfo.province,
        city: shopDetailInfo.city,
        district: shopDetailInfo.district,
        address: shopDetailInfo.address,
      },
    });
  },

  // 以下方法为内容、专栏缓存处理
  initSortType({ getters, commit }) {
    commit('sortType', sortTypeCache[`c-${getters.columnAlias}`] || 'desc');
  },
  toggleSortType({ commit, state, getters, dispatch }) {
    const sortType = state.sortType === 'desc' ? 'asc' : 'desc';
    commit('sortType', sortType);
    sortTypeCache[`c-${getters.columnAlias}`] = sortType;
    writeCache(SORT_TYPE, sortTypeCache);

    dispatch('fetchNextInfo');
  },
  initContentProgress({ commit }) {
    commit('contentProgress', contentProgressCache);
  },
  updateContentProgress({ state }, payload) {
    const alias = state.goodsData.alias;
    const last = state.contentProgress[`c-${alias}`] || {};
    if (last.percent !== 100) {
      const newProgress = Object.assign({}, last, payload);
      last && delete last.latest;
      newProgress.latest = last;
      contentProgressCache[`c-${alias}`] = newProgress;
      writeCache(CONTENT_PROGRESS, contentProgressCache);
    }
  },
  initColumnProgress({ getters, commit }) {
    if (getters.columnAlias) {
      commit(
        'columnProgress',
        columnProgressCache[`c-${getters.columnAlias}`] || {},
      );
    }
  },
  updateColumnProgress({ state, getters }, payload) {
    if (getters.columnAlias) {
      const newProgress = Object.assign({}, state.columnProgress, payload);
      columnProgressCache[`c-${getters.columnAlias}`] = newProgress;
      writeCache(COLUMN_PROGRESS, columnProgressCache);
    }
  },

  fetchNextInfo({ state, commit }) {
    getNextOwl(state.goodsData.alias, state.sortType, state.goodsData?.column?.alias || state.goodsData.alias)
      .then((res) => {
        if (res) {
          commit('updateNextOwlInfo', res);
        } else {
          commit('updateNextOwlInfo', {});
        }
      })
      .catch((errMsg) => console.error(errMsg));
  },

  closeTuitionPopover({ commit }) {
    commit('setCloseTuitionPopover');
  },

  async receiveCoupon({ commit }, payload) {
    const { couponId, type } = payload;
    try {
      await receiveCouponAction({ couponId, type });
      Toast('恭喜你抢到了');
      commit('updateCouponStatus', {
        couponId,
        status: COUPON_STATUS.RECEIVED,
      });
    } catch (err) {
      Toast(err || '领取失败');
      console.warn(err);
    }
  },
};

export default actions;
