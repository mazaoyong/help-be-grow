import { showWrapperHOF, isInStoreCondition } from 'fns/chain';
import { isRetailShop, isRetailMinimalistBranchStore, isRetailMinimalistHqStore, isUnifiedShop, isRetailMinimalistPartnerStore } from '@youzan/utils-shop';

export const chainSupportHqAndSingle = isInStoreCondition({
  supportHqStore: true,
  supportSingleStore: true,
  supportNonRetailUnifiedShop: true,
});

export const chainSupportBranch = isInStoreCondition({
  supportBranchStore: true,
  supportHqStore: false,
  supportSingleStore: false,
});

export const supportRetailPartner = isInStoreCondition({
  supportMinifyParterShop: true,
  supportUnifiedPartnerStore: true,
});

export const chainSupport = isInStoreCondition({ supportChainStore: true });
export const chainSupportMinify = isInStoreCondition({
  supportMinifyRetailBranchShop: true,
  supportMinifyRetailHqShop: true,
  supportMinifyParterShop: true,
});

export const chainSupportHqAndBranch = isInStoreCondition({
  supportBranchStore: true,
  supportHqStore: true,
});

export const chainSupportSingle = isInStoreCondition({
  supportSingleStore: true,
  supportNonRetailUnifiedShop: true,
});

export const chainSupportUnified = isUnifiedShop;

// 兼容chainSupportSingle逻辑外加极简版只支持分店
export const chainSupportSingleAndMinifyBranch = isInStoreCondition({
  supportSingleStore: true,
}) || (isRetailShop && !(isRetailMinimalistHqStore || isUnifiedShop));

// 兼容chainSupportSingle逻辑外加极简版只支持总店
export const chainSupportAndMinifyHq = isInStoreCondition({
  supportSingleStore: true,
}) || (isRetailShop && !(isRetailMinimalistBranchStore || isUnifiedShop));

// 兼容chainSupportHqAndSingle逻辑外加极简版只支持总店
export const chainSupportHqAndSingleAndMinifyHq = isInStoreCondition({
  supportBranchStore: false,
  supportHqStore: true,
  supportSingleStore: true,
}) || (isRetailShop && !(isRetailMinimalistBranchStore || isUnifiedShop || isRetailMinimalistPartnerStore));

// export const chainSupportColumn = isInStoreCondition({
//   supportSingleStore: true,
//   supportNonRetailUnifiedShop: true,
// });

export const chainSupportOnlyHq = isInStoreCondition({
  supportHqStore: true,
});

export const chainSupportModify = isInStoreCondition({
  supportHqStore: true,
  supportSingleStore: true,
  supportRetailSingleShop: true,
  supportRetailUnitedHqShop: true,
});

export const chainSupportHqAndSingleShowWrapper = showWrapperHOF(chainSupportHqAndSingle);

export const chainSupportBranchShowWrapper = showWrapperHOF(chainSupportBranch);

export const chainSupportSingleShowWrapper = showWrapperHOF(chainSupportSingle);

export const chainSupportHqAndBranchWrapper = showWrapperHOF(chainSupportHqAndBranch);
