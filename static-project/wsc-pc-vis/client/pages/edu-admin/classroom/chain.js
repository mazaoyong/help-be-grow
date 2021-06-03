import { showWrapperHOF, isInStoreCondition, objectWrapper } from 'fns/chain';

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

export const chainSupportOnlySingle = isInStoreCondition({
  supportSingleStore: true,
});

// 所有教育类型都展示的 showWrapper
export const chainSupportAllEduStoreShowWrapper = showWrapperHOF(chainSupportAllEduStore);

//  只支持总部的 showWrapper
export const chainSupportOnlyHqShowWrapper = showWrapperHOF(chainSupportOnlyHq);

//  只支持单店的 showWrapper
export const chainSupportOnlySingleShowWrapper = showWrapperHOF(chainSupportOnlySingle);

export const CSDefaultOptionsWrapper = (obj) => {
  return objectWrapper({
    addressId: chainSupportOnlySingle,
    kdtId: chainSupportOnlyHq,
  }, obj);
};
