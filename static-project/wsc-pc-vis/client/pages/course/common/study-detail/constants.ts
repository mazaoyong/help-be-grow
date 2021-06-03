import { IDetailStatistics } from './types';

type TDetailStatisticsKeys = keyof IDetailStatistics;
export const STUDY_DETAIL_INDEX: { [key in TDetailStatisticsKeys]: string} = {
  learnNumber: '学习次数',
  learnDuration: '学习时长(分钟)',
  finishCourseCount: '完成课程数',
  learnProgress: '学习进度',
};
