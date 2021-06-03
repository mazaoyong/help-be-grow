import { Popup } from '@youzan/vis-ui';
import { getThemeColor } from '@youzan/vue-theme-plugin';
import App from './index.vue';

export default Popup.getOpenPopup(App, {
  props: {
    closeable: true,
    title: '付费送好友',
    buttons: [
      {
        text: '下一步',
        color: getThemeColor('main'),
        onClick: ctx => { ctx.handleBuy(); },
      },
    ],
  },
});
