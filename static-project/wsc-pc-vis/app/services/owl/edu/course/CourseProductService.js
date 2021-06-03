const BaseService = require('../../../base/BaseService');

// 这里没有流量了 但 listCourse 先不清，其他都清

/**
 * @class 课程商品服务接口
 */
class CourseProductService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.edu.api.course.CourseProductFacade';
  }

  /**
   * 获取课程商品列表
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/216158
   *
   * @param {*} courseListRequestDTO
   * @param {*} pageRequest
   * @memberof CourseProductService
   */
  async getCourseList(courseListRequestDTO, pageRequest) {
    const result = await this.invoke('listCourse', [courseListRequestDTO, pageRequest]);
    return result;
  }
}

module.exports = CourseProductService;
