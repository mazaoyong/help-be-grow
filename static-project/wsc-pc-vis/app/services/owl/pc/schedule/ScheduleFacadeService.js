const BaseService = require('../../../base/BaseService');

/**
 * 排课相关接口
 *
 * @class ScheduleFacadeService
 * @extends {BaseService}
 */
class ScheduleFacadeService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.schedule.ScheduleFacade';
  }

  /**
               *  创建排课日程V3版本
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/608567
  *
               *  @param {number} kdtId - 店铺id
               *  @param {Object} command - 创建实体
               *  @param {number} command.maxAppointNum - 上课人数
               *  @param {number} command.kdtId - 校区店铺id
               *  @param {Array.<Array>} command.assistantNos[] - 助教编号集合，教务优化v1.2项目支持助教多选
               *  @param {string} command.teacherNo - 教师编号
               *  @param {boolean} command.needValidateResource - 是否检查冲突
               *  @param {Object} command.filterConfig - 跳过节假日配置
               *  @param {Object} command.operator - 操作人
               *  @param {number} command.addressId - 门店地点id
               *  @param {string} command.classroomNo - 教室编号
               *  @param {number} command.appointRule - 预约规则
   1：学员预约后才可上课
   2：学员无需预约即可上课
               *  @param {string} command.assistantNo - 助教编号
               *  @param {string} command.classNo - 班级编号
               *  @param {string} command.name - 课节名称
               *  @param {number} command.eduCourseId - 教务课程id
               *  @param {number} command.consumeNum - 消耗课时数
               *  @param {Object} command.repeatConfig - 重复设置类型
               *  @return {Promise}
               */
  async createSchedule(kdtId, command) {
    return this.invoke('createScheduleV3', [kdtId, command]);
  }
}

module.exports = ScheduleFacadeService;
