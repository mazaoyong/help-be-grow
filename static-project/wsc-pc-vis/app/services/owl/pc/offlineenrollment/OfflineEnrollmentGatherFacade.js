const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.pc.api.offlineenrollment.OfflineEnrollmentGatherFacade -  */
class OfflineEnrollmentGatherFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.offlineenrollment.OfflineEnrollmentGatherFacade';
  }

  /**
   *  根据姓名 手机号查找对应的学员和线索信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/433414
   *
   *  @param {number} kdtId -
   *  @param {Object} studentClueListQueryCommand - 根据姓名 手机号进行查询的对象
   *  @param {string} studentClueListQueryCommand.name - 学员姓名
   *  @param {string} studentClueListQueryCommand.mobile - 手机号码
   *  @param {number} studentClueListQueryCommand.operatorId - 操作人ID
   *  @param {Object} studentClueListQueryCommand.operator - 操作人
   *  @return {Promise}
   */
  async findStudentAndClueInfoByNameOrPhoneNumber(
    kdtId,
    studentClueListQueryCommand
  ) {
    return this.invoke('findStudentAndClueInfoByNameOrPhoneNumber', [
      kdtId,
      studentClueListQueryCommand,
    ]);
  }

  /**
   *  根据组合条件搜索排序线下课程
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/433415
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} offineCourseQueryCommand - 线下课搜索相关条件
   *  @param {number} offineCourseQueryCommand.courseSellType - 收费方式,0:自定义 1:按课时 2:按时间段 3:按期
   *  @param {string} offineCourseQueryCommand.eduCourseTitle - 教务课程名称
   *  @param {number} offineCourseQueryCommand.courseType - 线下课类型
   *  @param {number} offineCourseQueryCommand.applyCourseType - 适用课程类型,0:无效类型，1：适用于全部课程  2:适用指定课程
   *  @param {Object} offineCourseQueryCommand.studentAggregate - 学员相关信息
   *  @param {string} offineCourseQueryCommand.title - 线下课名称 支持模糊搜索
   *  @param {number} offineCourseQueryCommand.operatorId - 操作人ID
   *  @param {Object} offineCourseQueryCommand.operator - 操作人
   *  @param {Object} pageRequest - 分页
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @return {Promise}
   */
  async findOfflineCourseWithCondition(
    kdtId,
    offineCourseQueryCommand,
    pageRequest
  ) {
    return this.invoke('findOfflineCourseWithCondition', [
      kdtId,
      offineCourseQueryCommand,
      pageRequest,
    ]);
  }

  /**
   *  根据组合条件搜索排序线下课程V2 后续都用这个
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/719015
   *
   *  @param {number} kdtId -
   *  @param {Object} offlineCourseQueryCommand -
   *  @param {number} offlineCourseQueryCommand.courseSellType - 收费方式,0:自定义 1:按课时 2:按时间段 3:按期
   *  @param {string} offlineCourseQueryCommand.eduCourseTitle - 教务课程名称
   *  @param {number} offlineCourseQueryCommand.courseType - 线下课类型
   *  @param {number} offlineCourseQueryCommand.applyCourseType - 适用课程类型,0:无效类型，1：适用于全部课程  2:适用指定课程
   *  @param {Object} offlineCourseQueryCommand.studentAggregate - 学员相关信息
   *  @param {number} offlineCourseQueryCommand.groupId - 课程分组 id
   *  @param {number} offlineCourseQueryCommand.eduCourseId - 教务课程名称
   *  @param {string} offlineCourseQueryCommand.title - 线下课名称 支持模糊搜索
   *  @param {number} offlineCourseQueryCommand.operatorId - 操作人ID
   *  @param {Object} offlineCourseQueryCommand.operator - 操作人
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @return {Promise}
   */
  async findOfflineCourseWithConditionV2(
    kdtId,
    offlineCourseQueryCommand,
    pageRequest
  ) {
    return this.invoke('findOfflineCourseWithConditionV2', [
      kdtId,
      offlineCourseQueryCommand,
      pageRequest,
    ]);
  }

  /**
   *
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/433416
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} offlineEnrollmentGatherCommand - 与收款相关的各种对象：学员信息 线下课 优惠信息 其它信息
   *  @param {Object} offlineEnrollmentGatherCommand.extraInfoDetail - 其它信息
   *  @param {Object} offlineEnrollmentGatherCommand.studentAggregate - 学员聚合信息
   *  @param {Array.<Object>} offlineEnrollmentGatherCommand.courseChoiceDetailList[] - 线下课相关信息
   *  @param {Object} offlineEnrollmentGatherCommand.discountPrice - 优惠金额
   *  @param {Object} offlineEnrollmentGatherCommand.discountChoiceDetail - 优惠折扣信息
   *  @param {number} offlineEnrollmentGatherCommand.operatorId - 操作人ID
   *  @param {Object} offlineEnrollmentGatherCommand.operator - 操作人
   *  @return {Promise}
   */
  async submitOfflineEnrollmentOrder(kdtId, offlineEnrollmentGatherCommand) {
    return this.invoke('submitOfflineEnrollmentOrder', [
      kdtId,
      offlineEnrollmentGatherCommand,
    ]);
  }

  /**
   *
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/457039
   *
   *  @param {number} kdtId -
   *  @param {Object} studentQueryCommand -
   *  @param {string} studentQueryCommand.name - 学员姓名
   *  @param {string} studentQueryCommand.mobile - 手机号码
   *  @param {number} studentQueryCommand.operatorId - 操作人ID
   *  @param {Object} studentQueryCommand.operator - 操作人
   *  @return {Promise}
   */
  async getStudentByNameAndMobile(kdtId, studentQueryCommand) {
    return this.invoke('getStudentByNameAndMobile', [
      kdtId,
      studentQueryCommand,
    ]);
  }

  /**
   *  获取待报名订单信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/569347
   *
   *  @param {number} kdtId -
   *  @param {string} orderNo -
   *  @return {Promise}
   */
  async getPreLinkInfo(kdtId, orderNo) {
    return this.invoke('getPreLinkInfo', [kdtId, orderNo]);
  }

  /**
   *  关联快速下单订单的课程信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/546581
   *
   *  @param {number} kdtId -
   *  @param {Object} linkCourseCommand -
   *  @param {string} linkCourseCommand.orderNo - 订单号 必填
   *  @param {Object} linkCourseCommand.linkExtraDTO - 其他信息
   *  @param {Object} linkCourseCommand.studentAggregate - 学员信息 必填
   *  @param {Array.<Object>} linkCourseCommand.courseChoiceDetailList[] - 线下课相关信息 必填
   *  @param {Object} linkCourseCommand.discountPrice - 优惠金额 必填
   *  @param {Object} linkCourseCommand.discountChoiceDetail - 优惠折扣信息 有就填，没优惠的时候不传
   *  @return {Promise}
   */
  async linkCourse(kdtId, linkCourseCommand) {
    return this.invoke('linkCourse', [kdtId, linkCourseCommand]);
  }
}

module.exports = OfflineEnrollmentGatherFacade;
