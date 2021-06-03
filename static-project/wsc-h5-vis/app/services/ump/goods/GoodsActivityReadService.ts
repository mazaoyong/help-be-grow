import BaseService from '../../base/BaseService';

/* com.youzan.owl.api.client.ump.voucher.VoucherAdapterFacade -  */
class GoodsActivityReadService extends BaseService {
  public readonly SERVICE_NAME =
    'com.youzan.owl.api.client.ump.voucher.VoucherAdapterFacade';

  /**
   *  查询商详页可用活动列表，返回优惠力度最大的前20个
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1038420
   *
   *  @param {Object} request - 商品可用优惠活动查询请求
   *  @param {number} request.kdtId - 店铺id
   *  @param {number} request.goodsId - 商品id
   *  @return {Promise}
   */
  async listAvlActivities(request: {
    kdtId: number;
    goodsId: number | string;
  }) {
    return this.invoke('listAvlActivities', [request]);
  }
}

export = GoodsActivityReadService;
