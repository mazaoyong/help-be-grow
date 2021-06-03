// import { isHqStore, isRetailMinimalistShop } from '@youzan/utils-shop';
import { isHqStore, isPartnerStore } from '@youzan/utils-shop';

const { isYZEdu, isSuperStore } = _global;

// 有赞连锁店铺(目前为零售极简版店铺)
// export const isYzChainStore = isRetailMinimalistShop;
export const isYzChainStore = isSuperStore;
// 展示连锁店铺筛选项
export const isShowChainStore = isHqStore || isPartnerStore;
export const storeLabel = isYZEdu ? '所属校区' : isSuperStore ? '店铺' : '网店';

// 有赞连锁标志来源
export const YOUZAN_CHAIN_BIZ_SOURCE = 'YOUZAN_CHAIN';
