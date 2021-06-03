import { Popup } from '@youzan/vis-ui';
import { getThemeColor } from '@youzan/vue-theme-plugin';
import App from './index.vue';

export default Popup.getOpenPopup(App, {
  props: {
    buttons: [
      {
        text: '完成',
        color: getThemeColor('main'),
        onClick: ctx => { ctx.$emit('resolve'); },
      },
    ],
  },
});
