import { Select } from '@youzan/ebiz-components';
import { isEduHqStore } from '@youzan/utils-shop';
import { IEbizSelectProps } from '@youzan/ebiz-components/es/types/select';
import { ICombinedFilterConf } from '@youzan/ebiz-components/es/types/easy-list';

import {
  filterBaseConfigs,
  clueDatePickerFilterGroup,
  IGetFilterConfigParams,
} from './config-base';

// prettier-ignore
type GetPoolFilterConfigParams = Pick<IGetFilterConfigParams, 'campusList' | 'setSelectCampus'>;
const getPoolFilterConfig = (params: GetPoolFilterConfigParams): ICombinedFilterConf[][] => [
  [
    filterBaseConfigs.name,
    filterBaseConfigs.telephone,
    filterBaseConfigs.sourceId,
    filterBaseConfigs.tags,
    {
      type: 'Custom',
      name: 'kdtId',
      label: '所属校区：',
      renderField: Select,
      visible: isEduHqStore,
      inheritProps: {
        width: '200px',
        mode: 'sync',
        filter: true,
        clearable: true,
        options: params.campusList,
        onChange(value) {
          params.setSelectCampus(Number(value));
        },
        dropdownClassName: 'cover__clue-selector',
      } as IEbizSelectProps,
    },
  ],
  ...clueDatePickerFilterGroup,
];

export default getPoolFilterConfig;
