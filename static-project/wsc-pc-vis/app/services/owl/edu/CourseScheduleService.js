const BaseService = require('../../base/BaseService');

/**
 * 预约相关 CourseScheduleService
 * @class CourseScheduleService
 * @extends {BaseService}
 */
class CourseScheduleService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.edu.api.courseschedule.CourseScheduleFacade';
  }

  /**
   *  分页查询预约/日程列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/217176
   *
   *  @param {Object} req - 查询列表参数
   *  @param {string} req.address - 上课地址
   *  @param {string} req.teacherName - 老师姓名
   *  @param {number} req.kdtId - 店铺id
   *  @param {number} req.searchEndDate - 搜索预约结束时间
   *  @param {string} req.orderBy - 排序字段
   *  @param {string} req.phoneNum - 手机号码
   *  @param {number} req.source - 日程来源
   *  @param {number} req.storeId - 商店Id
   *  @param {string} req.customerName - 客户姓名
   *  @param {number} req.searchStartDate - 搜索预约开始时间
   *  @param {string} req.courseName - 课程名称
   *  @param {number} req.size - 每页大小
   *  @param {string} req.studentName - 学员姓名
   *  @param {string} req.comment - 备注
   *  @param {number} req.page - 页数
   *  @param {string} req.order - 顺序
   *  @return {Promise.<Object>} 返回列表
   */
  async list(req) {
    return this.invoke('list', [req]);
  }

  /**
   *  新增预约/日程
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/217177
   *
   *  @param {Object} req - 新增预约参数
   *  @param {string} req.studentAlias - 课程别名
   *  @param {string} req.address - 上课的地址
   *  @param {string} req.teacherName - 老师姓名
   *  @param {number} req.kdtId - 店铺id
   *  @param {number} req.phoneNum - 客户手机号
   *  @param {number} req.source - 状态 1 购买体验课 2 预约体验课
   *  @param {number} req.storeId - 门店id
   *  @param {string} req.customerName - 客户姓名
   *  @param {string} req.courseName - 课程别名
   *  @param {number} req.teacherId - 老师姓名
   *  @param {number} req.appointmentTime - 预约时间
   *  @param {string} req.courseAlias - 课程别名
   *  @param {string} req.studentName - 学员姓名
   *  @param {number} req.customerUserId - 客户userId
   *  @param {string} req.comment - 备注
   *  @return {Promise.<Object>}
   */
  async create(req) {
    return this.invoke('create', [req]);
  }

  /**
   *  更新预约/日程
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/217179
   *
   *  @param {Object} req - 更新预约参数
   *  @param {string} req.studentAlias - 课程别名
   *  @param {string} req.address - 上课的地址
   *  @param {string} req.teacherName - 老师姓名
   *  @param {number} req.kdtId - 店铺id
   *  @param {number} req.phoneNum - 客户手机号
   *  @param {number} req.source - 状态 1 购买体验课 2 预约体验课
   *  @param {number} req.storeId - 门店id
   *  @param {string} req.customerName - 客户姓名
   *  @param {string} req.courseName - 课程别名
   *  @param {number} req.teacherId - 老师姓名
   *  @param {number} req.appointmentTime - 预约时间
   *  @param {string} req.courseAlias - 课程别名
   *  @param {string} req.studentName - 学员姓名
   *  @param {number} req.customerUserId - 客户userId
   *  @param {string} req.comment - 备注
   *  @param {number} req.id - 记录id
   *  @param {number} req.status - 状态 1 待确认 2 待上课 3 已上课 4 已取消
   *  @return {Promise.<Object>}
   */
  async update(req) {
    return this.invoke('update', [req]);
  }

  /**
   *  根据日程各种状态的数量
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/232855
   *
   *  @param {Object} req - 请求参数
   *  @param {string} req.address - 上课地址
   *  @param {string} req.teacherName - 老师姓名
   *  @param {number} req.kdtId - 店铺id
   *  @param {number} req.searchEndDate - 搜索预约结束时间
   *  @param {string} req.orderBy - 排序字段
   *  @param {string} req.phoneNum - 手机号码
   *  @param {number} req.source - 日程来源
   *  @param {number} req.storeId - 商店Id
   *  @param {string} req.customerName - 客户姓名
   *  @param {number} req.searchStartDate - 搜索预约开始时间
   *  @param {string} req.courseName - 课程名称
   *  @param {number} req.size - 每页大小
   *  @param {string} req.studentName - 学员姓名
   *  @param {string} req.comment - 备注
   *  @param {number} req.page - 页数
   *  @param {number} req.status - 状态 0 全部 1 待确认 2 待上课 3 已上课 4 已取消
   *  @param {string} req.order - 顺序
   *  @return {Object}
   */
  async countStatus(req) {
    return this.invoke('countStatus', [req]);
  }

  /**
   *  导出预约/日程数据
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/225190
   *
   *  @param {Object} req - 请求参数
   *  @param {string} req.address - 上课地址
   *  @param {string} req.teacherName - 老师姓名
   *  @param {number} req.kdtId - 店铺id
   *  @param {number} req.searchEndDate - 搜索预约结束时间
   *  @param {string} req.orderBy - 排序字段
   *  @param {string} req.phoneNum - 手机号码
   *  @param {number} req.source - 日程来源
   *  @param {number} req.storeId - 商店Id
   *  @param {string} req.operatorName - 导出订单的操作人的姓名
   *  @param {string} req.customerName - 客户姓名
   *  @param {number} req.searchStartDate - 搜索预约开始时间
   *  @param {string} req.courseName - 课程名称
   *  @param {number} req.size - 每页大小
   *  @param {string} req.studentName - 学员姓名
   *  @param {string} req.comment - 备注
   *  @param {number} req.page - 页数
   *  @param {string} req.operatorMobile - 导出订单的操作人的电话
   *  @param {number} req.status - 状态 0 全部 1 待确认 2 待上课 3 已上课 4 已取消
   *  @param {string} req.order - 顺序
   *  @return {Object}
   */
  async exportData(req) {
    return this.invoke('exportData', [req]);
  }

  /**
   *  获取预约/日程简要详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/221264
   *
   *  @param {integer} kdtId - 店铺id
   *  @param {integer} courseScheduleId - 服务id
   *  @return {Object}
   */
  async getSimpleCourseDetail(kdtId, courseScheduleId) {
    return this.invoke('getSimpleCourseDetail', [kdtId, courseScheduleId]);
  }

  /**
   *  获取预约/日程看板
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/217180
   *
   *  @param {Object} req -
   *  @param {number} req.searchStartDate - 搜索开始时间
   *  @param {number} req.kdtId - 店铺id
   *  @param {number} req.searchEndDate - 搜索结束时间
   *  @param {number} req.searchKey - 搜索Key 1 customerName 2 phoneNum 3 courseName 4 teacherName
   *  @param {string} req.searchValue - 搜索Value
   *  @return {Object}
   */
  async getCourseScheduleKanban(req) {
    return this.invoke('getCourseScheduleKanban', [req]);
  }
}

module.exports = CourseScheduleService;
