import { Popup } from '@youzan/vis-ui';
import App from './index.vue';

export default Popup.getOpenPopup(App, {
  props: {
    closeable: true,
  },
});
