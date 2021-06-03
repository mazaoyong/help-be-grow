const BaseService = require('../../../base/BaseService');

/**
 * 学员相关
 */
class LessonService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.lesson.LessonFacade';
  }

  /**
   *  获取可预约的课节列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/364073
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} query - 课节编号
   *  @param {number} query.courseType - 课程类型 0：体验课 1：正式课
   *  @param {number} query.startTime - 开始时间
   *  @param {number} query.eduCourseId - 教务课程名称
   *  @param {number} query.endTime - 结束时间
   *  @param {Object} query.studentAsset - 学员资产（正式课时需要传）
   *  @param {number} query.addressId - 网店id
   *  @return {Promise}
   */
  async findAppointmentList(kdtId, query) {
    return this.invoke('findAppointmentList', [kdtId, query]);
  }

  /**
    *  获取可预约的课节列表，B端新增预约功能
    如果不满足条件也会返回，增加是否校验通过的字段，和不通过的原因
    *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/628966
    *
    *  @param {number} operatorKdtId - 店铺id
    *  @param {Object} pageRequest - 分页参数
    *  @param {number} pageRequest.pageNumber -
    *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
    *  @param {number} pageRequest.pageSize -
    *  @param {Object} pageRequest.sort -
    *  @param {Object} query - 查询条件
    *  @param {number} query.courseType - 课程类型
0：体验课
1：正式课
    *  @param {number} query.kdtId - 校区店铺id
    *  @param {number} query.startTime - 开始时间
    *  @param {number} query.eduCourseId - 教务课程名称
    *  @param {number} query.endTime - 结束时间
    *  @param {Object} query.studentAsset - 学员资产（正式课时需要传）
    *  @param {number} query.addressId - 网店id
    *  @return {Promise}
    */
  async findAppointmentPage(operatorKdtId, pageRequest, query) {
    return this.invoke('findAppointmentPageV2', [operatorKdtId, pageRequest, query]);
  }

  /**
   * 获取课节看板
   *
   * @see http://zanapi.qima-inc.com/site/service/view/359053
   *
   * @param {number} kdtId - 店铺 id
   * @param {Object} query - 查询参数
   * @param {number} query.startTime - 开始时间
   * @param {number} query.endTime - 结束时间
   * @param {string} query.eduCourseName - 教务课程名称
   * @param {string} query.lessonName -课节名称
   * @param {string} query.classNo - 班级编号
   * @param {string} query.classroomNo - 教室编号
   * @param {string} query.teacherNo - 老师编号
   * @param {number} query.addressId - 网店地点
   * @param {1|2} query.appointRule - 预约规则: 1:需预约,2:不需
   * @return {Promise}
   */
  async findKanBanList(kdtId, query) {
    return this.invoke('findKanBanList', [kdtId, query]);
  }
  /**
   * 分页查询课节
   *
   * @see http://zanapi.qima-inc.com/site/service/view/356548
   *
   * @param {number} kdtId - 店铺 id
   * @param {Object} pageRequest - 分页信息
   * @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   * @param {number} pageRequest.pageNumber - 页码
   * @param {number} pageRequest.pageSize - 页数
   * @param {{orders:[]}} pageRequest.sort - 排序
   * @param {Object} query - 查询参数
   * @param {number} query.startTime - 开始时间
   * @param {number} query.endTime - 结束时间
   * @param {string} query.eduCourseName - 教务课程名称
   * @param {string} query.lessonName -课节名称
   * @param {string} query.classNo - 班级编号
   * @param {string} query.classroomNo - 教室编号
   * @param {string} query.teacherNo - 老师编号
   * @param {number} query.addressId - 网店地点
   * @param {1|2} query.appointRule - 预约规则: 1:需预约,2:不需
   * @return {Promise}
   */
  async findPageByCondition(kdtId, pageRequest, query) {
    return this.invoke('findPageByCondition', [kdtId, pageRequest, query]);
  }

  /**
   * 删除排课
   *
   * @see http://zanapi.qima-inc.com/site/service/view/356546
   *
   * @param {number} kdtId
   * @param {Object} command - 更新实体
   * @param {string} command.lessonNo - 课节编号
   * @param {number} command.scheduleId - 日程id
   * @param {1|2} command.operateType - 编辑类型 1：此日程 2：此日程和后续日程
   */
  async deleteLesson(kdtId, command) {
    return this.invoke('deleteLesson', [kdtId, command]);
  }

  /**
   * 获取排课信息
   *
   * @see http://zanapi.qima-inc.com/site/service/view/351186
   * @param {*} kdtId
   * @param {*} lessonNo
   * @memberof LessonFacadeService
   */
  async getLessonDetail(kdtId, lessonNo) {
    return this.invoke('getLessonDetail', [kdtId, lessonNo]);
  }

  /**
   *  获取课节详细信息，支持连锁
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/425238
   *
   *  @param {number} operatorKdtId - 店铺id
   *  @param {Object} lessonNoQuery - 课节编号
   *  @param {string} lessonNoQuery.lessonNo - 课节编号
   *  @param {number} lessonNoQuery.kdtId - 校区店铺id
   *  @return {Promise}
   */
  async getLessonDetailV2(operatorKdtId, lessonNoQuery) {
    return this.invoke('getLessonDetailV2', [operatorKdtId, lessonNoQuery]);
  }

  /**
   * 获取排课信息
   *
   * @see http://zanapi.qima-inc.com/site/service/view/356545
   * @param {*} kdtId
   * @param {*} command
   * @memberof LessonFacadeService
   */
  async updateSchedule(kdtId, command) {
    return this.invoke('updateLessonV2', [kdtId, command]);
  }

  /**
   *  新增预约获取有日程日期
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/693914
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} query - 课节编号
   *  @param {number} query.courseType - 课程类型 0：体验课 1：正式课
   *  @param {number} query.startTime - 开始时间
   *  @param {number} query.eduCourseId - 教务课程名称
   *  @param {number} query.endTime - 结束时间
   *  @param {Object} query.studentAsset - 学员资产（正式课时需要传）
   *  @param {number} query.addressId - 网店id
   *  @return {Promise}
   */
  async findAppointmentDateList(kdtId, query) {
    return this.invoke('findAppointmentDateList', [kdtId, query]);
  }

  /**
   *  新增预约获取有日程日期
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/391089
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} query - 课节编号
   *  @param {number} query.courseType - 课程类型 0：体验课 1：正式课
   *  @param {number} query.startTime - 开始时间
   *  @param {number} query.eduCourseId - 教务课程名称
   *  @param {number} query.endTime - 结束时间
   *  @param {Object} query.studentAsset - 学员资产（正式课时需要传）
   *  @param {number} query.addressId - 网店id
   *  @return {Promise}
   */
  async findAppointmentDateListV2(kdtId, query) {
    return this.invoke('findAppointmentDateListV2', [kdtId, query]);
  }

  /**
   *  新增预约获取有日程地址
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/375179
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} query - 课节编号
   *  @param {number} query.courseType - 课程类型 0：体验课 1：正式课
   *  @param {number} query.startTime - 开始时间
   *  @param {number} query.eduCourseId - 教务课程名称
   *  @param {number} query.endTime - 结束时间
   *  @param {Object} query.studentAsset - 学员资产（正式课时需要传）
   *  @param {number} query.addressId - 网店id
   *  @return {Promise}
   */
  async findAppointmentAddressList(kdtId, query) {
    return this.invoke('findAppointmentAddressListV2', [kdtId, query]);
  }

  /**
               *  按周资源视图
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/568888
  *
               *  @param {number} operatorKdtId - 店铺id
               *  @param {Object} pageRequest -
               *  @param {number} pageRequest.pageNumber -
               *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
               *  @param {number} pageRequest.pageSize -
               *  @param {Object} pageRequest.sort -
               *  @param {Object} query - 查询实体
               *  @param {string} query.classroomNo - 教室编号
               *  @param {number} query.appointRule - 预约规则
   1：学员预约后才可上课
   2：学员无需预约即可上课
               *  @param {number} query.kdtId - 店铺id
               *  @param {string} query.classNo - 班级编号
               *  @param {number} query.startTime - 开始时间
               *  @param {number} query.endTime - 结束时间
               *  @param {string} query.teacherNo - 老师编号
               *  @param {string} query.eduCourseName - 教务课程名称
               *  @param {number} query.resourceType - 资源类型
               *  @param {string} query.lessonName - 课节名称
               *  @param {number} query.addressId - 网店id
               *  @return {Promise}
               */
  async findResourceKanBanPage(operatorKdtId, pageRequest, query) {
    return this.invoke('findResourceKanBanPage', [
      operatorKdtId,
      pageRequest,
      query,
    ]);
  }

  /**
   *  批量删除课节
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/757123
   *
   *  @param {number} kdtId -
   *  @param {Object} lessonBatchDeleteCommand -
   *  @param {Array.<Object>} lessonBatchDeleteCommand.lessonDeleteModelList[] - 删除课节列表
   *  @param {Object} lessonBatchDeleteCommand.operator - 操作人信息
   *  @return {Promise}
   */
  async batchDeleteLesson(kdtId, lessonBatchDeleteCommand) {
    return this.invoke('batchDeleteLesson', [kdtId, lessonBatchDeleteCommand]);
  }
}

module.exports = LessonService;
