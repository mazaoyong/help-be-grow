interface IVisitTrackerParams extends Partial<IBaseTrackerParams> {
  pageType: string;
}
// eslint-disable-next-line jsdoc/require-param
/** 进入页面埋点的快捷方法，指定了一些默认参数，方便快速添加页面浏览埋点 */
export const visitTracker = (params: IVisitTrackerParams) => {
  const passiveParams: IBaseTrackerParams = {
    ...params,
    eventType: 'display',
    eventSign: 'enterpage',
    eventName: params.eventName || '浏览页面',
  };
  baseLogger(passiveParams);
};

interface IClickTrackerParams extends Partial<IBaseTrackerParams> {
  eventSign: string;
  pageType: string;
}
// eslint-disable-next-line jsdoc/require-param
/** 点击事件快速埋点，同样指定了一些参数 */
export const clickTracker = (params: IClickTrackerParams) => {
  const passiveParams: IBaseTrackerParams = {
    ...params,
    eventType: 'click',
    eventName: params.eventName || '通用点击事件',
  };
  baseLogger(passiveParams);
};

export enum EventTypeEnum {
  EDIT = 'edit',
  DELETE = 'delete',
  ADD = 'add',
  PROMOTE = 'promote',
  DOWNLOAD = 'download',
  SHARE = 'share',
  COPY = 'copy',
}
interface IExplosureTrackerParams extends Partial<IBaseTrackerParams> {
  eventSign: string;
  pageType: string;
}
// eslint-disable-next-line jsdoc/require-param
/** 曝光事件快速埋点，同样指定了一些参数 */
export const explosureTracker = (params: IExplosureTrackerParams) => {
  const passiveParams: IBaseTrackerParams = {
    ...params,
    eventType: 'view',
    eventName: params.eventName || '通用曝光事件',
  };
  baseLogger(passiveParams);
};

interface IBaseTrackerParams {
  /** 事件类型 */
  eventType: 'display' | 'click' | 'view';
  /** 点击事件标识 */
  eventSign: string;
  /** 事件名称，默认为浏览页面 */
  eventName: string;
  /**
   * @description 页面类型，一般是[神策系统](http://track.qima-inc.com)设置的页面标识
   * @see http://track.qima-inc.com/
   * @example http://track.qima-inc.com/projects/448 liveList 表示直播列表页
   */
  pageType: string;
  /** 事件额外参数 */
  otherParams?: { eventType?: EventTypeEnum } & Record<string, any>;
}
function baseLogger(params: IBaseTrackerParams) {
  window.Logger &&
    window.Logger.log({
      et: params.eventType,
      ei: params.eventSign,
      en: params.eventName,
      pt: params.pageType,
      params: {
        operator_source: 'wsc-pc-vis',
        ...(params.otherParams || {}),
      },
    });
}
