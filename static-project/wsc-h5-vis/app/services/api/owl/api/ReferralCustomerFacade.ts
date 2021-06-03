import BaseService from '../../../base/BaseService';
import { IRecommendRewardDTO } from 'definitions/api/owl/api/ReferralCustomerFacade/getRewardCarousel';
import { IRecommendPoliteDetailDTO } from 'definitions/api/owl/api/ReferralCustomerFacade/getDetailByGoodsAlias';

class ReferralCustomerFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.ump.referral.ReferralCustomerFacade';
  }

  /**
   * @description 获取奖励轮播记录
   * @link http://zanapi.qima-inc.com/site/service/view/915486
   */
  async getRewardCarousel(kdtId: number): Promise<Array<IRecommendRewardDTO>> {
    return this.invoke('getRewardCarousel', [kdtId]);
  }

  /**
   * @description 根据商品alias查询活动详情
   * @link http://zanapi.qima-inc.com/site/service/view/915903
   */
  async getDetailByGoodsAlias(
    kdtId: number,
    goodsAlias: string
  ): Promise<IRecommendPoliteDetailDTO> {
    return this.invoke('getDetailByGoodsAlias', [kdtId, goodsAlias]);
  }

  async getDetailByGoodsAliasV2(
    kdtId: number,
    goodsAlias: string,
    userId: number,
  ): Promise<IRecommendPoliteDetailDTO> {
    return this.invoke('getDetailByGoodsAliasV2', [kdtId, goodsAlias, userId]);
  }

  /**
   * @description 获取活动落地页推荐商品
   * @link http://zanapi.qima-inc.com/site/service/view/916167
   */
  async getRecommendGoods(
    kdtId: number
  ): Promise<Array<IRecommendPoliteDetailDTO>> {
    return this.invoke('getRecommendGoods', [kdtId]);
  }

  /**
   *  获取收益总计
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/997793
   *
   *  @param {number} kdtId - 店铺id
   *  @param {number} activityId - 活动id
   *  @param {number} userId - 用户id
   *  @return {Promise}
   */
  async getEarningsTotal(kdtId:number, activityId:number, userId:number) {
    return this.invoke("getEarningsTotal", [kdtId, activityId, userId]);
  }

  /**
   *  获取收益历史
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/997794
   *
   *  @param {number} kdtId - 店铺id
   *  @param {number} activityId - 活动id
   *  @param {number} userId - 用户id
   *  @param {Object} pageRequest - 分页
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {[object Object]} pageRequest.sort.orders -
   *  @param {number} queryDTO.activityId
   *  @param {number} queryDTO.userId
   *  @return {Promise}
   */
  async getEarningsHistory(kdtId: number, pageRequest:object,queryDTO: object) {
    return this.invoke("getEarningsHistory", [
      kdtId,
      pageRequest,
      queryDTO
    ]);
  }

  /**
   *  获取邀请记录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/997792
   *
   *  @param {Object} pageRequest - 分页
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {[object Object]} pageRequest.sort.orders -
   *  @param {number} kdtId - 店铺id
   *  @param {number} activityId - 活动 id
   *  @return {Promise}
   */
  async getInvitedRecordByActivityId(kdtId:number, pageRequest:object, activityId:number, userId: number) {
    return this.invoke("getInvitedRecordByActivityId", [
      kdtId,
      pageRequest,
      activityId,
      userId,
    ]);
  }
}

export = ReferralCustomerFacade;
