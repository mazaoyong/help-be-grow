import { GOODS_TYPE } from '@/constants/course/goodsType';
import live from './live';

const map: any = {
  [GOODS_TYPE.LIVE]: live,
};

export default function goodsParser(goodsType: GOODS_TYPE, data: any) {
  return map[goodsType](data);
}
