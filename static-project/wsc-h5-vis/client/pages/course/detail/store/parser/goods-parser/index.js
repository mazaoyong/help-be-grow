import { GOODS_TYPE } from '@/constants/course/goods-type';
import course from './course';
import column from './column';
import fxColumn from './fx-column';
import content from './content';
import fxContent from './fx-content';
import live from './live';

const map = {
  [GOODS_TYPE.COURSE]: course,
  [GOODS_TYPE.COLUMN]: column,
  [GOODS_TYPE.FX_COLUMN]: fxColumn,
  [GOODS_TYPE.CONTENT]: content,
  [GOODS_TYPE.FX_CONTENT]: fxContent,
  [GOODS_TYPE.LIVE]: live,
};

export default function goodsParser(goodsType, data) {
  return map[goodsType](data);
}
