import { Toast } from 'vant';
import { QuickOpen, Popup } from '@youzan/vis-ui';
import UA from '@youzan/utils/browser/ua_browser';
import CopyPopupContent from './CopyPopup.vue';

const getOpenPopup = QuickOpen.quickOpenCustom(Popup);

export default (options: any) => {
  const open = getOpenPopup(CopyPopupContent, {
    class: 'copy-popup-container',
    props: {
      title: '复制地址',
      closeable: true,
      buttons: [
        {
          text: '复制地址',
          class: 'main-btn',
          onClick: (ctx: any) => {
            const target = document.querySelector('#copyTarget');
            const copy = () => {
              const ERR_MEG = '复制失败，请手动复制链接';
              try {
                if (document.execCommand('Copy')) {
                  Toast('复制成功');
                  ctx.$emit('resolve');
                } else {
                  Toast(ERR_MEG);
                }
              } catch (err) {
                Toast(ERR_MEG);
              }
            };
            if (UA.isIOS()) {
              const range = document.createRange();
              range.selectNodeContents(target as any);
              const selection = window.getSelection();
              selection!.removeAllRanges();
              selection!.addRange(range);
              copy();
              selection!.removeAllRanges();
            } else {
              const text = target!.innerHTML;
              const input = document.createElement('input');
              input.setAttribute('value', text);
              document.body.appendChild(input);
              input.setSelectionRange(0, 99999);
              input.select();
              copy();
              document.body.removeChild(input);
            }
          },
        },
      ],
    },
  });

  open('', options);
};
