const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.edu.api.course.TradeFacade -  */class TradeFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.edu.api.course.TradeFacade';
  }

  /**
             *  奖励课程
*  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/315111
*
             *  @param {Object} courseRewardDTO - 奖励实体
             *  @param {Object} courseRewardDTO.userWrapDTO - 用户信息
             *  @param {Object} courseRewardDTO.student - 学员信息
             *  @param {number} courseRewardDTO.kdtId - 店铺id
             *  @param {string} courseRewardDTO.channel - 活动渠道
             *  @param {number} courseRewardDTO.bizId - 业务id
             *  @param {string} courseRewardDTO.fans - 粉丝信息  json串（com.youzan.order.core.service.share.Fans）
 {
     "fansId": 5915965061,
     "type": 1,
     "fansNickName": "u90d1u51ccu5cf0",
     "youzanFansId": 727626596
 }
             *  @return {Promise}
             */
  async rewardCourse(courseRewardDTO) {
    return this.invoke('rewardCourse', [courseRewardDTO]);
  }

  /**
   *  检查下单时能否进行课程预约
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/458394
   *
   *  @param {number} kdtId -
   *  @param {Object} tradeWithAppointmentWrapDTO -
   *  @param {Object} tradeWithAppointmentWrapDTO.productDTO - 商品信息
   *  @param {integer} tradeWithAppointmentWrapDTO.productDTO.num - 数量
   *  @param {string} tradeWithAppointmentWrapDTO.productDTO.alias - 别名，唯一标识
   *  @param {[object Object]} tradeWithAppointmentWrapDTO.productDTO.skuId - sku的主键
   *  @param {Object} tradeWithAppointmentWrapDTO.lessonAppointmentDTO - 课程预约信息
   *  @param {string} tradeWithAppointmentWrapDTO.lessonAppointmentDTO.lessonNo - 机构课程标识
   *  @return {Promise}
   */
  async canTradeWithLessonAppointmentInfo(kdtId, tradeWithAppointmentWrapDTO) {
    return this.owlInvoke('canTradeWithLessonAppointmentInfo', [
      kdtId,
      tradeWithAppointmentWrapDTO,
    ]);
  }

  /**
   *  检查下单预约课程结果
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/458395
   *
   *  @param {number} kdtId -
   *  @param {Object} tradeWithAppointmentQueryDTO -
   *  @param {string} tradeWithAppointmentQueryDTO.orderNo - 订单号
   *  @param {string} tradeWithAppointmentQueryDTO.lessonNo - 机构课程标识
   *  @param {number} tradeWithAppointmentQueryDTO.userId - 用户id
   *  @return {Promise}
   */
  async hasTradeWithLessonAppointment(kdtId, tradeWithAppointmentQueryDTO) {
    return this.owlInvoke('hasTradeWithLessonAppointment', [
      kdtId,
      tradeWithAppointmentQueryDTO,
    ]);
  }
}

module.exports = TradeFacade;
