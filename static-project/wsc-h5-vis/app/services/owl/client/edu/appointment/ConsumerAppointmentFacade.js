const BaseService = require('../../../../base/BaseService');

class ConsumerAppointmentFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.edu.appointment.ConsumerAppointmentFacade';
  }

  /**
   *  查询用户可预约的课表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/353168
   *
   *  @param {number} kdtId - 店铺id
   *  @param {number} customerId - 客户id
   *  @return {Promise}
   */
  async findAppointmentLessons(kdtId, customerId) {
    return this.owlInvoke('findAppointmentLessons', [kdtId, customerId]);
  }

  /**
   *  根据筛选条件，查询时间范围内学员资产所对应的课程的机构课表，返回课表所在的日期，用于在日历板上打点
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/347451
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} query - 机构课表所在日期
   *  @param {string} query.startTime - 查询时间范围开始时间
   *  @param {string} query.endTime - 查询时间范围结束时间
   *  @param {number} query.userId - 学员id
   *  @param {number} query.courseId - 线下课id
   *  @return {Promise}
   */
  async findLessonDate(kdtId, query) {
    return this.owlInvoke('findLessonDate', [kdtId, query]);
  }

  /**
   *  查询具体某一天的机构课表及学员已预约的课表，可以通过条件进行筛选
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/348519
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query - 筛选条件
   *  @param {string} query.startTime - 查询时间范围开始时间
   *  @param {string} query.endTime - 查询时间范围结束时间
   *  @param {number} query.userId - 学员id
   *  @param {number} query.courseId - 线下课id
   *  @return {Promise}
   */
  async findDailyLessons(kdtId, pageRequest, query) {
    return this.owlInvoke('findDailyLessons', [kdtId, pageRequest, query]);
  }

  /**
   *  创建一条预约记录，即创建一条学生课表记录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/347453
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} appointmentCommand - 学生课表创建类
   *  @param {number} appointmentCommand.studentId - 学员id
   *  @param {string} appointmentCommand.lessonNo - 机构课程标识
   *  @param {string} appointmentCommand.comment - 用户或商家填写的备注
   *  @return {Promise}
   */
  async createStudentLesson(kdtId, appointmentCommand) {
    return this.owlInvoke('createStudentLesson', [kdtId, appointmentCommand]);
  }

  /**
   *  取消一条预约记录，即删除一条学生课表记录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/365754
   *
   *  @param {number} kdtId - 店铺id
   *  @param {string} studentLessonNo - 学生课表编号
   *  @param {number} operatorId - 操作人id
   *  @return {Promise}
   */
  async cancelStudentLesson(kdtId, studentLessonNo, operatorId) {
    return this.owlInvoke('cancelStudentLesson', [
      kdtId,
      studentLessonNo,
      operatorId,
    ]);
  }

  /**
   *  查询用户课表详细信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/347450
   *
   *  @param {number} kdtId - 店铺id
   *  @param {string} studentLessonNo - 用户课表编号
   *  @return {Promise}
   */
  async getStudentLessonDetail(kdtId, studentLessonNo) {
    return this.owlInvoke('getStudentLessonDetailV2', [kdtId, studentLessonNo]);
  }

  /**
   *  C端用户查询自己的预约记录，即学生课表记录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/348516
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页参数
   *  @param {number} pageRequest.pageNumber -
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} studentLessonQuery - 预约的用户课表查询参数
   *  @param {string} studentLessonQuery.startTime - 查询的开始时间
   *  @param {string} studentLessonQuery.endTime - 查询的结束时间
   *  @param {number} studentLessonQuery.userId - 用户id
   *  @return {Promise}
   */
  async findStudentLessons(kdtId, pageRequest, studentLessonQuery) {
    return this.owlInvoke('findStudentLessons', [
      kdtId,
      pageRequest,
      studentLessonQuery,
    ]);
  }

  /**
   *  预约结果页，查询预约信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/351395
   *
   *  @param {number} kdtId - 店铺id
   *  @param {string} studentLessonNo - 学员课表编号
   *  @return {Promise}
   */
  async getAppointmentResult(kdtId, studentLessonNo) {
    return this.owlInvoke('getAppointmentResult', [kdtId, studentLessonNo]);
  }

  /**
   *  预约结果页，查询预约信息,支持连锁
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/427187
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} studentLessonNo - 学员课表编号
   *  @param {string} studentLessonNo.studentLessonNo - 学员课表编号
   *  @param {number} studentLessonNo.kdtId - 校区店铺id
   *  @return {Promise}
   */
  async getAppointmentResultV2(kdtId, studentLessonNo) {
    return this.owlInvoke('getAppointmentResultV2', [kdtId, studentLessonNo]);
  }

  /**
   *  下单页面查询可预约日程看板打点
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/454168
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} query - 查询条件
   *  @param {number} query.studentId - 学员id
   *  @param {number} query.kdtId - 店铺id
   *  @param {string} query.startTime - 查询开始时间
   *  @param {string} query.endTime - 查询结束时间
   *  @param {number} query.skuId - skuId
   *  @param {string} query.productAlias - 商品别名
   *  @return {Promise}
   */
  async findLessonDateForOrderPage(kdtId, query) {
    return this.owlInvoke('findLessonDateForOrderPage', [kdtId, query]);
  }

  /**
   *  下单页面查询可预约日程列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/454169
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query - 查询条件
   *  @param {number} query.studentId - 学员id
   *  @param {number} query.kdtId - 店铺id
   *  @param {string} query.startTime - 查询开始时间
   *  @param {string} query.endTime - 查询结束时间
   *  @param {number} query.skuId - skuId
   *  @param {string} query.productAlias - 商品别名
   *  @return {Promise}
   */
  async findLessonForOrderPage(kdtId, pageRequest, query) {
    return this.owlInvoke('findLessonForOrderPage', [kdtId, pageRequest, query]);
  }

  /**
             *  创建学生课表，就是在用户合约中增加一条记录关联到机构课表

 v2版本改动：封装异常结果
*  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/707479
*
             *  @param {number} kdtId - 店铺id
             *  @param {Object} studentLessonAppointmentCommand - 学生课表创建请求
             *  @param {number} studentLessonAppointmentCommand.studentId - 学员id
             *  @param {number} studentLessonAppointmentCommand.courseType - 预约的课程类型 0 体验课 1 正式课
             *  @param {string} studentLessonAppointmentCommand.lessonNo - 机构课程标识
             *  @param {number} studentLessonAppointmentCommand.kdtId - 校区店铺id
             *  @param {string} studentLessonAppointmentCommand.comment - 用户或商家填写的备注
             *  @param {string} studentLessonAppointmentCommand.assetNo - 预约正式课时，选择的资产编号
             *  @param {number} studentLessonAppointmentCommand.operatorId - 预约人id
             *  @return {Promise}
             */
  async createStudentLessonV2(kdtId, studentLessonAppointmentCommand) {
    return this.invoke('createStudentLessonV2', [
      kdtId,
      studentLessonAppointmentCommand,
    ]);
  }

  /**
   *  批量取消预约记录，即批量删除学生课表记录,支持连锁
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/722311
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} command - 批量取消预约请求
   *  @param {number} command.kdtId - 校区店铺id
   *  @param {Array.<Array>} command.studentLessonNos[] - 学员课表编号list
   *  @param {Object} command.operator - 操作者信息
   *  @return {Promise}
   */
  async batchCancel(kdtId, command) {
    return this.invoke('batchCancel', [kdtId, command]);
  }
}

module.exports = ConsumerAppointmentFacade;
