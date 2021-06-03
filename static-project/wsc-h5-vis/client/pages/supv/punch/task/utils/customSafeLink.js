/**
 * @file
 * 在这里对@youzan/safe-link做了一层封装
 * 支持以下功能
 * 1. 对url预进行buildUrl处理!!!
 * 2. 自动填充kdtId(_global.kdt_id)
 * 3. 添加新参数query，query默认带kdt_id
 */

import * as SafeLink from '@youzan/safe-link';
import Args from '@youzan/utils/url/args';
import buildUrl from '@youzan/utils/url/buildUrl';

const formatLinkParams = params => {
  const kdtId = params.kdtId || _global.kdt_id;

  params.url = buildUrl(params.url, 'h5', kdtId);
  params.kdtId = kdtId;

  if (!params.query) {
    params.query = {};
  }
  // 过滤query中值为undefined或null的值，原因是
  // Agrs.add('youzan.com', { a: undefined })
  // => 'youzan.com?a=undefined'
  const query = Object.keys(params.query).reduce((query, key) => {
    const value = params.query[key];
    if (value !== undefined && value !== null) {
      query[key] = value;
    }
    return query;
  }, {});
  query.kdt_id = kdtId;
  params.url = Args.add(params.url, query);

  return params;
};

/**
 * 获取 safeUrl
 *
 * @param {Object} params - 入参
 * @param {string} params.url - 原始 url
 * @param {Object} [params.query] - 原始 query，会自动添加到 url 上
 * @param {string|number} [params.kdtId] - kdtId，不填会默认补全_global.kdt_id
 * @param {Object} [params.extraQuery] - 透传，作为 rd.youzan.com 的 query params
 * @return {string}
 */
export const getSafeUrl = params =>
  SafeLink.getSafeUrl(formatLinkParams(params));

/**
 * 手动执行页面跳转
 *
 * @param {Object} params - 入参
 * @param {string} params.url - 原始 url
 * @param {Object} [params.query] - 原始 query，会自动添加到 url 上
 * @param {string|number} [params.kdtId] - kdtId，不填会默认补全_global.kdt_id
 * @param {'replace'} [params.redirectType] - 传入 'replace' 会进行重定向跳转，不传默认使用 location.href
 * @param {string} [params.openType] - 同 window.open() name 属性值，如 '_blank' 传送门
 * @param {Object} [params.extraQuery] - 透传，作为 rd.youzan.com 的 query params
 * @return {undefined}
 */
export const redirect = params => SafeLink.redirect(formatLinkParams(params));
