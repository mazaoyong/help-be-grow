import { isEduSingleStore } from '@youzan/utils-shop';
import { hqKdtId } from './config';

/* 查询类型 0，查普通店铺（非连锁单店）
1，查连锁总店（单独查总店这一个店铺）
2，查连锁校区（单独查校区）
3，查所有店铺的加总 */
export function getQueryType(subKdtId) {
  if (isEduSingleStore) {
    return 0;
  } else if (!subKdtId) {
    return 3;
  } else if (subKdtId === hqKdtId) {
    return 1;
  } else {
    return 2;
  }
}
