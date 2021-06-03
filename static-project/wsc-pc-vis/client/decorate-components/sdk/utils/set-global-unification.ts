import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';

/**
 * 给global添加mp_data等v2的数据
 */
export function setGlobalUnification() {
  const globalConfigOrigin = window._global || {};
  const globalConfig: any = cloneDeep(globalConfigOrigin);

  globalConfig.mp_data = {
    logo: get(globalConfigOrigin, 'shopInfo.logo', ''),
    team_name: get(globalConfigOrigin, 'shopInfo.shopName', ''),
  };

  return globalConfig;
}
