import clone from 'lodash/clone';
// cimport { SCHEMA_MAP } from './fieldConfig';
import appCache from './app-cache';

function parseOldSkuOut(data) {
  if (!data.sku) return;
  [1, 2, 3, 4, 5].forEach(index => {
    data[`skuName${index}`] = undefined;
    data[`skuName${index}Value`] = undefined;
  });
  data.sku.forEach((item, index) => {
    let { leaf, ...rest } = item;
    index++;
    if (!leaf) return;
    data[`skuName${index}`] = rest;
    data[`skuName_${index}Value`] = leaf;
  });
}

// 对输出数据进行处理
// 注意：Step2 的 Form onChange 也会执行到这里
export default function parseFormValues(data) {
  data = clone(data);

  /* Object.keys(SCHEMA_MAP).forEach(mixName => {
    SCHEMA_MAP[mixName].forEach(name => {
      if (data[mixName] && typeof data[mixName][name] !== 'undefined' && data[mixName][name] !== null) {
        data[name] = data[mixName][name];
      }
    });
    delete data[mixName];
  }); */

  // 切换会员折扣勾选
  if (appCache.get('toggleLevelDiscount')) {
    data.joinLevelDiscount = 0;
    appCache.set({
      toggleLevelDiscount: false,
    });
  }

  parseOldSkuOut(data);
  return data;
}
