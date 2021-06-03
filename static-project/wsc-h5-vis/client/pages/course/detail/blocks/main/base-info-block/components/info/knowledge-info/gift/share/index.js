import { Popup } from 'vant';
import { QuickOpen } from '@youzan/vis-ui';
import App from './index.vue';

const getOpenPopup = QuickOpen.quickOpenCustom(Popup);

export default getOpenPopup(App, {
  class: 'share-popup',
});
