const BaseService = require('../../../base/BaseService');

/**
 * 学员相关
 */
class StudentAggregateFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.student.StudentFacade';
  }

  /**
   *  分页综合搜索(带客户信息)
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/372847
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页条件
   *  @param {number} pageRequest.pageNumber -
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query - 查询条件
   *  @param {string} query.endDate - 结束时间
   *  @param {string} query.studentNo - 学号
   *  @param {string} query.keyword - 学员姓名和手机号
   *  @param {string} query.startDate - 开始时间
   *  @return {Promise}
   */
  async findPageByQueryWithCustomer(kdtId, pageRequest, query) {
    return this.invoke('findPageByQueryWithCustomer', [kdtId, pageRequest, query]);
  }

  /**
   *  分页获取报读列表
   *  zanapi 地址： http://zanapi.qima-inc.com/site/service/view/961293
   *
   *  @param {number} kdtId - 当前操作的kdtId
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query -
   *  @param {number} query.applyCourseId - 适用课程ID
   *  @param {string} query.courseName - 线下课名
   *  @param {number} query.courseSellType - 收费方式
   *  @param {number} query.courseStatus - 课程状态
   *  @param {string} query.endRecentStudyTime - 最近上课时间结束日期
   *  @param {string} query.endRegisterTime - 结束报名时间
   *  @param {number} query.enrollmentType - 报名类型
   *  @param {number} query.minEffectiveDay - 最小剩余有效天数
   *  @param {number} query.maxCourseTime - 最大剩余课时
   *  @param {number} query.maxEffectiveDay - 最大剩余有效天数
   *  @param {number} query.minCourseTime - 最小剩余课时
   *  @param {string} query.query - 学员姓名或者电话号码
   *  @param {string} query.startRegisterTime - 开始报名时间
   *  @param {string} query.startRecentStudyTime - 最近上课时间开始日期
   *  @param {string} query.sellerId - 课程顾问
   */
  async findSignUpReadInfo(kdtId, query, pageRequest) {
    return this.invoke('findSignUpReadInfo', [
      kdtId,
      pageRequest,
      query
    ]);
  }
}

module.exports = StudentAggregateFacade;
