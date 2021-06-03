import { Toast, Dialog } from 'vant';
import { sendCheckSmsCaptcha } from '@/common/utils/checkSmsCaptcha';
import * as Param from '@/pages/trade/buy/common/order-param';
import * as SafeLink from '@/common/utils/custom-safe-link';
import * as Api from '../../../api';

export const actions = {
  /**
   * 调用confirm接口刷新页面数据
   *
   * @param {any} param -
   * @param {Object} payload -
   * @param {'customerCard'} payload.source - 调用切换来源
   */
  FETCH_POST_CONFIRM_ORDER({ state, getters, commit }, payload) {
    const param = Param.getOrderParam(state, getters, payload);

    return Api.postConfirmOrder(param)
      .then((response) => {
        const { data } = response;
        if (data) {
          commit('ASSIGN_ORDER_DATA', data);
          const redirect = data.redirectConfig || {};

          // confirm 目前没有这些信息，后续待补
          if (redirect.orderCreated) {
            Toast('订单信息已更新，页面刷新中');
            location.reload();
          } else if (redirect.teamLocked) {
            Dialog.alert({
              message: '该店铺因存在异常，暂不支持购买，请联系商家',
            });
            Toast.clear();
          }
        } else {
          throw response;
        }
      })
      .catch((error = {}) => {
        Toast(error.msg || '服务器开小差了');
        throw error;
      });
  },

  FETCH_POST_CREATE_ORDER({ state, getters, commit, dispatch }) {
    const param = Param.getOrderParam(state, getters);

    return Api.postCreateOrder(param)
      .then((response) => {
        // 创建订单成功
        const { data } = response;
        if (data) {
          commit('SET_ORDER_DATA', data);
          dispatch('LOG_CREATE_ORDER');
          return data;
        } else {
          throw response;
        }
      })
      .catch((error = {}) => {
        const code = +error.code;

        switch (code) {
          case 348808006:
            Dialog.confirm({
              message: error.msg || '预约未成功，请选择其他时间课程',
              confirmButtonText: '去选择',
            }).then(() => {
              dispatch('REDIRECT_TO_APPOINTMENT');
            });
            break;

          case 101910001:
            // 部分商品失效的情况，优惠套餐的情况跳转到对应详情页
            if (getters.isPackageBuy) {
              return SafeLink.redirect({
                url: '/wscvis/ump/package-buy',
                query: {
                  activityAlias: state.shop.activityAlias,
                },
              });
            } else {
              Toast(error.msg || '下单失败，请重试');
            }
            break;
          default:
            Toast(error.msg || '下单失败，请重试');
        }

        throw error;
      });
  },

  SEND_CAPTCHA(_, payload) {
    const { mobile, callBack } = payload;

    sendCheckSmsCaptcha({
      mobile,
      scene: 1,
      callBack,
    });
  },
};
