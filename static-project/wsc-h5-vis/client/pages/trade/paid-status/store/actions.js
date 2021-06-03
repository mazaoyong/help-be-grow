import { isEmpty, get } from 'lodash';
import Args from '@youzan/utils/url/args';
import * as customSafeLink from '@/common/utils/custom-safe-link';
import {
  getPayRewardInfo,
  getUmpInfo,
  getIntroductionActivity,
} from '../api';
import RecommenAPI from '@/domain/recommend-gift/api';
import { isGetHighestPhase } from '@/domain/recommend-gift/utils';
import { initState } from './state';

const orderNo = Args.get('orderNo');

export default {
  getPayRewardInfo({ commit }) {
    getPayRewardInfo({ orderNo })
      .then((data) => {
        if (data) {
          commit('UPDATE_PAY_REWARD_INFO', data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  },

  getUmpInfo({ state, commit, dispatch }) {
    return getUmpInfo({ orderNo })
      .then((data) => {
        if (data && data.activitiesInfo) {
          commit('UPDATE_ACTIVITIES_INFO', data.activitiesInfo);
          commit('UPDATE_FISSION_COUPON_INFO', data.orderCouponDTO);
          dispatch('initState', {
            payState: state.payState,
            data,
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  },

  initState({ commit }, { payState, umpInfo }) {
    const {
      payStateText,
      paySuccessText = '支付成功',
      tip,
      btnList,
    } = initState(payState, umpInfo);

    commit('UPDATE_PAY_SUCCESS_TEXT', paySuccessText);
    commit('UPDATE_PAY_STATE_TEXT', payStateText);
    commit('UPDATE_TIP', tip);
    commit('UPDATE_BTN_LIST', btnList);
  },

  getIntroductionActivity({ state, commit }) {
    // 转介绍使用总店的 kdtid（支持连锁）
    const { rootKdtId, kdtId } = _global.shopMetaInfo;
    // 如果没有总店的kdtid，使用单店的
    const useKdtId = rootKdtId || kdtId;

    getIntroductionActivity()
      .then(data => {
        const { activity = {} } = data || {};
        if (!isEmpty(activity)) {
          const btnInfo = {
            text: '推荐得奖励',
            url: customSafeLink.getSafeUrl({
              url: '/wscvis/ump/introduction/old-student',
              kdtId: useKdtId,
              query: {
                kdt_id: useKdtId,
                alias: activity.alias || '',
                from: 'paid_status',
              },
            }),
          };

          commit('UPDATE_BTN_UMP_MAP', {
            key: 'introduction',
            btnInfo,
          });
        }
      });
  },
  async getRecommendGiftActivity({ state, commit }) {
    const { orderItemList } = state;
    const goodsAlias = get(orderItemList, '[0].alias', '');
    if (!goodsAlias) return;
    const activityData = await RecommenAPI.getGetDetailByGoodsAlias({
      goodsAlias,
    });

    if (!isEmpty(activityData)) {
      if (!isGetHighestPhase(activityData)) {
        const btnInfo = {
          component: 'ump-recommend-gift',
          props: {
            activityData,
          },
          url: customSafeLink.getSafeUrl({
            url: '/wscvis/ump/referral-invite',
            query: {
              alias: goodsAlias,
              fromPage: 'course',
            },
          }),
        };

        commit('UPDATE_BTN_UMP_MAP', {
          key: 'recommend-gift',
          btnInfo,
        });
      }
    }
  },
};
