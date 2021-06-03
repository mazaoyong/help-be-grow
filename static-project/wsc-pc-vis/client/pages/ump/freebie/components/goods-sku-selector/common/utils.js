import { SKU_PREFIX } from './constants';

/**
 * 获取 SKU 名称
 *
 * @param {Object} skuInfo
 */

export const getSkuName = skuInfo => {
  return Object.keys(skuInfo)
    .filter(key => key.indexOf(SKU_PREFIX) > -1)
    .map(key => skuInfo[key])
    .join('，');
};
