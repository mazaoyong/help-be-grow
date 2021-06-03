import { isInStoreCondition } from 'fns/chain';

export const chainSupportOnlySingle = isInStoreCondition({
  supportSingleStore: true,
});

export const chainSupportOnlyHq = isInStoreCondition({
  supportHqStore: true,
});

export const chainSupportHq = function(selectedKdtId) {

  return isInStoreCondition({
    supportHqStore: +selectedKdtId === _global.kdtId,
  });
};