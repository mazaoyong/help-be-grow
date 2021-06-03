const BaseService = require('../../../base/BaseService');

/* com.youzan.scrm.api.credit.points.PointsReadService -  */
class PointsReadService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.scrm.api.credit.points.PointsReadService';
  }

  /**
             *  获取用户积分信息
*  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/109804
*
             *  @param {Object} pointsQueryDTO -
             *  @param {number} pointsQueryDTO.kdtId - 店铺ID
             *  @param {Object} pointsQueryDTO.sourceDTO - 客户来源描述
             *  @param {integer} pointsQueryDTO.sourceDTO.sourceId - 客户来源id, fansId/yzUserId
             *  @param {integer} pointsQueryDTO.sourceDTO.fansId - 粉丝id
             *  @param {integer} pointsQueryDTO.sourceDTO.sourceType - 客户来源类型, sourceType=1: yzUserId(yzUid/buyerId/adminId), sourceType=2: fansId(微信粉丝/三方粉丝)
             *  @param {integer} pointsQueryDTO.sourceDTO.userId - 有赞用户id
             *  @param {Object} pointsQueryDTO.extTags - 自定义标签
 e.g.key : 扩展值
             *  @return {Promise}
             */
  async getCustomerPoints(pointsQueryDTO) {
    return this.invoke('getCustomerPoints', [pointsQueryDTO]);
  }
}

module.exports = PointsReadService;
