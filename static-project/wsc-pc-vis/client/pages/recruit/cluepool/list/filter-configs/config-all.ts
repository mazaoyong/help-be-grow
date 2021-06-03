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
type GetAllFilterConfigParams = Pick<IGetFilterConfigParams, 'staff' | 'campusList' | 'setSelectCampus'>;
const getAllFilterConfig = (params: GetAllFilterConfigParams): ICombinedFilterConf[][] => [
  [
    filterBaseConfigs.name,
    filterBaseConfigs.telephone,
    filterBaseConfigs.sourceId,
    {
      type: 'Custom',
      name: 'ownerId',
      label: '课程顾问：',
      visible: !isEduHqStore,
      renderField: Select,
      inheritProps: {
        mode: 'sync',
        width: '200px',
        filter: true,
        clearable: true,
        options: params.staff,
        dropdownClassName: 'cover__clue-selector',
      } as IEbizSelectProps,
    },
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

export default getAllFilterConfig;
