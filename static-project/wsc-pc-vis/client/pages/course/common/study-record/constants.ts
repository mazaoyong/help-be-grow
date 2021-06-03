/**
 * 模块所有常量定义,可选文件
 */
import { IStatistics } from './types';

type TStatisticsKeys = keyof Omit<IStatistics, 'totalLearnDuration'>;
export const STUDY_INDEX: { [key in TStatisticsKeys]: string} = {
  applyCount: '报名人数',
  learnCount: '学习人数',
  avgLearnDuration: '人均学习时长(分钟)',
  finishedLessonCount: '完课人数',
  finishLessonRate: '完课率',
};

type TTrendKeys = keyof Omit<IStatistics, 'totalLearnDuration' | 'finishedLessonCount' | 'finishLessonRate'>;
export const TREND_INDEX: { [key in TTrendKeys]: any} = {
  applyCount: {
    legend: '报名人数',
    yAxisIndex: 0
  },
  learnCount: {
    legend: '学习人数',
    yAxisIndex: 0,
  },
  avgLearnDuration: {
    legend: '人均学习时长(分钟)',
    yAxisIndex: 1,
  }
};
