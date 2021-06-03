const BaseService = require('../../../base/BaseService');

/**
 * b端预约相关
 */
class AppointmentService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.edu.api.appointment.BusinessAppointmentFacade';
  }

  /**
   *  B端机构查询学生课表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/347455
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
   *  @param {string} studentLessonQuery.startTime - 搜索开始时间
   *  @param {string} studentLessonQuery.contractName - 课节名称
   *  @param {string} studentLessonQuery.endTime - 搜索结束时间
   *  @param {string} studentLessonQuery.customerName - 预约客户姓名,根据学员id去查他所对应的客户
   *  @param {string} studentLessonQuery.phoneNo - 手机号
   *  @param {number} studentLessonQuery.status - 学生课表状态
   *  @return {Promise}
   */
  async findStudentLessons(kdtId, pageRequest, studentLessonQuery) {
    return this.invoke('findStudentLessons', [kdtId, pageRequest, studentLessonQuery]);
  }

  /**
   *  B端查看预约看板
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/356544
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} studentLessonQuery - 筛选条件
   *  @param {number} studentLessonQuery.courseType - 线下课类型 0 体验课  1 正式课
   *  @param {number} studentLessonQuery.appointmentSource - 预约来源 2 线上预约 3 手动录入
   *  @param {string} studentLessonQuery.address - 上课地点
   *  @param {string} studentLessonQuery.teacherName - 教师名
   *  @param {string} studentLessonQuery.startTime - 搜索开始时间
   *  @param {string} studentLessonQuery.contractName - 课节名称
   *  @param {string} studentLessonQuery.endTime - 搜索结束时间
   *  @param {string} studentLessonQuery.customerName - 预约客户姓名,根据学员id去查他所对应的客户
   *  @param {string} studentLessonQuery.phoneNo - 手机号
   *  @param {number} studentLessonQuery.status - 学生课表状态
   *  @return {Promise}
   */
  async findForAppointmentKanBan(kdtId, studentLessonQuery) {
    return this.invoke('findForAppointmentKanBan', [kdtId, studentLessonQuery]);
  }

  /**
   *  创建学生课表，就是在用户合约中增加一条记录关联到机构课表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/356542
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} studentLessonAppointmentCommand - 学生课表创建请求
   *  @param {number} studentLessonAppointmentCommand.studentId - 学员id
   *  @param {number} studentLessonAppointmentCommand.courseType - 预约的课程类型 0 体验课 1 正式课
   *  @param {string} studentLessonAppointmentCommand.lessonNo - 机构课程标识
   *  @param {string} studentLessonAppointmentCommand.comment - 用户或商家填写的备注
   *  @param {string} studentLessonAppointmentCommand.assetNo - 预约正式课时，选择的资产编号
   *  @param {number} studentLessonAppointmentCommand.operatorId - 预约人id
   *  @return {Promise}
   */
  async createStudentLesson(kdtId, studentLessonAppointmentCommand) {
    return this.invoke('createStudentLessonV2', [kdtId, studentLessonAppointmentCommand]);
  }

  /**
   *  体验课确认预约，修改学生课表关联的机构课表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/356541
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} studentLessonConfirmCommand - 确认学生课表关联的机构课表
   *  @param {string} studentLessonConfirmCommand.studentLessonNo - 学生课表编号
   *  @param {string} studentLessonConfirmCommand.lessonNo - 选择的或新建的课程课表编号
   *  @param {string} studentLessonConfirmCommand.comment - 确认学员预约时填写的备注
   *  @return {Promise}
   */
  async confirmStudentLesson(kdtId, studentLessonConfirmCommand) {
    return this.invoke('confirmStudentLesson', [kdtId, studentLessonConfirmCommand]);
  }

  /**
   *  查询学员课表详情，用于体验课的确认预约
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/348307
   *
   *  @param {number} kdtId - 店铺id
   *  @param {string} studentLessonNo - 体验课创建的学员课表编号
   *  @return {Promise}
   */
  async getStudentLessonConfirmInfo(kdtId, studentLessonNo) {
    return this.invoke('getStudentLessonConfirmInfo', [kdtId, studentLessonNo]);
  }

  /**
   *  查询学员课表详情，用于体验课的确认预约
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/425132
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} studentLessonNoQuery - 体验课创建的学员课表编号
   *  @param {string} studentLessonNoQuery.studentLessonNo - 学员课表编号
   *  @param {number} studentLessonNoQuery.kdtId - 校区店铺id
   *  @return {Promise}
   */
  async getStudentLessonConfirmInfoV2(kdtId, studentLessonNoQuery) {
    return this.invoke('getStudentLessonConfirmInfoV2', [
      kdtId,
      studentLessonNoQuery,
    ]);
  }

  /**
   *  取消学员的预约，即修改学员课表为已取消
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/348310
   *
   *  @param {number} kdtId - 店铺id
   *  @param {string} studentLessonNo - 待取消的学员课表编号
   *  @param {string} operatorId - 操作id
   *  @return {Promise}
   */
  async cancel(kdtId, studentLessonNo, operatorId) {
    return this.invoke('cancel', [kdtId, studentLessonNo, operatorId]);
  }

  /**
   *  取消学员的预约，即修改学员课表为已取消，支持连锁
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/425136
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} studentLessonCancelCommand - 取消学员课表参数
   *  @param {string} studentLessonCancelCommand.studentLessonNo - 学员课表编号
   *  @param {number} studentLessonCancelCommand.kdtId - 校区店铺id
   *  @param {number} studentLessonCancelCommand.operatorId - 操作人id
   *  @return {Promise}
   */
  async cancelV2(kdtId, studentLessonCancelCommand) {
    return this.invoke('cancelV2', [kdtId, studentLessonCancelCommand]);
  }
}

module.exports = AppointmentService;
