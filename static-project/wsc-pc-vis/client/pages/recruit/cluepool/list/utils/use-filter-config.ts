import React from 'react';
import { ICombinedFilterConf } from '@youzan/ebiz-components/es/types/easy-list';

import { CluePageType } from './use-fetch-list';
import { IGetFilterConfigParams } from '../filter-configs/config-base';
import getAllFilterConfig from '../filter-configs/config-all';
import getPoolFilterConfig from '../filter-configs/config-pool';
import getMineFilterConfig from '../filter-configs/config-mine';

interface IUseFilterConfigProps extends IGetFilterConfigParams {
  pageType: CluePageType;
}
const useFilterConfig = (props: IUseFilterConfigProps): ICombinedFilterConf[][] => {
  const { pageType, ...passiveProps } = props;
  const _filterConfig = React.useMemo<ICombinedFilterConf[][]>(() => {
    switch (pageType) {
      case 'all':
        return getAllFilterConfig(passiveProps);
      case 'pool':
        return getPoolFilterConfig(passiveProps);
      case 'mine':
        return getMineFilterConfig();
      default: return [];
    }
  }, [pageType, passiveProps]);

  return _filterConfig;
};

export default useFilterConfig;
