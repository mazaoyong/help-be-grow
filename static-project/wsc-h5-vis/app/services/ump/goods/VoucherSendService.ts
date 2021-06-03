import BaseService from '../../base/BaseService';

/* com.youzan.ump.voucher.core.api.service.voucher.VoucherSendService -  */
class VoucherSendService extends BaseService {
  public readonly SERVICE_NAME =
    'com.youzan.ump.voucher.front.api.service.voucher.VoucherSendService';

  /**
   *  发放优惠凭证
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/397718
   *
   *  @param {Object} request - 发放请求
   *  @param {number} request.activityId - 活动id
   *  @param {number} request.fansId - 粉丝id
   *  @param {number} request.kdtId - 店铺kdtId
   *  @param {string} request.bizName - 业务名称
   *  @param {string} request.requestId - 请求id
   *  @param {string} request.source - 来源
   *  @param {number} request.userId - 用户id
   *  @param {number} request.assignValue - 指定面额，单位：分
   *  @param {number} request.fansType - 粉丝类型
   *  @return {Promise}
   */
  async send(request: {
    source: 'goods_details_take';
    bizName: 'goods_details_take';
    userId: string | number;
  }) {
    return this.invoke('send', [request]);
  }
}

export = VoucherSendService;
