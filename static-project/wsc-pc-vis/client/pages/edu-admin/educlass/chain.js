import { showWrapperHOF, isInStoreCondition } from 'fns/chain';

export const chainSupportAllEduStore = isInStoreCondition({
  supportBranchStore: true,
  supportHqStore: true,
  supportSingleStore: true,
});

export const chainSupportOnlyHq = isInStoreCondition({
  supportBranchStore: false,
  supportHqStore: true,
  supportSingleStore: false,
});

// 所有教育类型都展示的 showWrapper
export const chainSupportAllEduStoreShowWrapper = showWrapperHOF(chainSupportAllEduStore);

//  只支持总部的 showWrapper
export const chainSupportOnlyHqShowWrapper = showWrapperHOF(chainSupportOnlyHq);
