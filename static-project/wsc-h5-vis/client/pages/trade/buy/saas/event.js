import { SyncEvent, AsyncEvent, getBridge } from '@youzan/youzanyun-bridge';

// 异步事件
const beforeCreateOrderEvent = new AsyncEvent();
// 同步事件
const afterCreateOrderEvent = new SyncEvent();
// 异步事件
const afterCreateOrderEventAsync = new AsyncEvent();
// 异步事件
const onPayItemClickEvent = new AsyncEvent();

export default function injectEvents() {
  const bridge = getBridge();

  bridge.setEvent('beforeCreateOrderAsync', beforeCreateOrderEvent);
  bridge.setEvent('afterCreateOrder', afterCreateOrderEvent);
  bridge.setEvent('afterCreateOrderAsync', afterCreateOrderEventAsync);
  bridge.setEvent('onPayItemClickAsync', onPayItemClickEvent);
}

export {
  beforeCreateOrderEvent,
  afterCreateOrderEvent,
  afterCreateOrderEventAsync,
  onPayItemClickEvent,
};
