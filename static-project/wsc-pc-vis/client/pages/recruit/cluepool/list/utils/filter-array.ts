import { isEduShop } from '@youzan/utils-shop';
import _omit from 'lodash/omit';

/**
 * @description 对于一个数组，过滤除当前店铺类型需要的数据，用于线索管理插件根据教育店铺和非教育店铺过滤线索阶段
 * @param {Array} data 原始数组
 * @return {Array} 当前店铺类型需要的数据
 * @example
 * const originList = [
 *  {
 *   name: 1,
 * },
 * {
 *   name: 2,
 *   eduOnly: true
 * }
 * ]
 * const finalList = filterArray(originList); // -> [{name: 1}]
 */
export default function filterArray(data) {
  return data.filter((item) => isEduShop || !item.eduOnly).map((item) => _omit(item, 'eduOnly'));
}
