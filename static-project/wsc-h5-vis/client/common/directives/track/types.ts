import { IGlobalTrackerSetting, IStandardTackData } from './utils/zan-tracker-types';

export enum Timings {
  /** 进入页面 */
  EnterPage = 0b00000001,
  /** 离开页面 */
  LeavePage = 0b00000010,
  /** 循环 */
  Circulation = 0b00000100,
  /** 交互 */
  Interaction = 0b00001000,
  /** 节点曝光 */
  ViewDisplay = 0b00010000,
  /** 数据变更触发 */
  ChangeByData = 0b00100000,
}

type DataGetterRes = Record<string, any> | 'TERMINATE';
type DataGetter = (store: Record<string, any>) => DataGetterRes;
type shouldInvokeFunc = (prevStore: Record<string, any>, store: Record<string, any>) => boolean;
export interface IBaseConfig {
  name: string;
  /** 事件标识 ei */
  eventId: string;
  /** 事件名称 en */
  eventName: string;
  /** 页面类型 对应pt参数 */
  pageType?: string;
  /** 事件类型 */
  eventType?: IStandardTackData['et'];
  /** params中的值，可以是静态的值或者是通过页面中调用collect函数收集的值 */
  data?: Record<string, any> | DataGetter;
  /** 是否开启log，开启之后会将参数上报给天网 */
  enableLog?: boolean;
}
export interface IEnterPageConfig extends IBaseConfig {
  timing: Timings.EnterPage;
  /** 设置来源字段的key，默认值为eduOrigin */
  originKey?: string;
  /** 是否通过解析url中的来源信息 */
  withOrigin?: boolean;
}
export interface ILeavePageConfig extends IBaseConfig {
  timing: Timings.LeavePage;
}
export interface ICirculationConfig extends IBaseConfig {
  timing: Timings.Circulation;
  /** 最大触发次数 */
  maxTimes?: number;
  /** 时间间隔，时间间隔要大于5s */
  interval: number;
  /** 页面加载就执行 */
  runOnEnterPage?: boolean;
  /** 在离开页面的时候执行事件 */
  runOnLeavePage?: boolean;
}
export interface IInteractionConfig extends IBaseConfig {
  timing: Timings.Interaction;
  /** 最大触发次数 */
  maxTimes?: number;
}
export interface IIntersectionObserverEntry {
  readonly element: HTMLElement;
  /** 内容展示占内容的比例 */
  readonly contentDisplayRatio: number;
  readonly intersectionRatio: number;
  readonly isIntersection: boolean;
  readonly intersectionRect: DOMRect;
  readonly boundingClientRect: () => DOMRect;
}
type ViewDisplayDataGetter = (
  store: Record<string, any>,
  intersectionEntries?: IIntersectionObserverEntry[],
) => DataGetterRes;
export interface IViewDisplayConfig extends IBaseConfig {
  timing: Timings.ViewDisplay;
  /**
   * @description 元素曝光事件会的回调函数的第二个参数为元素曝光的相关信息，
   * 具体可以参考intersectionObserverEntry对象
   * @see https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry
   */
  data?: Record<string, any> | ViewDisplayDataGetter;
}
export interface IChangeByDataConfig extends IBaseConfig {
  timing: Timings.ChangeByData;
  /** 是否能够触发埋点请求，支持传入函数自行判断是否能够触发；或者是传入一个或多个key，通过判断key是否改变决定是否触发更新 */
  deps?: string | string[] | shouldInvokeFunc;
  /** 最大触发次数 */
  maxTimes?: number;
}
export type IConfig =
  | IEnterPageConfig
  | ILeavePageConfig
  | IInteractionConfig
  | ICirculationConfig
  | IChangeByDataConfig
  | IViewDisplayConfig;

export type DirectiveMap = 'click' | 'view';

export interface ITrackSetting {
  /**
   * 埋点客户端，在新版本中，移除了普及度不高的zan-web-tracker改用
   * log-client中去了
   */
  logClient: any;
  logClientSetting?: IGlobalTrackerSetting;
  configs: IConfig[];
  /** 是否需要附上时间戳 */
  attachTimestamp?: boolean;
  /** 全局的pageType */
  globalPageType?: string;
  /** 离开页面的请求前缀 */
  leavePagePrefix?: string;
}
