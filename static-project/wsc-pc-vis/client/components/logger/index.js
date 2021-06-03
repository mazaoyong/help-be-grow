import { visitTracker, clickTracker, EventTypeEnum } from 'fns/web-tracker';

export const loggerCustomer = (eventId, eventName) => {
  window.Logger &&
    window.Logger.log({
      et: 'custom', // 事件类型
      ei: eventId, // 事件标识
      en: eventName, // 事件名称
      params: {
        operator_source: 'wsc-pc-vis',
      }, // 事件参数
    });
};

export { visitTracker, clickTracker, EventTypeEnum };
