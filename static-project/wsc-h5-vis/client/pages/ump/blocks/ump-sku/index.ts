import { QuickOpen } from '@youzan/vis-ui';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
// import log from '@/pages/course/detail/utils/log';
import store from './store';
import App from './index.vue';

const openSkuPopup = QuickOpen.quickOpen(App);

export default function(
  alias = '',
  originSku = {},
  activitySku = {},
  activityType = ACTIVITY_TYPE.NO_ACTIVITY,
  selectedSku = null,
  picture = '',
  priceTag = '',
  goodsData = {}) {
  store.dispatch('initSku', { alias, originSku, activitySku, activityType, selectedSku, picture, priceTag, goodsData });
  return openSkuPopup();
}
