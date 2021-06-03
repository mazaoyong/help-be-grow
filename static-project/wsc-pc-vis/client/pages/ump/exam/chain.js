import { showWrapperHOF, isInStoreCondition } from 'fns/chain';

export const chainSupportHqAndSingle = isInStoreCondition({
  supportBranchStore: false,
  supportHqStore: true,
  supportSingleStore: true,
  supportRetailSingleShop: true,
  supportMinifyRetailHqShop: true,
});

export const chainSupportBranch = isInStoreCondition({
  supportBranchStore: true,
  supportHqStore: false,
  supportSingleStore: false,
});

export const chainSupportHqAndBranch = isInStoreCondition({
  supportBranchStore: true,
  supportHqStore: true,
});

export const chainSupportHq = isInStoreCondition({
  supportHqStore: true,
});

export const chainSupportHqAndSingleShowWrapper = showWrapperHOF(chainSupportHqAndSingle);

export const chainSupportBranchShowWrapper = showWrapperHOF(chainSupportBranch);

export const chainSupportOnlySingle = isInStoreCondition({
  supportSingleStore: true,
});

export const chainSupportSingleShowWrapper = showWrapperHOF(chainSupportOnlySingle);

export const chainSupportHqAndBranchWrapper = showWrapperHOF(chainSupportHqAndBranch);
