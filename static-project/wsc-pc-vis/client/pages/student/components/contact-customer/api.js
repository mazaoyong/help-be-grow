import ajax from 'zan-pc-ajax';

export default {
  /**
   * 获取客户的联系通道
   */
  getCommunication(data) {
    return ajax({
      url: '/v4/scrm/customer/manage/getCommunication.json',
      data,
    });
  },
};
