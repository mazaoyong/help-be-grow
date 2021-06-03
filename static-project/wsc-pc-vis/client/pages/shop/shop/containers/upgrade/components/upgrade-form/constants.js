import { versionMap } from '../../constants';
/**
 * 生成yop需要的数据
 * @param {number} version 有赞教育订购版本
 * @param {number} period 有赞教育订购时间
 * @param {number} wscPkgPeriod 微商城扩展包订购时间
 */
export function genYopData(version, period, wscPkgPeriod) {
  const items = [];
  const versionIdMap = {
    [versionMap.BASIC]: 74217,
    [versionMap.PREMIUN]: 74219,
  };
  // 7252 有赞教育
  if (period && Object.keys(versionIdMap).includes(`${version}`)) items.push({ itemId: versionIdMap[version], quantity: period, preferentialIds: [] });
  // 7251 微商城扩展包
  if (wscPkgPeriod) items.push({ itemId: 7251, quantity: wscPkgPeriod });
  return { items };
}
