const BaseService = require('../../base/BaseService');

/**
 * 老师service
 * @class TeacherService
 * @extends {BaseService}
 */
class TeacherService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.edu.api.course.TeacherFacade';
  }

  /**
   *  查询某个店铺下的老师信息，不分页
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/208457
   *
   *  @param {Object} req - 请求参数
   *  @param {number} req.kdtId - 店铺id
   *  @param {string[]} req.teacherIds[] - 老师id集合，不传表示查询所有
   *  @param {Array} req.teacherIds[] - id列表
   *  @param {string} req.keyword - 模糊搜索的关键词，搜老师昵称或者员工名字，可以不传
   *  @return {Object}
   */
  async listTeacher(req) {
    return this.invoke('listTeacher', [req]);
  }

  /**
   * 查询某个店铺下的老师信息列表，带分页
   * 接口文档：http://zanapi.qima-inc.com/site/service/view/278209
   *
   * @param {Object} requestDTO 请求参数
   * @param {Object} pageRequest 分页信息
   */
  async listTeacherForWym(requestDTO, pageRequest) {
    const res = await this.invoke('listTeacherForWym', [requestDTO, pageRequest]);
    return res;
  }
}

module.exports = TeacherService;
