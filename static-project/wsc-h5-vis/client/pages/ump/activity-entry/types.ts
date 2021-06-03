
export interface IActivityEntryConfig {
  /** 显示在列表页的图标 */
  icon: string;
  /** 显示在列表页的名称 */
  name: string;
  /** 显示在列表页的描述 */
  desc: string;
  /** 路由的路径 */
  path: string;
  /** 请求活动时传递给后端的Type */
  type?: ActivityType;
  /** 路由的路径 */
  direct?: boolean;
  /** 跳转函数 */
  navigate(type?: IActivityInfo): void;
  /** 是否隐藏（多设置为店铺条件） */
  hidden?: boolean;
}

export enum ActivityType {
  INTRODUCTION = 'invite_reward',
  TUITION = 'tuition'
}

export interface IActivityInfo {
  /** 活动 id */
  activityId: number;
  /** 活动 alias */
  alias: string;
  /** 活动结束时间 */
  endAt: number;
  /** 活动名称 */
  name: string;
  /** 活动开始时间 */
  startAt: number;
  /** 活动状态描述 */
  status: string;
  /** 活动类型 */
  type: ActivityType;

}
