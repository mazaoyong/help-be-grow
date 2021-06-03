import { cloneDeep } from 'lodash';
import { QuickOpen } from '@youzan/vis-ui';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import log from '@/pages/course/detail/utils/log';
import store from '../index';
import App from './index.vue';

let cachedActivityType = null;

const openSkuPopup = QuickOpen.quickOpen(App);

export default function(activityType = ACTIVITY_TYPE.NO_ACTIVITY, useCache = false, payload = null) {
  let passedActivityType = activityType;

  if (useCache) {
    passedActivityType = cachedActivityType;

    if (!Number.isInteger(passedActivityType)) {
      const { skuButtonsMap, activityTypes } = store.state;
      activityTypes.forEach(key => {
        if (skuButtonsMap[key] && skuButtonsMap[key].length) {
          passedActivityType = key;
        }
      });
    }
  }

  cachedActivityType = passedActivityType;
  let nextActivityType = passedActivityType;
  if (payload && Number.isInteger(payload.skuActivityType)) {
    nextActivityType = payload.skuActivityType;
  }

  openSkuPopup({
    props: {
      activityType: nextActivityType,
      payload,
      initialSku: cloneDeep(store.state.selectedSku),
    },
    on: {
      input(value) {
        if (!value) {
          log({
            et: 'custom',
            ei: 'close_sku_popup',
            en: '关闭sku弹窗',
          });
        }
        store.commit('skuPopupVisiable', value);
      },
    },
  });
}
