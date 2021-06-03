const BaseService = require('../../../base/BaseService');

/**
 * com.youzan.owl.pc.api.student.StudentAggregateFacade
 */
class StudentAggregateService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.student.StudentAggregateFacade';
  }

  /**
   *  分页查询课节下学员
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/358569
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页查询条件
   *  @param {number} pageRequest.pageNumber
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize
   *  @param {Object} pageRequest.sort
   *  @param {Object} query - 查询实体
   *  @param {number} query.signInStatus - 签到状态 2：未签到 4：到课 5：已取消 6：旷课 7：请假
   *  @param {string} query.lessonNo - 课节编号
   *  @param {number} query.kdtId - 店铺id
   *  @return {Promise}
   */
  async findStuLessonByLessonNo(kdtId, pageRequest, query) {
    return this.invoke('findStuLessonByLessonNoV2', [kdtId, pageRequest, query]);
  }

  /**
             *  分页查询课节下学员
*  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/722330
*
             *  @param {number} kdtId - 店铺id
             *  @param {Object} pageRequest - 分页查询条件
             *  @param {number} pageRequest.pageNumber -
             *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
             *  @param {number} pageRequest.pageSize -
             *  @param {Object} pageRequest.sort -
             *  @param {Object} query - 查询实体
             *  @param {number} query.signInStatus - 签到状态
 2：未签到
 4：到课
 5：已取消
 6：旷课
 7：请假
             *  @param {string} query.lessonNo - 课节编号
             *  @param {number} query.kdtId - 店铺id
             *  @param {string} query.operatorName - 导出订单的操作人的姓名
             *  @param {Object} query.operator - 操作人
             *  @param {string} query.operatorMobile - 导出订单的操作人的电话
             *  @return {Promise}
             */
  async findStuLessonByLessonNoV2(kdtId, pageRequest, query) {
    return this.invoke('findStuLessonByLessonNoV2', [
      kdtId,
      pageRequest,
      query,
    ]);
  }

  /**
   *  分页查询添加日程时的学员列表信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/361938
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页查询条件
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query - 查询参数
   *  @param {string} query.lessonNo - 课节编号
   *  @param {string} query.studentName - 学员姓名
   *  @param {number} query.eduCourseId - 课程id
   *  @return {Promise}
   */
  async findPageByQueryWithSingleSchedule(kdtId, pageRequest, query) {
    return this.invoke('findPageByQueryWithSingleScheduleV2', [kdtId, pageRequest, query]);
  }

  /**
   *  分页查询购买了班级关联的课程学员列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/361934
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页查询条件
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query - 查询参数
   *  @param {number} query.eduClassId - 班级id
   *  @param {string} query.studentName - 学员姓名
   *  @param {number} query.eduCourseId - 课程id
   *  @return {Promise}
   */
  async findPageByQueryWithClass(kdtId, pageRequest, query) {
    return this.invoke('findPageByQueryWithClassV2', [kdtId, pageRequest, query]);
  }

  /**
   *  分页查询班级下关联学员列表 用于班级详情的学员列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/364726
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页查询条件
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query - 查询参数
   *  @param {number} query.eduClassId - 班级id
   *  @param {string} query.studentName - 学员姓名
   *  @param {number} query.eduCourseId - 课程id
   *  @return {Promise}
   */
  async findPageByQueryInClass(kdtId, pageRequest, query) {
    return this.invoke('findPageByQueryInClassV2', [kdtId, pageRequest, query]);
  }

  /**
   *  导出签到
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/370044
   *
   *  @param {number} kdtId
   *  @param {Object} query
   *  @param {number} query.signInStatus - 签到状态 2：未签到 4：到课 5：已取消 6：旷课 7：请假
   *  @param {string} query.lessonNo - 课节编号
   *  @param {number} query.kdtId - 店铺id
   *  @param {string} query.operatorName - 导出订单的操作人的姓名
   *  @param {string} query.operatorMobile - 导出订单的操作人的电话
   *  @return {Promise}
   */
  async exportStuLessonListByLessonNo(kdtId, query) {
    const _query = Object.keys(query)
      .map(key => query[key] ? { [key]: query[key] } : null)
      .filter(item => item)
      .reduce((obj, item) => Object.assign(obj, item), {});
    return this.invoke('exportStuLessonListByLessonNo', [kdtId, _query]);
  }

  /**
   *  根据学员手机号，分页查询学员的课程信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/419828
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页查询条件
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query - 查询参数
   *  @param {string} query.mobile - 学员手机号
   *  @param {Array.<Array>} query.chainKdtIds[] - 校区口袋通id列表
   *  @return {Promise}
   */
  async findPageByMobileWithCourse(kdtId, pageRequest, query) {
    return this.invoke('findPageByMobileWithCourse', [
      kdtId,
      pageRequest,
      query,
    ]);
  }

  /**
   *  转出课程详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/957394
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} query - 查询参数
   *  @param {number} query.kdtId - 查询的kdtId，默认可以不传值
   *  @return {Promise}
   */
  async getTransferOutCourseDetail(kdtId, query) {
    return this.invoke('getTransferOutCourseDetail', [kdtId, query]);
  }

  /**
   *  转课
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/957395
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} query - 查询参数
   *  @param {number} query.kdtId - 查询的kdtId，默认可以不传值
   *  @return {Promise}
   */
  async transferCourse(kdtId, query) {
    return this.invoke('transferCourse', [kdtId, query]);
  }

  /**
   *  转课记录
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/957397
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} query - 查询参数
   *  @param {string} query.assetNo - 资产ID
   *  @param {string} query.orderNo - 订单号
   *  @param {number} query.targetKdtId
   *  @return {Promise}
   *
   */
  async getTransferCourseRecord(kdtId, query) {
    return this.invoke('getTransferCourseRecord', [kdtId, query]);
  }

  /**
   *  转课凭证
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/957396
   *
   *  @param {number} kdtId - 店铺Id
   *  @param {string} query.orderNo - 订单号
   *  @return {Promise}
   *
   */
  async getTransferCourseCertificate(kdtId, query) {
    return this.invoke('getTransferCourseCertificate', [kdtId, query]);
  }

  /**
   * @description 分页查询学员的课程信息 同时返回部分订单信息（转出课时选择 仅仅销售类型为按课时、按时段的课程资产）
   * @link http://zanapi.qima-inc.com/site/service/view/957393
   */
  async findPageByWithSpecificCourse(kdtId, pageRequest, query) {
    return this.invoke('findPageByWithSpecificCourse', [kdtId, pageRequest, query]);
  }
}

module.exports = StudentAggregateService;
