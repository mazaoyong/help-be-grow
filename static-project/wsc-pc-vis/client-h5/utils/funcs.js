import { get } from 'lodash';
import Args from 'zan-utils/url/args';

/**
 * 获取kdtId，校区总部请取数据所属的kdtId
 * @param {object} obj 参数
 * @param {object} obj.data 数据对象
 * @param {string} obj.path 获取 data 内 kdtId 的键路径
 * @param {boolean} obj.fromUrl 是否从当前页面url获取kdtId
 * @param {string} obj.urlParamKey kdtId在url中所属键名
 *
 */

export function getKdtId({ fromUrl = false, urlParamKey = 'kdtId', data, path = 'kdtId' }) {
  const currentKdtId = _global.kdtId || _global.kdt_id;
  if (fromUrl) {
    return Args.get(urlParamKey) || currentKdtId;
  }
  if (data && path) {
    return get(data, path, currentKdtId);
  };
  return currentKdtId;
}
