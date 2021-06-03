export interface ZanTracker {
  initGlobalTracker(config: IGlobalTrackerSetting): ZanTrackerInstance;
  getGlobalTracker(): ZanTrackerInstance;
}

export declare class ZanTrackerInstance {
  // set global ctx
  public setUser(params: ISetUserParams): void;
  public setPlat(params: ISetPlatParams): void;
  public setEnv(params: ISetEnvParams): void;
  public setEvent(params: ISetEventParams): void;
  public setContext(params: ISetContextParams): void;

  // methods
  public enterpage(params: ITrackDataCollection, e?: Event): void;
  public click(params: ITrackDataCollection, e?: Event): void;
  public log(params: ITrackDataCollection, e?: Event): void;
  public view(params: ITrackDataCollection, e?: Event): void;

  // utils
  public getData(): ITrackDataCollection;
  public getBannerId(params: IGetBannerIdParams): string;
  public getShareParams(): Record<string, any>;
  public trackNodeView(state: boolean): void;
}

/**
 * @see http://fedoc.qima-inc.com/zan-web-tracker/docs/setUser.html
 */
type Cycle = 'instance' | 'page';
export interface IStandardTackData {
  /** event type */
  et: 'click' | 'display' | 'view' | 'custom';
  /** event sign */
  ei: string;
  /** event name */
  en: string;
  /** 页面类型 page type */
  pt: string;
  params: Record<string, any>;
}
interface IBaseParams {
  data?: Record<string, any>;
  cycle?: Cycle;
}
interface ISetUserParams extends IBaseParams {}
interface ISetPlatParams extends IBaseParams {}
interface ISetEnvParams extends IBaseParams {}
interface ISetEventParams extends IBaseParams {
  data: IStandardTackData;
}
interface ISetContextParams extends Omit<IBaseParams, 'cycle'> {
  days: number;
}

export interface ITrackDataCollection {
  plat?: Record<string, any>; // 业务环境
  user?: Record<string, any>; // 用户信息
  context?: Record<string, any>; // 上下文
  event?: IStandardTackData; // 事件
  env?: Record<string, any>; // 运行环境
}

interface IGetBannerIdParams {
  pageType: string | number; // 否 页面类型
  pageId: string | number; // 否 页面 ID
  blockId: string | number; // 否 区块 ID
  itemIndex: string | number; // 否 item 在 block 中的位置（序号）
}

export interface IAutoConfigures {
  autoSpm?: boolean;
  autoClick?: boolean;
  autoView?: boolean;
  autoEnterpage?: boolean;
}

// 使用log-client可以支持的属性
export interface IGlobalTrackerSetting extends IAutoConfigures {
  yai?: string;
  debug?: boolean;
}
