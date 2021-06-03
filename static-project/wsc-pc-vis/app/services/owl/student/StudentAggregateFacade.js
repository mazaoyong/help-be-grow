const BaseService = require('../../base/BaseService');

/**
 * 学员管理相关接口
 * @class StudentAggregateFacade
 * @extends {BaseService}
 */
class StudentAggregateFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.student.StudentAggregateFacade';
  }

  /**
   * 分页综合查询学员信息
   *
   * @see http://zanapi.qima-inc.com/site/service/view/361933
   * @param {*} kdtId
   * @param {*} pageRequest
   * @param {*} query
   * @memberof StudentAggregateFacade
   */
  async findPageByQuery(kdtId, pageRequest, query) {
    const result = await this.invoke('findPageByQuery', [kdtId, pageRequest, query]);
    return result;
  }

  /**
   *  分页查询时间段内过生日的学员列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/495324
   *
   *  @param {number} kdtId -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} studentBirthdayQuery -
   *  @param {Object} studentBirthdayQuery.commonTimeBucketQuery - 查询时间段
   *  @return {Promise}
   */
  async findPageByBirthday(kdtId, pageRequest, studentBirthdayQuery) {
    return this.invoke('findPageByBirthday', [
      kdtId,
      pageRequest,
      studentBirthdayQuery,
    ]);
  }

  /**
   *  分页查询剩余课时在N以内的学员列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/495326
   *
   *  @param {number} kdtId -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {[object Object]} pageRequest.sort.orders -
   *  @param {Object} studentRemainingHourQuery -
   *  @param {number} studentRemainingHourQuery.remainingHour - 剩余课时数
   *  @return {Promise}
   */
  async findPageByRemainingHourNotEnough(
    kdtId,
    pageRequest,
    studentRemainingHourQuery,
  ) {
    return this.invoke('findPageByRemainingHourNotEnough', [
      kdtId,
      pageRequest,
      studentRemainingHourQuery,
    ]);
  }

  /**
   *  分页查询课程有效期在N天以内的学员列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/495327
   *
   *  @param {number} kdtId -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {[object Object]} pageRequest.sort.orders -
   *  @param {Object} studentEndTimeQuery -
   *  @param {number} studentEndTimeQuery.validDays - N天内
   *  @return {Promise}
   */
  async findPageByEndTimeNotEnough(kdtId, pageRequest, studentEndTimeQuery) {
    return this.invoke('findPageByEndTimeNotEnough', [
      kdtId,
      pageRequest,
      studentEndTimeQuery,
    ]);
  }

  /**
   *  分页查询时间段内未消课的学员列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/495325
   *
   *  @param {number} kdtId -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} studentUnusedAssetQuery -
   *  @param {Object} studentUnusedAssetQuery.commonTimeBucketQuery - 查询时间段
   *  @return {Promise}
   */
  async findPageByUnusedAsset(kdtId, pageRequest, studentUnusedAssetQuery) {
    return this.invoke('findPageByUnusedAsset', [
      kdtId,
      pageRequest,
      studentUnusedAssetQuery,
    ]);
  }

  /**
   * 分页查询学员课程信息
   *
   * @see http://zanapi.qima-inc.com/site/service/view/358565
   * @param {*} kdtId
   * @param {*} pageRequest
   * @param {*} query
   * @memberof StudentAggregateFacade
   */
  async findCourseByStudentId(kdtId, pageRequest, query) {
    const result = await this.invoke('findPageByQueryWithCourse', [kdtId, pageRequest, query]);
    return result;
  }

  /**
   * 分页查询学员课表信息
   *
   * @see http://zanapi.qima-inc.com/site/service/view/358566
   * @param {*} kdtId
   * @param {*} pageRequest
   * @param {*} query
   * @memberof StudentAggregateFacade
   */
  async findScheduleByStudentId(kdtId, pageRequest, query) {
    const result = await this.invoke('findPageByQueryWithCourseSchedule', [
      kdtId,
      pageRequest,
      query,
    ]);
    return result;
  }

  /**
   * 根据学员id获取学员学习记录
   *
   * @see http://zanapi.qima-inc.com/site/service/view/358567
   * @param {*} kdtId
   * @param {*} pageRequest
   * @param {*} query
   * @memberof StudentAggregateFacade
   */
  async findRecordsByStudentId(kdtId, pageRequest, query) {
    const result = await this.invoke('findPageByQueryWithRecord', [kdtId, pageRequest, query]);
    return result;
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
   *  分页查询学员的课程信息 同时返回部分订单信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/490717
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页查询条件
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query - 查询参数
   *  @param {number} query.studentId - 学员id
   *  @param {number} query.kdtId - 连锁支持指定查询的店铺kdtId
   *  @return {Promise}
   */
  async findPageByQueryWithWrapCourse(kdtId, pageRequest, query) {
    return this.invoke('findPageByQueryWithWrapCourse', [
      kdtId,
      pageRequest,
      query,
    ]);
  }

  /**
   * 分页综合查询学员信息
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/717450
   *
   * @param {number} kdtId - 店铺id
   * @param {Object} pageRequest - 分页查询条件
   * @param {number} pageRequest.pageNumber -
   * @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   * @param {number} pageRequest.pageSize -
   * @param {Object} pageRequest.sort -
   * @param {Object} query - 查询参数
   * @param {string} query.customerName - 客户名称
   * @param {string} query.endDate - 结束时间
   * @param {integer} query.hasSubMp - 是否关注公众号
   * @param {string} query.keyword - 学员姓名和手机号
   * @param {integer} query.kdtId - 店铺id
   * @param {integer} query.learnStatus - 状态类型
   * @param {Object} query.operator
   * @param {string} query.startDate - 开始时间
   * @param {string} query.studentNo - 学号
   * @param {integer} query.targetKdtId - 目标店铺id
   * @return {Promise}
   */
  async findPageByQueryV2(kdtId, pageRequest, query) {
    return this.invoke('findPageByQueryV2', [
      kdtId,
      pageRequest,
      query,
    ]);
  }

  /**
   *  查询学员统计信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/832555
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} query - 查询参数
   *  @param {number} query.kdtId - 查询的kdtId，默认可以不传值
   *  @return {Promise}
   */
  async getStudentListPageStatistics(kdtId, query) {
    return this.invoke('getStudentListPageStatistics', [kdtId, query]);
  }
}

module.exports = StudentAggregateFacade;
