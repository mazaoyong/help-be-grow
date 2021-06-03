import omit from 'lodash/omit';
import isArray from 'lodash/isArray';

// 微页面知识付费组件过滤字段
export const OMIT_KEYS = ['content', 'preview', 'qrcode', 'popularize_code'];

/**
 * 过滤pct对象列表中的字段
 * @param {Array} list pct对象列表
 * @return {Array} 过滤完的对象数组
 */
export function filterOmitKeys(list) {
  try {
    if (!isArray(list)) return list;
    return list.map(item => {
      return omit(item, OMIT_KEYS);
    });
  } catch (error) {
    return list;
  }
}
