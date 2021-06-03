const BaseService = require('../base/BaseService');

/*
 * com.youzan.material.materialcenter.api.service.general.category.CategoryReadService -
 * 素材中心分组服务
 */
class CategoryReadService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.material.materialcenter.api.service.general.category.CategoryReadService';
  }

  /**
   *  查询分组列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/116735
   *
   *  @param {Object} request - 分组列表查询请求
   *  @param {number} request.categoryType - 分组类型
   *  @param {number} request.partnerBizType - 合作方业务类型
   *  @param {number} request.mediaType - 素材类型
   *  @param {number} request.partnerBizId - 合作方业务实体id，如kdtId，userId
   *  @return {Promise}
   */
  async queryCategoryList(request) {
    return this.invoke('queryCategoryList', [request]);
  }
}

module.exports = CategoryReadService;
