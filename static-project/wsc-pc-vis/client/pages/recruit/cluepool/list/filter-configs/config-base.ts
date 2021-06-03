import { ICombinedFilterConf, IOption } from '@youzan/ebiz-components/es/types/easy-list';
import TimeRangePicker from 'components/time-range-picker';

import filterArray from '../utils/filter-array';
import SourceFilter from '../../components/source-filter';
import TagsFilter from '../../components/tags-filter';

type BaseFilterConfigNames = 'name' | 'telephone' | 'sourceId' | 'tags';
export const filterBaseConfigs: Record<BaseFilterConfigNames, ICombinedFilterConf> = {
  name: {
    type: 'Input',
    name: 'name',
    label: '姓名：',
    inheritProps: {
      width: '200px',
      placeholder: '请输入姓名',
    },
  },
  telephone: {
    type: 'Input',
    name: 'telephone',
    label: '手机号：',
    inheritProps: {
      width: '200px',
      placeholder: '请输入手机号码',
    },
  },
  sourceId: {
    type: 'Custom',
    name: 'sourceId',
    label: '来源：',
    renderField: SourceFilter,
  },
  tags: {
    type: 'Custom',
    name: 'tags',
    label: '标签：',
    renderField: TagsFilter,
  },
};

// 线索列表筛选项中的时间筛选条件拆分为3个
export const clueDatePickerFilterGroup = [
  { value: 'recordDateRange', text: '更新动态时间' },
  { value: 'createAtDateRange', text: '创建时间' },
  { value: 'revisitDateRange', text: '回访时间' },
].map((item): ICombinedFilterConf[] => [
  {
    name: item.value,
    label: `${item.text}：`,
    type: 'Custom',
    renderField: TimeRangePicker,
  },
]);

export interface IGetFilterConfigParams {
  staff: IOption<string>[];
  campusList: IOption<number>[];
  setSelectCampus(value: number): void;
}

// tabs
export const allPhaseOptions = filterArray([
  {
    value: 0,
    text: '全部',
  },
  {
    value: 2,
    text: '待跟进',
  },
  {
    value: 3,
    text: '待邀约',
  },
  {
    value: 4,
    text: '待试听',
    eduOnly: true,
  },
  {
    value: 5,
    text: '已试听',
    eduOnly: true,
  },
  {
    value: 6,
    text: '已成交',
  },
]);

export const poolPhaseOptions = [
  {
    value: 0,
    text: '全部',
  },
  {
    value: 1,
    text: '待分配',
  },
  {
    value: 7,
    text: '已放弃',
  },
];

export const minePhaseOptions = filterArray([
  {
    value: 0,
    text: '全部',
  },
  {
    value: 2,
    text: '待跟进',
  },
  {
    value: 3,
    text: '待邀约',
  },
  {
    value: 4,
    text: '待试听',
    eduOnly: true,
  },
  {
    value: 5,
    text: '已试听',
    eduOnly: true,
  },
  {
    value: 6,
    text: '已成交',
  },
]);
