export interface ILiveManageEntryQuery {
  alias: string;
  title: string;
}

// header
export interface ILiveManageHeaderProps {
  title: string;
  onTabsChange;
}

export enum LiveManageHeaderTabs {
  SUMMARY = 1001,
  RECORD_MANAGE,
  ROLE_MANAGE,
  LIVE_ROOM_SETTING,
  REWARD_SETTING,
  LIVE_SELLING,
  LOTTO_RECORD,
}

// record manage
export interface ILiveManageRecordManage {
  alias: string;
  name: string;
}

export enum FoundationAvailable {
  DISABLED = 0,
  AVAILABLE,
}

export type DateType = string | number | Date;

export type alignType = 'left' | 'right' | 'center';

export interface ILiveSummary extends Record<string, any> {
  watchCount: number | string; // 观看/学习人数
  watchTimes: number | string; // 观看/学习次数
  averageWatchTimes: string; // 人均观看/学习次数（保留两位有效数字）
  watchDuration: string; // 观看/学习时长（单位：分钟；保留两位有效数字）
  averageWatchDuration: string; // 人均学习时长（单位：分钟；保留两位有效数字）
}
