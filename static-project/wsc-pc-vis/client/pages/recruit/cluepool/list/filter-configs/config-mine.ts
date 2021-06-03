import { ICombinedFilterConf } from '@youzan/ebiz-components/es/types/easy-list';

import {
  filterBaseConfigs,
  clueDatePickerFilterGroup,
} from './config-base';

const getMineFilterConfig = (): ICombinedFilterConf[][] => [
  [
    filterBaseConfigs.name,
    filterBaseConfigs.telephone,
    filterBaseConfigs.sourceId,
    filterBaseConfigs.tags,
  ],
  ...clueDatePickerFilterGroup,
];

export default getMineFilterConfig;
