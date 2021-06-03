import { getBridge } from '@youzan/youzanyun-bridge';

export default function(store, router, vm, billManage) {
  const bridge = getBridge();
  // 注册下单方法
  bridge.setProcess(
    'createOrder',
    billManage.submitOrder.bind(billManage),
  );

  // 注册支付方法
  bridge.setProcess(
    'startPay',
    billManage.startPay.bind(billManage),
  );
};
