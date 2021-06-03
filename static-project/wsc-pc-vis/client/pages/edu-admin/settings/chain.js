import { isInStoreCondition } from 'fns/chain';

export const chainSupportHqAndSingle = isInStoreCondition({
  supportHqStore: true,
  supportSingleStore: true,
});
