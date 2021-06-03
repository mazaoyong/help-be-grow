import { getModel } from '@youzan/arthur-scheduler-react';

export const getAbilitys = () => {
  const introductionModel = getModel('introductionDataView', '转介绍');
  const chainStoreModel = getModel('isChainShop', '连锁店铺');
  return {
    introductionDataView: introductionModel.available,
    chainStore: chainStoreModel.available,
  };
};
