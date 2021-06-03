import { showWrapperHOF, isInStoreCondition } from 'fns/chain';
import { isUnifiedShop } from '@youzan/utils-shop';

export const chainSupportHqAndSingle = isInStoreCondition({
  supportHqStore: true,
  supportSingleStore: true,
  supportNonRetailUnifiedShop: true,
});

export const chainSupportHqAndSinglePure = isInStoreCondition({
  supportHqStore: true,
  supportSingleStore: true,
  supportRetailSingleShop: true,
});

export const chainSupportBranch = isInStoreCondition({
  supportBranchStore: true,
  supportHqStore: false,
  supportSingleStore: false,
});

export const chainSupportSingle = isInStoreCondition({
  supportSingleStore: true,
  supportNonRetailUnifiedShop: true,
});

export const chainSupportOnlyHq = isInStoreCondition({
  supportHqStore: true,
});

export const chainSupportModify = isInStoreCondition({
  supportHqStore: true,
  supportSingleStore: true,
  supportRetailSingleShop: true,
  supportRetailUnitedHqShop: true,
});

export const chainSupportUnified = isUnifiedShop;

export const chainSupportHqAndSingleShowWrapper = showWrapperHOF(chainSupportHqAndSingle);

export const chainSupportHqAndSingleShowWrapperPure = showWrapperHOF(chainSupportHqAndSinglePure);

export const chainSupportBranchShowWrapper = showWrapperHOF(chainSupportBranch);

export const chainSupportSingleShowWrapper = showWrapperHOF(chainSupportSingle);
