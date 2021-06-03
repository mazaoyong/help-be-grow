// 获取二维码
import { ajax } from '@youzan/vis-ui';

export function getQrcode(data: any): Promise<any> {
  return ajax({
    url: '/wscvis/common/qr/getQrcode.json',
    data,
    loading: false,
  });
}
