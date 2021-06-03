import {
  getSingleShopStaffList,
  getChainStaffList,
} from '../data-source/apis';

const service = {
  /**
   * 查询单店员工
   * @param {string} keyword
   * @param {number} pageNo
   * @param {number} pageSize
   */

  fetchSingleShopStaffList(payload: { pageNo: number; keyword: string; pageSize?: number }) {
    return getSingleShopStaffList(payload);
  },

  /**
   * 查询连锁员工
   * @param {string} keyword
   * @param {number} pageNo
   * @param {number} pageSize
   * @param {number} targetKdtId
   */

  fetchChainStaffList(payload: { pageNo: number; keyword: string; targetKdtId: number; pageSize?: number }) {
    return getChainStaffList(payload);
  },
};

export default service;
