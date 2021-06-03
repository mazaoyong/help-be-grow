import { Popup } from 'vant';
import { QuickOpen } from '@youzan/vis-ui';
import Component from './index.vue';

const getOpenPopup = QuickOpen.quickOpenCustom(Popup);

export default (options: { onSuccess?: () => void } = {}) => {
  const open = getOpenPopup(Component, {
    class: 'dialog-login-container',
  });

  open('', {
    on: {
      success: options.onSuccess || (() => window.location.reload()),
    },
  });
};
