import { SelectTypeEnum } from './types';

export const SELECT_OPTIONS: {
  text: string;
  value: SelectTypeEnum;
}[] = [
  {
    text: '自然日',
    value: SelectTypeEnum.DAY,
  },
  {
    text: '自然周',
    value: SelectTypeEnum.WEEK,
  },
  {
    text: '自然月',
    value: SelectTypeEnum.MONTH,
  },
  {
    text: '自定义',
    value: SelectTypeEnum.CUSTOM,
  },
];

export const PRESET: any = [
  {
    text: '今',
    value: 0,
  },
  {
    text: '昨',
    value: 1,
  },
  {
    text: '近7天',
    value: 7,
  },
  {
    text: '近30天',
    value: 30,
  },
];
