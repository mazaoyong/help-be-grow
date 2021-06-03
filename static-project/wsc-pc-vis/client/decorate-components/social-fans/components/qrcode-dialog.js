import chooseLiveQrcode from '@youzan/react-components/es/components/choose-dialog/dialogs/live-qrcode';
import '@youzan/react-components/es/components/choose-dialog/style';

export const openLiveQrcode = () => {
  return new Promise(resolve => {
    chooseLiveQrcode({
      // 是否多选
      multiple: false,

      // 选中时的回调函数
      onChoose: data => {
        resolve(data);
      },

      config: window._global,
    });
  });
};
