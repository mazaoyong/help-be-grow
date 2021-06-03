const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.pc.api.ceres.CeresAdminPCFacade -  */
class CeresAdminPCFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.ceres.CeresAdminPCFacade';
  }

  /**
   *  获取家校圈配置
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/726548
   *
   *  @param {number} kdtId -
   *  @return {Promise}
   */
  async getCeresConfig(kdtId, user) {
    return this.invoke('getCeresConfig', [kdtId, user]);
  }

  /**
   *  修改家校圈配置
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/728949
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {number} command.postPublishAuth - 动态发布权限，不传则不更新
   *  @param {number} command.postContentRestriction - 动态内容限制，不传则不更新
   *  @param {string} command.moduleName - 商家自定义家校圈名称，不传则不更新
   *  @return {Promise}
   */
  async updateCeresConfig(kdtId, command) {
    return this.invoke('updateCeresConfig', [kdtId, command]);
  }

  /**
             *  获取家校圈动态列表
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/728951
  *
             *  @param {number} kdtId -
             *  @param {Object} query -
             *  @param {number} query.sortColumn - 一期仅支持按发布时间排序
  排序字段
  0：发布时间，
  1：阅读数，
  2：点赞数，
  3：评论数，
  4：分享数
             *  @param {string} query.endDate - 搜索条件结束时间
  格式 yyyy-MM-dd
             *  @param {number} query.sortOrder - 0 降序，1 升序
             *  @param {Object} query.pageRequest -
             *  @param {string} query.startDate - 搜索条件开始时间
  格式 yyyy-MM-dd
             *  @return {Promise}
             */
  async findPosts(kdtId, query) {
    return this.invoke('findPosts', [kdtId, query]);
  }

  async findStudentPageWithCustomer(kdtId, pageRequest, query) {
    return this.invoke('findStudentPageWithCustomer', [kdtId, pageRequest, query]);
  }
}

module.exports = CeresAdminPCFacade;
