const BaseService = require('../../../base/BaseService');

class SalesmanService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.ump.api.salesman.SalesmanFacade';
  }

  // 分销员业务服务---获取分销员信息
  get SALESMAN_SERVICE_NAME() {
    return 'com.youzan.ebiz.salesman.wap.api.service.share.ShareApiService';
  }

  // 分销员业务服务--绑定客户关系相关、
  get SALESMAN_CUSTOMER_SERVICE() {
    return 'com.youzan.ebiz.salesman.wap.api.service.customer.CustomerWapApiService';
  }

  /**
   *  获取分销员状态
   *  zanAPI文档地址:
   *  @param params
   *  @param params.kdtId -
   *  @param params.userId -
   *  @return {object}
   */
  async register(params) {
    return this.owlInvoke(this.SERVICE_NAME, 'register', params);
  }

  /**
             *  获取商品推广数据
*  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/104784
*
             *  @param {Object} context -
             *  @param {string} context.redirectUrl - 分享地址
             *  @param {number} context.kdtId - 店铺id
             *  @param {number} context.goodsId - 商品id
             *  @param {number} context.adminId - 分销员id
 (兼容卡门)
             *  @param {string} context.alias - 别名，与 type 对应
             *  @param {number} context.buyerId - 分销员id
             *  @param {string} context.type - 类型：
 通用：normal
 知识付费：paidcontent
             *  @return {Promise}
             */
  async getShareIcon(context) {
    return this.owlInvoke(this.SALESMAN_SERVICE_NAME, 'getShareIcon', [context]);
  }

  /**
             *  新绑定客户关系接口
*  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/493343
*
             *  @param {Object} customerRelationSaveWapDTO -
             *  @param {number} customerRelationSaveWapDTO.bindSourceType - 绑定类型来源

     PROMOTE_GOODS_QRCODE(1, "扫商品二维码"),
     PROMOTE_GOODS_LINK(2, "点击推广商品链接"),
     PROMOTE_POSTER_QRCODE(3, "扫推广海报二维码"),
     MOMENTS(4, "查看销售员动态"),
     SALE_CARD(5, "查看销售员名片"),
     TINY_PAGE(6, "浏览微页面"),
     RECRUIT_PLAN(7, "浏览招募计划"),
     INVITE_QRCODE(8, "邀请卡二维码"),
     STORE_NOTES(9, "浏览店铺笔记"),
     MERCHANTS_IMPORT(10, "外部商家导入"),
     BECOME_SALESMAN(11, "成为分销员等其他来源"),
     EXCLUSIVE_RECOMMENDED(12, "查看商品专属推荐");
             *  @param {number} customerRelationSaveWapDTO.fansId - 客户fansId
             *  @param {number} customerRelationSaveWapDTO.kdtId - 店铺id
             *  @param {string} customerRelationSaveWapDTO.sellerFrom - 分销员sl
             *  @param {number} customerRelationSaveWapDTO.buyerId - 客户id
             *  @param {number} customerRelationSaveWapDTO.fansType - 客户粉丝type
             *  @return {Promise}
             */
  async bindCustomerRelation(customerRelationSaveWapDTO) {
    return this.invoke(this.SALESMAN_CUSTOMER_SERVICE, 'bindCustomerRelation', [customerRelationSaveWapDTO]);
  }
}

module.exports = SalesmanService;
