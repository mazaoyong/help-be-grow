import { get } from 'lodash';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import { getEnvH5OrMiniprogramType } from '@/common/utils/log-params';

export const actions = {
  LOG_ENTERPAGE({ state, getters }) {
    window.yzlogInstance &&
      window.yzlogInstance.log({
        et: 'display',
        ei: 'enterpage',
        en: '浏览页面',
        pt: 'trade',
        params: {
          is_edu: 1,
          edu_activity_types: getters.activityTypes,
          edu_real_pay: state.pay.realPay,
          edu_num: getters.goodsTotalNum,
        },
      });
  },

  LOG_CREATE_ORDER({ state, getters }) {
    const {
      goodsTotalNum,
      assetsDescease,
      activityTypes,
      activityDecrease,
      orderOriginPrice,
      orderFinalPrice,
    } = getters;
    const endTime = new Date().getTime();

    window.yzlogInstance &&
      window.yzlogInstance.log({
        et: 'custom',
        ei: 'orderCreate',
        en: '创建订单',
        pt: 'trade',
        params: {
          is_edu: 1,
          order_no: state.order.orderNo,
          edu_time: endTime - state.enterTime,
          edu_num: goodsTotalNum,
          edu_assets_descease: assetsDescease,
          edu_activity_types: activityTypes,
          edu_activity_decrease: activityDecrease,
          edu_order_origin_price: orderOriginPrice,
          edu_order_final_price: orderFinalPrice,
        },
      });

    if (getters.singleGoods.activityType === ACTIVITY_TYPE.RECOMMEND_GIFT) {
      window.yzlogInstance &&
          window.yzlogInstance.log({
            et: 'click',
            ei: 'recommend_order_create',
            en: '被推荐人-确认支付',
            pt: 'trade',
            params: {
              env: getEnvH5OrMiniprogramType(),
              alias: get(state, 'recommendGift.recommendActivityId'),
            },
          });
    }
  },

  LOG_RECOMMENDGIFT_VISIT({ state, getters }) {
    if (getters.singleGoods.activityType === ACTIVITY_TYPE.RECOMMEND_GIFT) {
      window.yzlogInstance &&
        window.yzlogInstance.log({
          et: 'custom',
          ei: 'recommend_gift_visit',
          en: '推荐有奖被推荐人访问页面',
          pt: 'trade',
          params: {
            env: getEnvH5OrMiniprogramType(),
            alias: get(state.recommendGift, 'recommendActivityId'),
          },
        });
    }
  },
};
