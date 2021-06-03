import { Popup } from 'vant';
import { QuickOpen } from '@youzan/vis-ui';
import Component from './index.vue';

const getOpenPopup = QuickOpen.quickOpenCustom(Popup);

interface IDialogOptions {
  onCompleted?: () => void;
  props: {
    title: string;
    subtitle?: string;
    /** 扫码执行的操作 */
    actionText: string;
    cancelText?: string;
    okText?: string;
  }
}

export default (options: IDialogOptions) => {
  const { onCompleted, props } = options;
  const open = getOpenPopup(Component, {
    class: 'dialog-qrcode-container',
  });

  open('', {
    props,
    on: {
      completed: onCompleted || (() => window.location.reload()),
    },
  });
};
