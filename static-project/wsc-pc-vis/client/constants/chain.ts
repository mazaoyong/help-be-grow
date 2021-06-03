import { isEduShop } from '@youzan/utils-shop';

// 根据店铺类型判断在连锁店铺的分店中中显示为「校区」还是「网店」
export const BRANCH_STORE_NAME = isEduShop ? '校区' : '网店';
