const BaseService = require('../../../../base/BaseService');

/* com.youzan.owl.pc.api.courseitem.offlinecourse.PcCourseFacade -  */
class PcCourseFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.courseitem.offlinecourse.PcCourseFacade';
  }

  /**
   *  分页查询课程商品列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/531968
   *
   *  @param {number} kdtId -
   *  @param {Object} courseQuery -
   *  @param {number} courseQuery.courseSellType - 收费方式,0:自定义 1:按课时 2:按时间段 3:按期
   *  @param {number} courseQuery.courseType - 课程类型：0：体验课 1：正式课 2：全部
   *  @param {number} courseQuery.applyCourseType - 适用课程类型,0:无效类型，1：适用于全部课程  2:适用指定课程
   *  @param {number} courseQuery.campusKdtId - kdtId 总店支持查看校区的线下课
   *  @param {number} courseQuery.groupId - 课程分组id 全部传-1
   *  @param {number} courseQuery.eduCourseId - 教务课程名称
   *  @param {number} courseQuery.soldStatus - 出售状态：-1：未上架 0： 在售 1： 售罄 2： 全部
   *  @param {string} courseQuery.title - 课程名称
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @return {Promise}
   */
  async findPageByCondition(kdtId, courseQuery, pageRequest) {
    return this.invoke('findPageByCondition', [kdtId, courseQuery, pageRequest]);
  }

  /**
   *  列表页 — 获取sku信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/531969
   *
   *  @param {number} kdtId -
   *  @param {Object} productSkuQuery - {@link PcProductSkuQuery}
   *  @param {string} productSkuQuery.productAlias - 商品alias
   *  @return {Promise}
   */
  async findProductSkus(kdtId, productSkuQuery) {
    return this.invoke('findProductSkus', [kdtId, productSkuQuery]);
  }

  /**
   *  根据线下课销售状态查找店铺列表信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/531970
   *
   *  @param {number} kdtId -
   *  @param {Object} courseProductQuery -
   *  @param {number} courseProductQuery.itemId - 总部商品id
   *  @param {string} courseProductQuery.keyword - 校区名称
   *  @param {number} courseProductQuery.status - 出售状态：-1： 未上架 0： 在售 1： 售罄 2： 全部
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @return {Promise}
   */
  async findPageBySoldStatus(kdtId, courseProductQuery, pageRequest) {
    return this.invoke('findPageBySoldStatus', [kdtId, courseProductQuery, pageRequest]);
  }

  /**
   *  配置可售校区列表查询
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/531971
   *
   *  @param {number} kdtId -
   *  @param {Object} courseProductQuery -
   *  @param {number} courseProductQuery.itemId - 总部商品id
   *  @param {string} courseProductQuery.keyword - 校区名称
   *  @param {number} courseProductQuery.status - 出售状态： -1： 未上架 0： 在售 1： 售罄 2： 全部
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @return {Promise}
   */
  async findPageCampusProduct(kdtId, courseProductQuery, pageRequest) {
    return this.invoke('findPageCampusProduct', [kdtId, courseProductQuery, pageRequest]);
  }

  /**
   *  快捷修改无sku商品信息（序号及标题）
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/531961
   *
   *  @param {number} kdtId - 店铺的操作者
   *  @param {Object} productQuickUpdateCommand - {@link PcProductQuickUpdateCommand} 快捷修改请求
   *  @param {number} productQuickUpdateCommand.kdtId - 店铺id todo:yajun 待确认是否可以去掉
   *  @param {string} productQuickUpdateCommand.title - 标题
   *  @param {number} productQuickUpdateCommand.goodsNum - 序号
   *  @param {Object} productQuickUpdateCommand.operator - 操作人信息
   *  @param {string} productQuickUpdateCommand.productAlias - 商品alias
   *  @return {Promise}
   */
  async quickUpdateProductByAlias(kdtId, productQuickUpdateCommand) {
    return this.invoke('quickUpdateProductByAlias', [kdtId, productQuickUpdateCommand]);
  }

  /**
   *  快捷修改商品规格相关信息（库存及价格）
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/531962
   *
   *  @param {number} kdtId - 店铺的操作者
   *  @param {Object} productQuickUpdateSkuCommand - {@link PcProductQuickUpdateSkuCommand} 快捷修改请求
   *  @param {Array.<Object>} productQuickUpdateSkuCommand.skus[] - skus详细修改信息
   *  @param {number} productQuickUpdateSkuCommand.kdtId - 店铺id todo:yajun 待确认是否可以去掉
   *  @param {number} productQuickUpdateSkuCommand.skuType - 1 无sku 2多sku
   *  @param {Object} productQuickUpdateSkuCommand.operator - 操作人信息
   *  @param {string} productQuickUpdateSkuCommand.productAlias - 商品alias
   *  @return {Promise}
   */
  async quickUpdateProductSkuByAlias(kdtId, productQuickUpdateSkuCommand) {
    return this.invoke('quickUpdateProductSkuByAlias', [kdtId, productQuickUpdateSkuCommand]);
  }

  /**
   *  查询指定店铺下的课程标签
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/531966
   *
   *  @param {number} kdtId -
   *  @param {Object} courseTagQueryDTO -
   *  @param {string} courseTagQueryDTO.tag - 标签,模糊查询条件
   *  @return {Promise}
   */
  async findCourseTag(kdtId, courseTagQueryDTO) {
    return this.invoke('findCourseTag', [kdtId, courseTagQueryDTO]);
  }

  /**
   *  pc端编辑课程查询课程详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/531967
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {string} query.alias - 课程alias
   *  @return {Promise}
   */
  async getCoursePCDetail(kdtId, query) {
    return this.invoke('getCoursePCDetail', [kdtId, query]);
  }

  /**
   *  pc端批量删除
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/531973
   *
   *  @param {number} kdtId -
   *  @param {Object} productBatchDeleteCommand -
   *  @param {Array.<Array>} productBatchDeleteCommand.aliasList[] - 商品alias列表
   *  @param {number} productBatchDeleteCommand.kdtId - 店铺id
   *  @param {Object} productBatchDeleteCommand.operator - 操作人
   *  @return {Promise}
   */
  async batchDelete(kdtId, productBatchDeleteCommand) {
    return this.invoke('batchDelete', [kdtId, productBatchDeleteCommand]);
  }

  /**
   *  pc端批量设置销售状态（停止销售或者上架销售）
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/531963
   *
   *  @param {number} kdtId - 店铺的操作者
   *  @param {Object} sellBatchOperateCommand - {@link PcSellBatchOperateCommand} 批量设置请求
   *  @param {Array.<Array>} sellBatchOperateCommand.aliasList[] - 商品alias列表
   *  @param {number} sellBatchOperateCommand.kdtId - 店铺id todo:yajun 待确认是否可以去掉
   *  @param {boolean} sellBatchOperateCommand.sell - 是否上架销售 true 上架销售, false 停止销售
   *  @param {Object} sellBatchOperateCommand.operator - 操作人信息
   *  @param {Array.<Object>} sellBatchOperateCommand.sellStatusProductModelList[] - 总部批量上架校区商品
   *  @return {Promise}
   */
  async batchSetSellStatus(kdtId, sellBatchOperateCommand) {
    return this.invoke('batchSetSellStatus', [kdtId, sellBatchOperateCommand]);
  }

  /**
   *  pc端批量设置会员折扣
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/531964
   *
   *  @param {number} kdtId - 店铺的操作者
   *  @param {Object} vipDiscountBatchOperateCommand - {@link PcVipDiscountBatchOperateCommand} 批量设置请求
   *  @param {Array.<Array>} vipDiscountBatchOperateCommand.aliasList[] - 商品alias列表
   *  @param {number} vipDiscountBatchOperateCommand.kdtId - 店铺id todo:yajun 待确认是否可以去掉
   *  @param {boolean} vipDiscountBatchOperateCommand.join - 是否参与会员折扣 true 参加, false 不参加
   *  @param {Object} vipDiscountBatchOperateCommand.operator - 操作人信息
   *  @return {Promise}
   */
  async batchSetVipDiscount(kdtId, vipDiscountBatchOperateCommand) {
    return this.invoke('batchSetVipDiscount', [kdtId, vipDiscountBatchOperateCommand]);
  }

  /**
   *  PC端微页面查询课程商品标签信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/562749
   *
   *  @param {number} kdtId -
   *  @param {string} alias -
   *  @return {Promise}
   */
  async findCourseTagsByAlias(kdtId, alias) {
    return this.invoke('findCourseTagsByAlias', [kdtId, alias]);
  }

  /**
   *  更新课程
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/532040
   *
   *  @param {number} kdtId - 店铺的操作者
   *  @param {Object} createCourseCommand -
   *  @param {Object} createCourseCommand.product - 商品信息
   *  @param {Object} createCourseCommand.course - 线下课信息
   *  @return {Promise}
   */
  async updateCourse(kdtId, createCourseCommand) {
    return this.invoke('updateCourse', [kdtId, createCourseCommand]);
  }

  /**
   *  创建课程
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/532039
   *
   *  @param {number} kdtId - 店铺的操作者
   *  @param {Object} createCourseCommand -
   *  @param {Object} createCourseCommand.product - 商品信息
   *  @param {Object} createCourseCommand.course - 线下课信息
   *  @return {Promise}
   */
  async createCourse(kdtId, createCourseCommand) {
    return this.invoke('createCourse', [kdtId, createCourseCommand]);
  }
}

module.exports = PcCourseFacade;
