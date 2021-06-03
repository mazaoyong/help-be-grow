import { ajax } from '@youzan/vis-ui';
import { GOODS_TYPE } from '@/constants/course/goodsType';

export { getQrcode } from '@/common/apis/qr';
export { postCreate } from '@/common-api/buy';
export { logout } from '@/common/apis/login';

export function getAssetState(data: any): Promise<{
  isOwnAsset: boolean,
  type: GOODS_TYPE,
}> {
  return ajax({
    url: '/wscvis/course/detail/getAssetState.json',
    data,
    loading: false,
  });
}
