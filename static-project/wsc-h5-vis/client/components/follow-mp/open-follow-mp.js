import { Popup } from '@youzan/vis-ui';
import App from './content.vue';

export const openFollowMp = (props = {}) => Popup.getOpenPopup(App, {
  props: {
    buttons: [
      {
        text: '知道了',
        class: 'main-btn',
        onClick: ctx => { ctx.$emit('close'); },
      },
    ],
    ...props,
  },
});

export default openFollowMp();
