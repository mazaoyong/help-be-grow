const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.pc.api.lesson.LessonFacade */
class LessonFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.lesson.LessonFacade';
  }

  /**
   * 获取课节看板 V2 添加老师，助教列表查询
   * @link http://zanapi.qima-inc.com/site/service/view/1056137
   * @param {number} kdtId -
   * @param {Object} query - 排课管理课节列表查询实体
   * @param {number} query.kdtId - 店铺id
   * @param {Array} query.assistantNos - 助教编号
   * @param {string} query.operatorName - 导出订单的操作人的姓名
   * @param {Array} query.teacherNos - 老师编号
   * @param {Object} query.operator - 操作人
   * @param {string} query.lessonName - 课节名称
   * @param {number} query.addressId - 网店id
   * @param {string} query.classroomNo - 教室编号
   * @param {number} query.appointRule - 预约规则
   *  1：学员预约后才可上课
   *  2：学员无需预约即可上课
   * @param {string} query.classNo - 班级编号
   * @param {number} query.startTime - 开始时间
   * @param {number} query.endTime - 结束时间
   * @param {string} query.eduCourseName - 教务课程名称
   * @param {string} query.operatorMobile - 导出订单的操作人的电话
   * @return {Promise}
   */
  async findKanBanListV2(kdtId, query) {
    return this.invoke('findKanBanListV2', [kdtId, query]);
  }

  /**
   * 按周资源视图 V2 添加老师，助教列表查询
   * @link http://zanapi.qima-inc.com/site/service/view/1056158
   * @param {number} operatorKdtId -
   * @param {Object} pageRequest - 分页请求
   * @param {number} pageRequest.pageNumber -
   * @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   * @param {number} pageRequest.pageSize -
   * @param {Object} pageRequest.sort -
   * @param {Object} query - Description:
   * @param {number} query.kdtId - 店铺id
   * @param {Array} query.assistantNos - 助教编号
   * @param {number} query.isTrial - 是否试听日程
   * @param {Array} query.teacherNos - 老师编号
   * @param {string} query.lessonName - 课节名称
   * @param {number} query.addressId - 网店id
   * @param {string} query.classroomNo - 教室编号
   * @param {number} query.appointRule - 预约规则
   *  1：学员预约后才可上课
   *  2：学员无需预约即可上课
   * @param {string} query.classNo - 班级编号
   * @param {number} query.startTime - 开始时间
   * @param {number} query.endTime - 结束时间
   * @param {string} query.eduCourseName - 教务课程名称
   * @param {number} query.resourceType - 资源类型
   * @return {Promise}
   */
  async findResourceKanBanPageV2(operatorKdtId, pageRequest, query) {
    return this.invoke('findResourceKanBanPageV2', [operatorKdtId, pageRequest, query]);
  }
}

module.exports = LessonFacade;
