import { Popup } from '@youzan/vis-ui';
import App from './index.vue';

export default function(title) {
  return Popup.getOpenPopup(App, {
    closeable: true,
    title,
  });
}
