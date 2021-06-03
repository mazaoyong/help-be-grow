import { findIndex, slice } from 'lodash';
import type { ListIterator, PartialShallow } from 'lodash';

type LoFindIndexPredicate<T> =
  | string
  | number
  | symbol
  | [string | number | symbol, any]
  | ListIterator<T, boolean>
  | PartialShallow<T>
  | undefined;
interface IModifySerialNoParams<T> {
  originList: T[];
  target: T;
  predicate: LoFindIndexPredicate<T>;
  direction: 'up' | 'down';
  step?: number;
}
/** 用于调整数据的顺序，以数组的形式输出最终调用的顺序 */
function modifySerialNoWrapper<T>(params: IModifySerialNoParams<T>) {
  const {
    originList,
    target,
    predicate,
    direction,
    step = 1,
  } = params;
  const curGoodsIdx = findIndex(originList, predicate);
  if (step === 1) {
    if (curGoodsIdx >= 0) {
      const preSlice = slice(originList, 0, curGoodsIdx);
      const sufSlice = slice(originList, curGoodsIdx + 1);
      const swapGoodsList =
        direction === 'up'
          ? [target].concat(preSlice.splice(-1))
          : sufSlice.splice(0, 1).concat(target);
      return preSlice.concat(swapGoodsList).concat(sufSlice);
    }
  }
  return [];
}

export default modifySerialNoWrapper;
