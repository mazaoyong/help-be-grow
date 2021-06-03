import { Popup } from '@youzan/vis-ui';
import { getThemeColor } from '@youzan/vue-theme-plugin';
import App from './index.vue';

export default function openQuestion(id) {
  const openPopup = Popup.getOpenPopup(App, {
    props: {
      buttons: [
        {
          text: '答完提交',
          color: getThemeColor('main'),
          onClick: ctx => { ctx.submit(); },
        },
      ],
    },
  });
  return openPopup({
    props: {
      id,
    },
  });
}
