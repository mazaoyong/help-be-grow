const BaseService = require('../../../base/BaseService');
/**
 * 课程相关接口
 * @class
 */
class CourseService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.edu.api.course.CourseFacade';
  }

  /**
   * 批量删除课程商品 TOCLEAR
   *
   * @param {Object} query
   * @return {Object}
   * @memberof CourseFacadeService
   */
  async batchDelete(query) {
    const result = await this.invoke('batchDelete', [query]);
    return result;
  }

  /**
   * pc端批量设置销售状态（停止销售或者上架销售）
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/218517
   *
   * @param {*} query
   * @param {Array} query.aliasList[] - 商品alias列表
   * @param {number} query.kdtId - 店铺id
   * @param {boolean} query.sell - 是否上架销售 true 上架销售, false 停止销售
   * @param {Object} query.operator - 操作人
   * @return {Object}
   */
  async batchSetSellStatus(query) {
    const result = await this.invoke('batchSetSellStatus', [query]);
    return result;
  }

  /**
   * pc端微页面查询课程商品列表 TOCLEAR
   * 这个地方在 decorate-components 里还有用
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/231148r
   *
   * @param {*} query
   * @return {Object}
   */
  async getAllCourseList(query) {
    const result = await this.invoke('listCourseForWym', query);
    return result;
  }

  /**
   * 创建课程
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/208239
   *
   * @param {*} params
   * @param {Object} params.course
   * @param {Object} params.product
   * @return {Object}
   */
  async createCourse(params) {
    const result = await this.invoke('createCourse', [params]);
    return result;
  }

  /**
   *  pc端编辑课程查询课程详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/221230
   *
   *  @param {Object} params -
   *  @param {number} params.kdtId - 店铺id
   *  @param {string} params.alias - 课程alias
   *  @param {number} params.userId - 用户id
   *  @return {Object}
   */
  async getCoursePCDetail(params) {
    const result = await this.invoke('getCoursePCDetail', [params]);
    return result;
  }

  /**
   * 更新课程
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/215176
   *
   * @param {*} params
   * @param {Object} params.course
   * @param {Object} params.product
   * @return {Object}
   */
  async updateCourse(params) {
    return this.invoke('updateCourse', [params]);
  }

  /**
   * 复制课程
   *
   * @see http://zanapi.qima-inc.com/site/service/view/310378
   * @param {Object} courseCopyDTO
   * @param {string} courseCopyDTO.alias
   * @return {Object}
   * @memberof CourseService
   */
  async duplicateCourse(courseCopyDTO) {
    return this.invoke('copy', [courseCopyDTO]);
  }
  /**
   * pc端微页面查询课程商品列表
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/289868
   *
   * @param {Object} courseTagQuery
   * @param {number} courseTagQuery.kdtId - 店铺Id
   * @param {string} courseTagQuery.alias - 课程别名
   * @return {Promise}
   */
  async getCourseTagsByAlias(courseTagQuery) {
    return this.invoke('getCourseTagsByAlias', [courseTagQuery]);
  }
}

module.exports = CourseService;
