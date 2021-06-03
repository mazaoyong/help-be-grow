import { GOODS_TYPE } from '@/constants/course/goods-type';
import getDefaultButtonText from '../../default-button-text';
import content from './content';
import column from './column';
import live from './live';
import course from './course';

export default function(activityData, state, getters) {
  const defaultButtonText = getDefaultButtonText(state);

  const map = {
    [GOODS_TYPE.LIVE]: live,
    [GOODS_TYPE.CONTENT]: content,
    [GOODS_TYPE.FX_CONTENT]: content,
    [GOODS_TYPE.COLUMN]: column,
    [GOODS_TYPE.FX_COLUMN]: column,
    [GOODS_TYPE.COURSE]: course,
  };

  return map[state.goodsType](state, defaultButtonText, getters);
}
