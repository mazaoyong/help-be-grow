import type { IUseRecordsDetailModelRes } from './types';

export const getCollapseConfig = (): IUseRecordsDetailModelRes['collapseConfig'] => {
  return [
    [
      {
        name: 'lessonTime',
        label: '上课时间：',
        type: 'DateRangePicker',
      },
    ],
    [
      {
        name: 'signinTime',
        label: '签到时间：',
        type: 'DateRangePicker',
      },
    ],
  ];
};
