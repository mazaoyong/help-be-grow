const BaseService = require('../../base/BaseService');

/**
 * 课程 CourseProductService
 * @class CourseProductService
 * @extends {BaseService}
 */
class CourseProductService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.edu.api.course.CourseProductFacade';
  }

  /**
   *  pc端查询课程商品列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/216158
   *
   *  @param {Object} req - 课程查询参数
   *  @param {number} req.courseType - 课程类型：0：体验课 1：正式课 2：全部
   *  @param {number} req.kdtId - kdtId
   *  @param {number} req.soldStatus - 出售状态：-1： 未上架 0： 在售 1： 售罄 2： 全部
   *  @param {string} req.title - 课程名称
   *  @param {string[]} req.includeAliases[] - alias列表
   *  @param {Object} pageRequest - 分页参数
   *  @param {number} pageRequest.pageNumber - 第几页
   *  @param {number} pageRequest.pageSize - 每页大小
   *  @param {Object} pageRequest.sort - 排序参数
   *  @return {Promise.<Object>}
   */
  async listCourse(req, pageRequest) {
    return this.invoke('listCourse', [req, pageRequest]);
  }
}

module.exports = CourseProductService;
