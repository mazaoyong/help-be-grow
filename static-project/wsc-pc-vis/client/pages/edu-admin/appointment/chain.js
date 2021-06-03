import { isInStoreCondition } from 'fns/chain';

export const chainSupportHq = isInStoreCondition({
  supportBranchStore: false,
  supportHqStore: true,
  supportSingleStore: false,
});

// 支持连锁
export const chainSupportChain = isInStoreCondition({
  supportChainStore: true,
});

export const chainSupportSingle = isInStoreCondition({
  supportBranchStore: false,
  supportHqStore: false,
  supportSingleStore: true,
});
