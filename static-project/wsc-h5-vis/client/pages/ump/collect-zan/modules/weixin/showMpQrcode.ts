import { QuickOpen, FollowMp } from '@youzan/vis-ui';
import { getMpQrcode } from '@/common-api/utils/index';

const props = {
  value: true,
  qrcodeUrl: '',
};

getMpQrcode({
  mp_id: _global.mp_account!.id || 0,
})
  .then((res: any) => {
    if (res.qrcodeUrl) {
      props.qrcodeUrl = res.qrcodeUrl;
    }
  })
  .catch(() => {
    // Toast('获取公众号二维码失败');
  });

const showMpQrcode = () => {
  QuickOpen.quickOpen(FollowMp)('', {
    props,
    on: {
      input(value: boolean) {
        props.value = value;
      },
    },
  });
};

export default showMpQrcode;
