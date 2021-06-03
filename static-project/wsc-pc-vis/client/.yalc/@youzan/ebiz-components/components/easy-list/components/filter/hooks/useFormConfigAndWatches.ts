import React from 'react';

import { IFilterProps } from '../../../types/filter';
import { getModelFromConf, getWatchesFromConf } from '../utils';

type FilterConfigType = IFilterProps['config'];
export const useFormModelAndWatches = (config: FilterConfigType) => {
  const configChangeCount = React.useRef(0);
  const [dumpConfig] = React.useState(config);
  const models = React.useMemo(() => getModelFromConf(dumpConfig), [dumpConfig]);
  const watches = React.useMemo(() => getWatchesFromConf(dumpConfig), [dumpConfig]);

  React.useEffect(() => {
    /* istanbul ignore next */
    if (configChangeCount.current > 1) {
      console.warn('[EasyList] config在EasyList运行时发生了改变，这是不被允许的！');
    }
  }, [config]);

  return {
    models,
    watches,
  };
};
