/* eslint-disable no-fallthrough */
import { IConfig, Timings } from '../types';
import { get } from 'lodash';
import { ZanTrackerInstance, IStandardTackData } from '../utils/zan-tracker-types';

export interface IInvokePayload {
  event?: Event;
  params: Record<string, any> | 'TERMINATE';
}

interface ILegalInvokePayload extends IInvokePayload {
  params: Record<string, any>;
}

export default function invokeLog(
  logClient: ZanTrackerInstance,
  config: IConfig,
  defaultConfig: IConfig,
  payload: IInvokePayload,
) {
  // 中断事件
  if (payload.params === 'TERMINATE') return;
  // 最后兜底
  logClient = logClient || get(window, 'yzlogInstance', {});
  const { timing, eventType: passiveEventType, eventId, eventName, pageType, enableLog = false } = config;
  const getParamsWithET = getParams(
    eventId,
    eventName,
    pageType || defaultConfig.pageType,
    payload as ILegalInvokePayload,
  );
  let eventType: IStandardTackData['et'] = passiveEventType || 'custom';
  let logType: keyof ZanTrackerInstance = 'log';

  switch (timing) {
    case Timings.EnterPage:
      eventType = 'display';
      break;
    case Timings.ViewDisplay:
      eventType = 'view';
      break;
    case Timings.Interaction:
      if (!passiveEventType) {
        eventType = 'click';
      }
      break;
    case Timings.ChangeByData:
    case Timings.Circulation:
    default:
      break;
  }

  const [params, event] = getParamsWithET(eventType);
  if (enableLog) {
    const userInfo = logClient.getData().user;
    const addonMsg = `[TRACK]${userInfo ? userInfo.yz_uid : ''} ${config.eventId} ${config.eventName}`;
    window.yzStackLog &&
      window.yzStackLog.log({
        name: 'track-logger',
        message: addonMsg,
        level: 'info',
        extra: params,
      });
  }
  // client-log客户端仅支持直接传入埋点的events
  logClient[logType](params.event, event);
}

export function getParamsFromConfig(config: IConfig, payload: any) {
  return getParams(config.eventId, config.eventName, config.pageType, payload);
}

export function getParams(eventId: any, eventName: any, pageType: any, payload: ILegalInvokePayload) {
  const { params, event: domEvent } = payload;
  if (_global.kdt_id && params.kdt_id === undefined) {
    params.kdt_id = _global.kdt_id;
  }
  return (eventType: IStandardTackData['et']): [Record<string, any>, Event | undefined] => [
    {
      event: {
        et: eventType,
        ei: eventId,
        en: eventName,
        pt: pageType,
        params,
      },
    },
    domEvent,
  ];
}
