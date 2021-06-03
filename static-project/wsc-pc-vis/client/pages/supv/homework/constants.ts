import { ITabsConfig } from '@youzan/ebiz-components/es/types/easy-list/types/filter';
import { HomeworkViewType } from './types';

export const tabs: ITabsConfig[] = [
  {
    value: HomeworkViewType.ALL,
    label: '全部',
  },
  {
    value: HomeworkViewType.UNMARKED,
    label: '未批阅',
  },
  {
    value: HomeworkViewType.MARKED,
    label: '已批阅',
  },
];

export const APPID = 445251;

export const AbilityCode = 'exercise_book_ability';

export const AppName = '作业本';
