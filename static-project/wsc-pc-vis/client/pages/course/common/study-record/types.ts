import { IListProps } from '@youzan/ebiz-components/es/types/easy-list';

export interface IStatistics {
  avgLearnDuration: number; // 人均学习时长(分钟)
  applyCount: number; // 报名人数
  finishLessonRate: number; // 完课率%
  finishedLessonCount: number; // 完课人数
  totalLearnDuration: number // 总学习时长
  learnCount: number; // 学习人数
};

export interface IChartData {
  name: string;
  data: number[];
}

export type TChartDataLines = IChartData[];

export interface IChartRawData {
  [index: string]: Partial<IStatistics>
}

export interface IChartFilterProps {
  onDateChange: (dateRange: any[]) => void;
  value: [Date, Date];
}

export interface IStudyListProps {
  onFetch: IListProps['onSubmit'];
  onExport: () => void;
  selectFetchOption: Function;
  onSelect: (value: any) => void;
  onReset: () => void;
  courseId: number;
  courseType: number
}

export interface IStudyRecordPageProps {
  courseType: number;
  courseId: number;
}
