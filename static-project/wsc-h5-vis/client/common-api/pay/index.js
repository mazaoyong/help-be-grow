import { ajax } from '@youzan/vis-ui';

// 获取分销员零钱是否升级
export function getSalemanUpgradeResult() {
  return ajax({
    url: '/wscvis/pay/getSalemanUpgradeResult.json',
  });
};
