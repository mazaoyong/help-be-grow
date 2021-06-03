import { Popup } from '@youzan/vis-ui';
import App from './index.vue';

export default Popup.getOpenPopup(App, {
  props: {
    title: '课程大礼包',
    closeable: true,
  },
});
