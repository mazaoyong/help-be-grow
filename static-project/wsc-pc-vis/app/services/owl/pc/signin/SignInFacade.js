const BaseService = require('../../../base/BaseService');

/**
 * com.youzan.owl.pc.api.signin.SignInFacade
 * */
class SignInService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.signin.SignInFacade';
  }

  /**
   *  机构小程序对学员进行签到
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/726326
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} businessBatchSignInCommand - 签到参数
   *  @param {number} businessBatchSignInCommand.signInType - 签到类型 0 到课 1 请假 2 旷课
   *  @param {string} businessBatchSignInCommand.lessonNo - 机构课表编号，待签到全部标记为已签到的时候需要用
   *  @param {number} businessBatchSignInCommand.kdtId - 校区店铺id
   *  @param {boolean} businessBatchSignInCommand.signInAllStudents - 是否为所有学员签到
   *  @param {number} businessBatchSignInCommand.operatorId - 操作人id
   *  @param {Array.<Array>} businessBatchSignInCommand.studentLessonNos[] - 学员课表编号
   *  @param {Object} businessBatchSignInCommand.operator - 操作人
   *  @return {Promise}
   */
  async businessBatchSignInV2(kdtId, businessBatchSignInCommand) {
    return this.invoke('businessBatchSignInV2', [
      kdtId,
      businessBatchSignInCommand,
    ]);
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
   *  商家小程序端 分页查询添加日程时的学员列表信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/707435
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页查询条件
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query - 查询参数
   *  @param {string} query.lessonNo - 机构课表编号
   *  @param {string} query.studentNameOrPhone - 学员或手机号，模糊查询
   *  @param {number} query.kdtId - 校区店铺id
   *  @param {number} query.eduCourseId - 课程id
   *  @param {Object} query.operator - 操作人
   *  @return {Promise}
   */
  async findStudentsPageForAddToSignInV2(kdtId, pageRequest, query) {
    return this.invoke('findStudentsPageForAddToSignInV2', [
      kdtId,
      pageRequest,
      query,
    ]);
  }

  /**
   *  添加学员到日程
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/707437
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} addCommand - 添加学员参数
   *  @param {string} addCommand.lessonNo - 机构课表编号
   *  @param {number} addCommand.kdtId - 校区店铺id
   *  @param {Array.<Object>} addCommand.studentAndAssets[] - 学员手机号
   *  @param {number} addCommand.operatorId - 操作人id
   *  @param {Object} addCommand.operator - 操作人
   *  @return {Promise}
   */
  async addStudentsV2(kdtId, addCommand) {
    return this.invoke('addStudentsV2', [kdtId, addCommand]);
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
  async findStudentsV3(kdtId, pageRequest, studentsInLessonQuery) {
    return this.invoke('findStudentsV3', [
      kdtId,
      pageRequest,
      studentsInLessonQuery,
    ]);
  }
}

module.exports = SignInService;
