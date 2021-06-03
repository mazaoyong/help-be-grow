import React from 'react';
import { useArthurModel } from '@youzan/arthur-scheduler-react';
import { getShopAbility } from '../api/common';
import { Notify } from 'zent';

let lastFetchTime = 0;
const DEBOUNCE_TIME = 60 * 1000;
const useCheckInfoHidden = (overrideName?: string, overrideNamespace?: string) => {
  const [hasBought, setBought] = React.useState(false);
  const { model: infoHiddenModel } = useArthurModel(
    overrideName || 'offlineCourseManage.liveOps',
    overrideNamespace || 'course',
  );

  const infoHiddenAvailable = React.useMemo(() => {
    if (hasBought) return true;
    if (infoHiddenModel) {
      const { needBuy = false } = infoHiddenModel;
      return !needBuy;
    }
    return false;
  }, [hasBought, infoHiddenModel]);

  React.useEffect(() => {
    const now = new Date().getTime();
    if (now - lastFetchTime > DEBOUNCE_TIME) {
      if (!infoHiddenAvailable) {
        lastFetchTime = now;
        getShopAbility(/** 信息隐藏 */ 'information_hiding_ability')
          .then(({ valid }) => setBought(valid))
          .catch(Notify.error);
      }
    }
    return () => {
      lastFetchTime = 0;
    };
  }, [infoHiddenAvailable]);

  return { infoHiddenAvailable, infoHiddenModel };
};

export default useCheckInfoHidden;
