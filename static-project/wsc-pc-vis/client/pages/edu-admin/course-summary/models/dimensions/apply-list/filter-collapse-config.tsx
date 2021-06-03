import type { FilterConfigType } from '@youzan/ebiz-components/es/types/easy-list';

interface IGetCollapseConfigParams {}
export const getCollapseConfig = (_params: IGetCollapseConfigParams): FilterConfigType => {
  return [
    {
      name: 'registerTime',
      label: '报名时间：',
      type: 'DateRangePicker',
    },
  ];
};
