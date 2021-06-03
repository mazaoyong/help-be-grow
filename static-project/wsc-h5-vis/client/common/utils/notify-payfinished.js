import { action as ZanJSBridgeAction } from '@youzan/zan-jsbridge';
import Args from '@youzan/utils/url/args';
import { ajax } from '@youzan/vis-ui';

export default function notifyPayfinished(orderNo, payWay, orderType = 0) {
  if (!orderNo || !payWay) return;

  ZanJSBridgeAction.doAction({
    action: 'paymentFinished',
    tid: orderNo,
    status: 1, // 支付成功
    type: orderType,
    pay_type: getPayType(payWay),
  });
}

function getPayType(payWay) {
  let payType = 0;
  switch (payWay) {
    case 1:
    case 10:
    case 11:
    case 13:
    case 19: // 微信支付
    case 29:
    case 72: // 微信扫码支付
    case 101: // 微信扫码支付
    case 102: // 微信支付
    case 109: // 微信条码支付
      payType = 1; // 微信支付
      break;
    case 2:
    case 3:
    case 30: // 支付宝支付
    case 103: // 支付宝付款
    case 108: // 支付宝条码支付
      payType = 2; // 支付宝支付
      break;
    case 4: // 银行卡支付
    case 6: // 银行卡支付
    case 8: // 银行卡付款－联动U付
    case 12: // 百付宝
    case 23: // 银行卡支付
      payType = 3; // 储蓄卡支付
      break;
    case 24:
      payType = 4; // 信用卡支付
      break;
    case 25: // 会员余额
    case 28: // E卡
    case 33: // 礼品卡
    case 35: // 储值卡
    case 80: // 余额支付
    case 90: // 礼品卡
    case 106: // 储值卡
    case 107: // 有赞E卡
      payType = 5; // 储值支付（E卡，礼品卡，储值卡等）
      break;
    case 7:
      payType = 6; // 找人代付
      break;
  }

  return payType;
}

export function notifyAfterGotPaystate() {
  const orderNo = Args.get('order_no') || Args.get('orderNo');
  const isFromPay = Args.get('isFromPay');
  if (!orderNo || !isFromPay) return;

  getPayStateInfo({ orderNo })
    .then((data) => {
      if (data.payStatus === 20) {
        notifyPayfinished(orderNo, data.payWay, data.orderType);
      }
    })
    .catch(err => {
      console.error(err);
    });
}

export function getPayStateInfo(data) {
  return ajax({
    url: '/wscvis/order/getPayStateInfo.json',
    data,
    loading: false,
  });
};
