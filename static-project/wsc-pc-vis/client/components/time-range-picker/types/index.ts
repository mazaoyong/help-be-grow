export enum SelectTypeEnum {
  DAY,
  WEEK,
  MONTH,
  CUSTOM,
}

export type SelectedTimeType = [number[], number | undefined];

/** [[[开始时间， 结束时间], 快捷选择], 筛选类型] */
export type ValueType = [SelectedTimeType, SelectTypeEnum];
