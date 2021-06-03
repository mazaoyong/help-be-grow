import { polyvCheck } from '../action-menu/api';

/* 检查保利威直播授权情况以及直播总量是否超限 */
export function checkPolyvAuth() {
  return polyvCheck()
    .then(data => {
      // 通过code码判断是否校验通过，或者区分不通过的原因
      if (data.checked) {
        return true;
      } else {
        return Promise.reject(data.failCode);
      }
    });
};
