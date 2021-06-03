import { getBridge, bridgeReady } from '@youzan/youzanyun-bridge';
import injectEvents from './event';
import { openState } from './state';
import injectProcess from './process';
import BillManage from '../biz-service/bill-manage';

let billManage = null;

export const getBillManage = () => billManage;

export default function(store, router, vm) {
  billManage = new BillManage(store, router, vm);
  const bridge = getBridge();

  // 注册页面方法
  injectProcess(store, router, vm, billManage);

  // 注册需要开放的数据
  bridge.setPageDataContext(vm, openState);

  // 注册事件
  injectEvents();

  bridgeReady();
}

export {
  beforeCreateOrderEvent,
  afterCreateOrderEvent,
  afterCreateOrderEventAsync,
  onPayItemClickEvent,
} from './event';
