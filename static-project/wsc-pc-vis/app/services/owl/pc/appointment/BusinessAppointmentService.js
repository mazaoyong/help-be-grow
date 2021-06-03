const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.pc.api.appointment.BusinessAppointmentFacade -  */
class BusinessAppointmentService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.appointment.BusinessAppointmentFacade';
  }

  /**
   *  预约导出
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/366686
   *
   *  @param {number} kdtId -
   *  @param {Object} studentLessonQuery -
   *  @param {number} studentLessonQuery.courseType - 线下课类型 0 体验课  1 正式课
   *  @param {number} studentLessonQuery.appointmentSource - 预约来源 2 线上预约 3 手动录入
   *  @param {string} studentLessonQuery.address - 上课地点
   *  @param {string} studentLessonQuery.teacherName - 教师名
   *  @param {string} studentLessonQuery.operatorName - 导出订单的操作人的姓名
   *  @param {string} studentLessonQuery.customerName - 预约客户姓名,根据学员id去查他所对应的客户
   *  @param {string} studentLessonQuery.phoneNo - 手机号
   *  @param {string} studentLessonQuery.courseName - 线下课名称，后面接入es后会进行查询
   *  @param {string} studentLessonQuery.startTime - 搜索开始时间
   *  @param {string} studentLessonQuery.contractName - 课节名称
   *  @param {string} studentLessonQuery.endTime - 搜索结束时间
   *  @param {number} studentLessonQuery.status - 学生课表状态
   *  @param {string} studentLessonQuery.operatorMobile - 导出订单的操作人的电话
   *  @return {Promise}
   */
  async exportAppointment(kdtId, studentLessonQuery) {
    return this.invoke('exportAppointment', [kdtId, studentLessonQuery]);
  }

  /**
   *  取消学员的预约，即修改学员课表为已取消
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/365747
   *
   *  @param {number} kdtId - 店铺id
   *  @param {string} studentLessonNo - 待取消的学员课表编号
   *  @param {number} operatorId - 操作人id
   *  @return {Promise}
   */
  async cancel(kdtId, studentLessonNo, operatorId) {
    return this.invoke('cancel', [kdtId, studentLessonNo, operatorId]);
  }

  /**
   *  取消学员的预约V2版本，修复鉴权
   *
   *  @param {number} kdtId - 店铺id
   *  @param {string} studentCancelCommand - 待取消的学员课表编号
   *  @return {Promise}
   */
  async cancelV2(kdtId, studentCancelCommand) {
    return this.invoke('cancelV2', [kdtId, studentCancelCommand]);
  }

  /**
   *  线索页B端机构查询学生课表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/428012
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页参数
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {[object Object]} pageRequest.sort.orders -
   *  @param {Object} studentLessonQuery - 学生课表查询条件
   *  @param {string} studentLessonQuery.mobile - 学员手机号
   *  @return {Promise}
   */
  async findStudentLessonsForClue(kdtId, pageRequest, studentLessonQuery) {
    return this.invoke('findStudentLessonsForClue', [kdtId, pageRequest, studentLessonQuery]);
  }

  /**
   *  线索页B端机构查询学生课表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/831390
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页参数
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query - 学生课表查询条件
   *  @param {number} query.studentId - 学员id(仅大于0时有效), 可以不传, 不传时使用mobile和name搜索; 传值时，仅使用studentId, 不使用mobile和name
   *  @param {number} query.kdtId - 校区店铺id
   *  @param {Object} query.operator - 操作人
   *  @param {Object} query.courseType  - 课程类型，0 体验课，1，正式课
   *  @return {Promise}
   */
  async findStudentLessonsByIdentity(kdtId, pageRequest, query) {
    return this.invoke('findStudentLessonsByIdentity', [kdtId, pageRequest, query]);
  }

  /**
   *  线索创建预约，可以创建待确认或待履约的日程
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/490644
   *
   *  @param {number} operatorKdtId - 店铺id
   *  @param {Object} createCommand - 线索预约创建参数
   *  @param {number} createCommand.studentId - 学员id
   *  @param {number} createCommand.appointmentType - 预约类型 1 待确认预约  2 待履约预约
   *  @param {string} createCommand.lessonNo - 预约的日程no，创建待履约预约时必传
   *  @param {number} createCommand.kdtId - 操作的店铺id
   *  @param {string} createCommand.comment - 备注字段
   *  @param {number} createCommand.eduCourseId - 教务课程id
   *  @param {string} createCommand.appointmentDate - 预约的日期，创建待确认预约时必传
   *  @param {number} createCommand.operatorId - 操作人id
   *  @return {Promise}
   */
  async createClueAppointment(operatorKdtId, createCommand) {
    return this.invoke('createClueAppointment', [operatorKdtId, createCommand]);
  }

  /**
   *  根据资产查询学员预约记录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/490684
   *
   *  @param {number} operatorKdtId - 操作店铺
   *  @param {Object} pageRequest - 分页请求
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} studentLessonByAssetQuery - 请求参数
   *  @param {number} studentLessonByAssetQuery.kdtId - 店铺id
   *  @param {string} studentLessonByAssetQuery.assetNo - 资产编号
   *  @return {Promise}
   */
  async findPageStudentLessonByAssetNo(operatorKdtId, pageRequest, studentLessonByAssetQuery) {
    return this.invoke('findPageStudentLessonByAssetNo', [
      operatorKdtId,
      pageRequest,
      studentLessonByAssetQuery,
    ]);
  }

  /**
   *  批量取消学员的预约，即修改学员课表为已取消，支持连锁（取最后一个取消预约记录作为返回值即可）
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/490680
   *
   *  @param {number} kdtId -
   *  @param {Array} studentLessonCancelCommand -
   *  @return {Promise}
   */
  async batchCancelV2(kdtId, studentLessonCancelCommand) {
    return this.invoke('batchCancelV2', [kdtId, studentLessonCancelCommand]);
  }

  /**
   *  B端机构查询学生课表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/356539
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页参数
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} studentLessonQuery - 学生课表查询条件
   *  @param {number} studentLessonQuery.courseType - 线下课类型 0 体验课  1 正式课
   *  @param {number} studentLessonQuery.appointmentSource - 预约来源 2 线上预约 3 手动录入
   *  @param {string} studentLessonQuery.address - 上课地点
   *  @param {string} studentLessonQuery.teacherName - 教师名
   *  @param {number} studentLessonQuery.kdtId - 校区店铺id
   *  @param {string} studentLessonQuery.operatorName - 导出订单的操作人的姓名
   *  @param {string} studentLessonQuery.customerName - 预约客户姓名,根据学员id去查他所对应的客户
   *  @param {string} studentLessonQuery.phoneNo - 手机号
   *  @param {string} studentLessonQuery.courseName - 线下课名称，后面接入es后会进行查询
   *  @param {string} studentLessonQuery.studentName - 学员姓名
   *  @param {string} studentLessonQuery.startTime - 搜索开始时间
   *  @param {string} studentLessonQuery.contractName - 课节名称
   *  @param {string} studentLessonQuery.endTime - 搜索结束时间
   *  @param {number} studentLessonQuery.status - 学生课表状态
   *  @param {string} studentLessonQuery.operatorMobile - 导出订单的操作人的电话
   *  @return {Promise}
   */
  async findStudentLessons(kdtId, pageRequest, studentLessonQuery) {
    return this.invoke('findStudentLessons', [kdtId, pageRequest, studentLessonQuery]);
  }

  /**
   *  修改预约，先删除课表，后创建学生课表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/814479
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} studentLessonAppointmentUpdateCommand - 学生课表修改请求
   *  @param {number} studentLessonAppointmentUpdateCommand.studentId - 学员id
   *  @param {string} studentLessonAppointmentUpdateCommand.studentLessonNo - 学员课表编号
   *  @param {number} studentLessonAppointmentUpdateCommand.courseType - 预约的课程类型 0 体验课 1 正式课
   *  @param {string} studentLessonAppointmentUpdateCommand.lessonNo - 机构课程标识
   *  @param {number} studentLessonAppointmentUpdateCommand.kdtId - 校区店铺id
   *  @param {string} studentLessonAppointmentUpdateCommand.comment - 用户或商家填写的备注
   *  @param {string} studentLessonAppointmentUpdateCommand.assetNo - 预约正式课时，选择的资产编号
   *  @param {number} studentLessonAppointmentUpdateCommand.operatorId - 预约人id
   *  @param {Object} studentLessonAppointmentUpdateCommand.operator - 操作人
   *  @return {Promise}
   */
  async updateStudentLesson(kdtId, studentLessonAppointmentUpdateCommand) {
    return this.invoke('updateStudentLesson', [kdtId, studentLessonAppointmentUpdateCommand]);
  }

  /**
   *  查询学员课表详情，用于修改预约
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/811717
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} studentLessonNoQuery - 体验课创建的学员课表编号
   *  @param {string} studentLessonNoQuery.studentLessonNo - 学员课表编号
   *  @param {number} studentLessonNoQuery.kdtId - 校区店铺id
   *  @param {Object} studentLessonNoQuery.operator - 操作人
   *  @return {Promise}
   */
  async getStudentLessonForUpdate(kdtId, studentLessonNoQuery) {
    return this.invoke('getStudentLessonForUpdate', [kdtId, studentLessonNoQuery]);
  }

  /**
   *  获取更新日程结果
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/884126
   *
   *  @param {number} operatorKdtId - 店铺id
   *  @param {Object} query - 查询实体
   *  @param {string} query.studentLessonNo - 新学员课表编号
   *  @param {string} query.originStudentLessonNo - 原学员课表编号
   *  @param {number} query.kdtId - 校区kdtId
   *  @return {Promise}
   */
  async getUpdateAppointmentResult(operatorKdtId, query) {
    return this.invoke('getUpdateAppointmentResult', [operatorKdtId, query]);
  }
}

module.exports = BusinessAppointmentService;
