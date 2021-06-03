import type { IUseManualConsumeModelRes } from './types';

interface IGetFilterConfigParams {}
type GetFilterConfigType = (
  params: IGetFilterConfigParams,
) => IUseManualConsumeModelRes['filterConfig'];
export const getFilterConfig: GetFilterConfigType = (_params) => {
  return [
    {
      name: 'lessonTime',
      label: '上课时间：',
      type: 'DateRangePicker',
    },
  ];
};
