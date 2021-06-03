import { visAjax } from 'fns/new-ajax';
export default {
  // 获取退课记录列表
  getRefundRecordList(data) {
    return visAjax('GET', '/edu/page/refund/list.json', data);
  },

  // 获取校区的员工列表
  getChainShopStaffList(data) {
    return visAjax('GET', '/edu/page/refund/getStaffList.json', data);
  },

  // 获取单店员工列表
  getSingleShopStaffList(data) {
    return visAjax('GET', '/edu/page/refund/getSingleShopStaffList.json', data);
  },

  // 获取二维码
  getQrCode({ url, width, height }) {
    return visAjax('GET', '/pct/biz/getWscQrcode.json', { url, width, height });
  },

  // 获取单个退课记录
  getRefundRecordByRefundNo({ refundNo }) {
    return visAjax('GET', '/edu/page/refund/getRefundRecordByRefundNo.json', { refundNo });
  },

  // 获取单个退课记录
  getRefundRecordByQuery(query) {
    return visAjax('GET', '/edu/page/refund/getRefundRecordByQuery.json', { query });
  },
};
