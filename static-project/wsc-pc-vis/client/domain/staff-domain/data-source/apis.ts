import { visAjax } from 'fns/new-ajax';

/**
 * 获取单店员工列表
 * @param {string} keyword
 * @param {number} pageNo
 * @param {number} pageSize
 */

export function getSingleShopStaffList(payload: {
  keyword: string;
  pageNo: number;
  pageSize?: number;
}) {
  return visAjax('GET', '/common/staff/getSingleShopStaffList.json', payload, { cleanEmptyString: true });
}

/**
 * 获取连锁店铺员工列表
 * @param {string} keyword
 * @param {number} pageNo
 * @param {number} pageSize
 * @param {number} targetKdtId
 */

export function getChainStaffList(payload: {
  keyword: string;
  pageNo: number;
  targetKdtId: number;
  pageSize?: number;
}) {
  return visAjax('GET', '/common/staff/getChainStaffList.json', payload, { cleanEmptyString: true });
}
