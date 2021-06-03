import { IListProps } from '@youzan/ebiz-components/es/types/easy-list';

export interface IDetailStatistics {
  finishCourseCount: number; // 完成课程数
  learnProgress: number; // 学习进度
  learnDuration: number // 学习时长
  learnNumber: number; // 学习次数
};

export interface IStudyDetailListProps {
  onFetch: IListProps['onSubmit'];
};

export interface IStudyDetailPageProps {
  courseAlias: string;
  courseId: number;
  userId: number;
  userName: string;
};
