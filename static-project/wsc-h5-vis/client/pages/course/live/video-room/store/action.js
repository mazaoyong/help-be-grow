import qs from 'qs';
import UA from 'zan-utils/browser/ua_browser';
import Args from '@youzan/utils/url/args';
import { initWXSdk } from '@youzan/wxsdk';
import { getSafeUrl } from '@/common/utils/custom-safe-link';
import { appendLogParamsTo } from 'pct/utils';

import { getLiveSetting } from '../api';
import {
  getCouponList,
  getGoodsList,
  receiveCoupon,
} from '../api/live-selling';
import { logVideoRoom } from '../track';
import formatCoupon, { serialCouponList } from '../utils/format-coupon';
import formatGoods from '../utils/format-goods';
import { Toast } from 'vant';

const actions = {
  initData({ commit, dispatch }) {
    const queries = qs.parse(location.search, { ignoreQueryPrefix: true });
    commit('setQueries', queries);

    const { alias } = queries;
    dispatch('initEnv');
    dispatch('initShare', alias);
    // 获取直播间营销按钮开关状态
    dispatch('getLiveRoomUMPState', alias);
  },

  initEnv({ commit }) {
    const isMobile =
      UA.isMobile() &&
      !navigator.userAgent.toLowerCase().includes('windowswechat');

    commit('setEnv', { isMobile, isIOS: UA.isIOS() });
  },

  initShare(_, alias) {
    logVideoRoom(alias);
    // 设置直播间分享
    try {
      const title = Args.get('title') || '推荐你来看这场直播';
      const cover = Args.get('cover');
      const desc = Args.get('summary');
      let shareUrl = getSafeUrl({
        url: `/wscvis/course/detail/${alias}`,
        kdtId: _global.kdt_id,
      });
      initWXSdk({
        shareConfig: {
          link: appendLogParamsTo(shareUrl),
          desc,
          title,
          cover,
        },
      });
    } catch (err) {
      window.yzStackLog &&
        window.yzStackLog.log({
          name: 'live-room-share-error',
          message: '直播间分享设置失败',
          extra: { err },
        });
    }
  },

  async getLiveRoomUMPState({ commit }, alias) {
    if (alias) {
      try {
        const {
          openReward,
          liveSellingState,
          liveFlowId,
        } = await getLiveSetting(alias);
        commit('setRewardSetting', openReward);
        commit('setLiveSellingSetting', {
          liveSelling: liveSellingState,
          liveFlowId,
        });
        // 接口性能不行，移除项目初始化请求商品和优惠券列表
        // if (liveSellingState && !Number.isNaN(liveFlowId)) {
        //   dispatch('getLiveCouponList');
        //   dispatch('getLiveGoodsList');
        // }
      } catch (err) {
        console.error(err);
        Toast.fail('获取直播间设置失败');
      }
    }
  },

  getLiveCouponList({ commit, state }) {
    const { liveFlowId } = state.foundationStates;
    if (liveFlowId) {
      getCouponList({ liveFlowId, kdtId: _global.kdt_id })
        .then(serialCouponList)
        .then(couponList => couponList.map(formatCoupon))
        .then(couponList => commit('setCouponList', couponList))
        .catch(Toast.fail);
    }
  },

  getLiveGoodsList({ commit, state, getters }, pageNumber) {
    const { liveFlowId } = state.foundationStates;
    const current = pageNumber || state.pageInfo.goodsList.pageNumber;
    if (liveFlowId && getters.goodsFetchState !== 'pending') {
      if (current === 1) {
        commit('resetGoodsListPage');
      }
      const totalNumber = state.pageInfo.goodsList.total;
      const thereIsGoods = state.liveSellingData.goodsList.length < totalNumber;
      if (totalNumber > 0 && !thereIsGoods) return;
      commit('setFetchGoodsListState', true);
      getGoodsList({ liveFlowId }, { pageNumber: current, pageSize: 20 })
        .then(({ content, total }) => {
          commit('increaseGoodsListPage', total);
          return content;
        })
        .then(goodsList => goodsList.map(formatGoods))
        .then(goodsList =>
          commit('setGoodsList', { goodsList, pageNumber: current }),
        )
        .finally(() => commit('setFetchGoodsListState', false))
        .catch(Toast.fail);
    }
  },

  // 领取优惠券
  async postReceiveCoupon({ dispatch, state }, couponId) {
    const { liveFlowId } = state.foundationStates;
    if (liveFlowId) {
      try {
        const res = await receiveCoupon({ liveFlowId, couponId });
        if (res) {
          Toast.success('领取成功');
          dispatch('getLiveCouponList');
        }
      } catch (err) {
        console.error(err);
        Toast.fail(err);
      }
    }
  },
};

export default actions;
