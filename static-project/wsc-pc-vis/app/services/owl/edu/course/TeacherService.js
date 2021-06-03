const BaseService = require('../../../base/BaseService');

/**
 * 老师相关接口
 * @class
 */
class TeacherService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.edu.api.course.TeacherFacade';
  }

  /**
   *  查询某个店铺下的老师信息，不分页 TOCLEAR 旧接口 不要用 再观察一阵子
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/208457
   *
   *  @param {Object} params -
   *  @param {number} params.kdtId - 店铺id
   *  @param {Array.<Array>} params.teacherIds[] - 老师id集合，不传表示查询所有
   *  @param {Array} params.teacherIds[] -
   *  @param {string} params.keyword - 模糊搜索的关键词，搜老师昵称或者员工名字，可以不传
   *  @return {Object}
   */
  async getTeacherList(params) {
    const result = await this.invoke('listTeacher', [params]);
    return result;
  }
}

module.exports = TeacherService;
