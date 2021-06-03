const BaseService = require('../../../base/BaseService');

/**
 * com.youzan.owl.pc.api.signin.SignInFacade
 * */
class SignInService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.signin.SignInFacade';
  }

  /**
   *  获取日历对应的课程时间
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/357673
   *
   *  @param {string} kdtId - 店铺id
   *  @param {Object} dto -
   *  @param {string} dto.startTime - 起始时间
   *  @param {string} dto.endTime - 结束时间
   *
   */
  async findDateOfLessonKanBan(kdtId, dto) {
    return this.invoke('findDateOfLessonKanBan', [kdtId, dto]);
  }

  /**
   *  对应时间的课程列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/357674
   *
   *  @param {string} kdtId - 店铺id
   *  @param {Object} page -
   *  @param {string} page.pageNumber
   *  @param {string} page.pageSize
   *  @param {Object} query -
   *  @param {string} query.queryDate -- 查询的日期
   *  @param {number} query.teacherId -- 老师id
   *
   */
  async findLessons(kdtId, page, query) {
    return this.invoke('findLessons', [kdtId, page, query]);
  }

  /**
   *  获取具体某一课程的详细信息和学员列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/349387
   *
   *  @param {string} kdtId - 店铺id
   *  @param {Object} page -
   *  @param {string} page.pageNumber
   *  @param {string} page.pageSize
   *  @param {string} lessonNo
   *
   */
  async findStudents(kdtId, page, lessonNo) {
    return this.invoke('findStudents', [kdtId, page, lessonNo]);
  }

  /**
   *  查询课表可签到学员列表,支持连锁
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/425196
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页条件
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} studentsInLessonQuery - 课表编号查询
   *  @param {string} studentsInLessonQuery.lessonNo - 日程编号
   *  @param {number} studentsInLessonQuery.kdtId - 日程所属校区店铺id
   *  @return {Promise}
   */
  async findStudentsV2(kdtId, pageRequest, studentsInLessonQuery) {
    return this.invoke('findStudentsV2', [kdtId, pageRequest, studentsInLessonQuery]);
  }

  /**
   *  点击签到/全部签到发送的ajax请求
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/357672
   *
   *  @param {string} kdtId - 店铺id
   *  @param {Object} dto -
   *  @param {string} dto.lessonNo
   *  @param {integer} dto.operatorId
   *  @param {integer} dto.signInType - 签到类型 0 到课 1 请假 2 旷课
   *  @param {Array} dto.studentLessonNos
   */
  async businessBatchSignIn(kdtId, dto) {
    return this.invoke('studentLessonsBatchSignInV2', [kdtId, dto]);
  }

  /**
   *  单个给学员课表签到
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/722417
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} signInCommand - 签到请求
   *  @param {number} signInCommand.signInType - 签到类型 0 到课 1 请假 2 旷课
   *  @param {string} signInCommand.studentLessonNo - 学员课表编号
   *  @param {number} signInCommand.kdtId - 校区店铺id
   *  @param {number} signInCommand.operatorId - 操作人id
   *  @param {Object} signInCommand.operator - 操作者信息
   *  @return {Promise}
   */
  async studentLessonsSignIn(kdtId, signInCommand) {
    return this.invoke('studentLessonsSignIn', [kdtId, signInCommand]);
  }

  /**
   *  机构小程序对学员进行签到
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/362211
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} businessBatchSignInCommand - 签到参数
   *  @param {number} businessBatchSignInCommand.signInType - 签到类型 0 到课 1 请假 2 旷课
   *  @param {string} businessBatchSignInCommand.lessonNo - 机构课表编号，待签到全部标记为已签到的时候需要用
   *  @param {boolean} businessBatchSignInCommand.signInAllStudents - 是否为所有学员签到
   *  @param {number} businessBatchSignInCommand.operatorId - 操作人id
   *  @param {Array.<Array>} businessBatchSignInCommand.studentLessonNos[] - 学员课表编号
   *  @param {Array} businessBatchSignInCommand.studentLessonNos[] -
   *  @return {Promise}
   */
  async businessBatchSignInWeapp(kdtId, businessBatchSignInCommand) {
    return this.invoke('businessBatchSignIn', [kdtId, businessBatchSignInCommand]);
  }

  /**
   *  修改签到状态
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/389830
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} changeSignInStateQuery - 修改签到状态请求参数
   *  @param {number} changeSignInStateQuery.signInType - 签到类型 0 到课 1 请假 2 旷课
   *  @param {string} changeSignInStateQuery.studentLessonNo - 学员课表编号
   *  @param {number} changeSignInStateQuery.operatorId - 操作人id
   *  @return {Promise}
   */
  async changeSignInState(kdtId, changeSignInStateQuery) {
    return this.invoke('changeSignInState', [kdtId, changeSignInStateQuery]);
  }

  /**
   *  B端查询签到记录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/349388
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页条件
   *  @param {number} pageRequest.pageNumber
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize
   *  @param {Object} pageRequest.sort
   *  @param {Array} pageRequest.sort.orders
   *  @return {Promise}
   */
  async findSignInRecords(kdtId, pageRequest) {
    return this.invoke('findSignInRecords', [kdtId, pageRequest]);
  }

  /**
   *  B端查询签到记录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/425199
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页条件
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} signInRecordsQuery -
   *  @param {number} signInRecordsQuery.kdtId - 校区店铺id
   *  @param {string} signInRecordsQuery.startTime - 查询开始时间
   *  @param {string} signInRecordsQuery.endTime - 查询结束时间
   *  @param {number} signInRecordsQuery.teacherId - 老师id
   *  @param {number} signInRecordsQuery.classId - 班级id
   *  @param {number} signInRecordsQuery.addressId - 网店id
   *  @param {number} signInRecordsQuery.userId - 学员id
   *  @param {number} signInRecordsQuery.eduCourseId - 教务课程id，连锁模式为总部教务课程id
   *  @param {number} signInRecordsQuery.signInStatus - 签到状态
   *  @param {string} signInRecordsQuery.lessonName - 课节内容
   *  @param {string} signInRecordsQuery.operateName - 操作人姓名
   *  @param {string} signInRecordsQuery.operateMobile - 操作人手机号码
   *  @return {Promise}
   */
  async findSignInRecordsV3(kdtId, pageRequest, signInRecordsQuery) {
    return this.invoke('findSignInRecordsV3', [kdtId, pageRequest, signInRecordsQuery]);
  }

  /**
   *  分页查询添加日程时的学员列表信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/387782
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页查询条件
   *  @param {number} pageRequest.pageNumber -
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query - 查询参数
   *  @param {string} query.lessonNo - 机构课表编号
   *  @param {string} query.studentNameOrPhone - 学员或手机号，模糊查询
   *  @param {number} query.eduCourseId - 课程id
   *  @return {Promise}
   */
  async findStudentsPageForAddToSignIn(kdtId, pageRequest, query) {
    return this.invoke('findStudentsPageForAddToSignIn', [kdtId, pageRequest, query]);
  }

  /**
   *  分页查询添加日程时的学员列表信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/387783
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} addCommand - 添加学员参数
   *  @param {string} addCommand.lessonNo - 机构课表编号
   *  @param {Array.<Object>} addCommand.studentAndAssets[] - 学员手机号
   *  @param {integer} addCommand.studentAndAssets[].studentId - 学员id
   *  @param {string} addCommand.studentAndAssets[].assetNo - 资产编号
   *  @param {number} addCommand.operatorId - 操作人id
   *  @return {Promise}
   */
  async addStudents(kdtId, addCommand) {
    return this.invoke('addStudentsV2', [kdtId, addCommand]);
  }

  /**
   *  移除学员
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/386044
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} studentLessonRemoveCommand - 请求参数
   *  @param {number} studentLessonRemoveCommand.studentId - 学员id
   *  @param {string} studentLessonRemoveCommand.studentLessonNo - 学员课表no
   *  @param {number} studentLessonRemoveCommand.operatorId - 操作人id
   *  @return {Promise}
   */
  async removeStudent(kdtId, studentLessonRemoveCommand) {
    return this.invoke('removeStudent', [kdtId, studentLessonRemoveCommand]);
  }

  /**
   *  导出签到记录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/530125
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} signInRecordsQuery - 查询条件
   *  @param {string} signInRecordsQuery.operateMobile - 操作人手机号码
   *  @param {number} signInRecordsQuery.kdtId - 校区店铺id
   *  @param {string} signInRecordsQuery.startTime - 查询开始时间
   *  @param {string} signInRecordsQuery.endTime - 查询结束时间
   *  @param {string} signInRecordsQuery.operateName - 操作人姓名
   *  @return {Promise}
   */
  async exportSignInRecords(kdtId, signInRecordsQuery) {
    return this.invoke('exportSignInRecords', [kdtId, signInRecordsQuery]);
  }

  /**
   *  支持按日导出签到记录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/593052
   *
   *  @param {number} operatorKdtId - 店铺ID
   *  @param {Object} pageRequest - 排序规则，看板页无需该参数，列表页由前端传入
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query - 筛选规则
   *  @param {string} query.classroomNo - 教室编号
   *  @param {number} query.appointRule - 预约规则
                                        1：学员预约后才可上课
                                        2：学员无需预约即可上课
   *  @param {number} query.kdtId - 店铺id
   *  @param {string} query.classNo - 班级编号
   *  @param {number} query.startTime - 开始时间
   *  @param {number} query.endTime - 结束时间
   *  @param {string} query.teacherNo - 老师编号
   *  @param {string} query.operatorName - 导出订单的操作人的姓名
   *  @param {string} query.eduCourseName - 教务课程名称
   *  @param {string} query.lessonName - 课节名称
   *  @param {number} query.addressId - 网店id
   *  @param {string} query.operatorMobile - 导出订单的操作人的电话
   *  @return {Promise}
   */
  async exportDayOfSignTable(operatorKdtId, pageRequest, query) {
    return this.invoke('exportDayOfSignTable', [operatorKdtId, pageRequest, query]);
  }

  /**
   *  查询签到提示，用于前端弹窗
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/722414
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} query - 签到提示查询
   *  @param {number} query.signInType - 签到类型 0 到课 1 请假 2 旷课
   *  @param {string} query.studentLessonNo - 学员课表编号
   *  @param {number} query.kdtId - 校区店铺id
   *  @return {Promise}
   */
  async getSignInTip(kdtId, query) {
    return this.invoke('getSignInTip', [kdtId, query]);
  }

  /**
   *  查询批量签到提示，用于前端弹窗
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/722415
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} query - 签到提示查询
   *  @param {number} query.signInType - 签到类型 0 到课 1 请假 2 旷课
   *  @param {string} query.lessonNo - 课节编号
   *  @param {number} query.kdtId - 校区店铺id
   *  @param {Array.<Array>} query.studentLessonNos[] - 学员课表编号
   *  @param {Array} query.studentLessonNos[] -
   *  @return {Promise}
   */
  async getBatchSignInTip(kdtId, query) {
    return this.invoke('getBatchSignInTip', [kdtId, query]);
  }

  /**
   *  查询历史签到记录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1003440
   *
   *  @param {number} kdtId -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query -
   *  @param {string} query.studentLessonNo - 学员课表编号
   *  @param {number} query.kdtId - 校区kdtId
   *  @param {number} query.userId - 学员id
   *  @return {Promise}
   */
  async findSignInRecordHistory(kdtId, pageRequest, query) {
    return this.invoke('findSignInRecordHistory', [kdtId, pageRequest, query]);
  }

  /**
   *  签到记录结果合计
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1006052
   *
   *  @param {number} kdtId -
   *  @param {Object} signInRecordsQuery -
   *  @param {string} signInRecordsQuery.lessonEndTime - 上课结束时间
   *  @param {number} signInRecordsQuery.kdtId - 校区店铺id
   *  @param {string} signInRecordsQuery.lessonStartTime - 上课开始时间
   *  @param {number} signInRecordsQuery.userId - 学员id
   *  @param {Object} signInRecordsQuery.operator - 操作人
   *  @param {number} signInRecordsQuery.addressId - 网店id
   *  @param {string} signInRecordsQuery.lessonName - 课节内容
   *  @param {number} signInRecordsQuery.signInStatus - 签到状态
   *  @param {number} signInRecordsQuery.classId - 班级id
   *  @param {number} signInRecordsQuery.teacherId - 老师id
   *  @param {string} signInRecordsQuery.operateMobile - 操作人手机号码
   *  @param {string} signInRecordsQuery.startTime - 签到开始时间
   *  @param {string} signInRecordsQuery.endTime - 签到结束时间
   *  @param {number} signInRecordsQuery.eduCourseId - 教务课程id 连锁模式为总部教务课程id
   *  @param {string} signInRecordsQuery.operateName - 操作人姓名
   *  @return {Promise}
   */
  async findSignInRecordBriefInfo(kdtId, signInRecordsQuery) {
    return this.invoke('findSignInRecordBriefInfo', [kdtId, signInRecordsQuery]);
  }

  /**
   *  签到记录导出申请（新版）
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1006587
   *
   *  @param {number} kdtId -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query -
   *  @param {string} query.lessonEndTime - 上课结束时间
   *  @param {number} query.kdtId - 校区店铺id
   *  @param {string} query.nickName - 用户名称（操作人）
   *  @param {string} query.mobile - 用户手机号（操作人）
   *  @param {string} query.lessonStartTime - 上课开始时间
   *  @param {number} query.userId - 学员id
   *  @param {number} query.addressId - 网店id
   *  @param {string} query.lessonName - 课节内容
   *  @param {number} query.signInStatus - 签到状态
   *  @param {number} query.classId - 班级id
   *  @param {number} query.teacherId - 老师id
   *  @param {string} query.operateMobile - 操作人手机号码
   *  @param {string} query.startTime - 签到开始时间
   *  @param {string} query.endTime - 签到结束时间
   *  @param {number} query.eduCourseId - 教务课程id 连锁模式为总部教务课程id
   *  @param {string} query.operateName - 操作人姓名
   *  @param {number} query.minOrMaxId - 最小的operateId
   *  @return {Promise}
   */
  async submitSignInRecordsQueryForExport(kdtId, pageRequest, query) {
    return this.invoke('submitSignInRecordsQueryForExport', [kdtId, pageRequest, query]);
  }
}

module.exports = SignInService;
