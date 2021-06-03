import React from 'react';
import { useArthurModel } from '@youzan/arthur-scheduler-react';
import { getShopAbility } from '../api/common';
import { Notify } from 'zent';

let lastFetchTime = 0;
const DEBOUNCE_TIME = 60 * 1000;
// 默认情况下展示进入线索
const defaultSetting = {
  showInClue: true,
};
const useCheckInfoCollect = (overrideName?: string, overrideNamespace?: string) => {
  const [hasBought, setBought] = React.useState(false);
  const { model: infoCollectModel } = useArthurModel(
    overrideName || 'courseEdit.infoCollect',
    overrideNamespace || 'course',
  );

  const infoCollectAvailable = React.useMemo(() => {
    if (hasBought) return true;
    const { needBuy = false } = infoCollectModel;
    return !needBuy;
  }, [hasBought, infoCollectModel]);

  React.useEffect(() => {
    const now = new Date().getTime();
    if (now - lastFetchTime > DEBOUNCE_TIME) {
      if (!infoCollectAvailable) {
        lastFetchTime = now;
        getShopAbility(/** 信息采集 */ 'information_collection_ability')
          .then(({ valid }) => setBought(valid))
          .catch(Notify.error);
      }
    }
    return () => {
      lastFetchTime = 0;
    };
  }, [infoCollectAvailable]);

  return {
    infoCollectAvailable,
    infoCollectModel: {
      ...defaultSetting,
      // 如果被默认能力替代，就不会替换default中配置的字段
      ...infoCollectModel,
    },
  };
};

export default useCheckInfoCollect;
