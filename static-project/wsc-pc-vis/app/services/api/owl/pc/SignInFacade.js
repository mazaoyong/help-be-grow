const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.pc.api.signin.SignInFacade */
class SignInFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.signin.SignInFacade';
  }

  /**
   *
   * B端查询签到记录汇总信息
   * @link http://zanapi.qima-inc.com/site/service/view/1029044
   * @param {number} kdtId -
   * @param {Object} signInRecordsQuery - Description : 签到记录查询参数
   * @param {string} signInRecordsQuery.lessonEndTime - 上课结束时间
   * @param {number} signInRecordsQuery.kdtId - 校区店铺id
   * @param {string} signInRecordsQuery.assetNo - 资产编号
   * @param {string} signInRecordsQuery.lessonStartTime - 上课开始时间
   * @param {number} signInRecordsQuery.userId - 学员id
   * @param {Object} signInRecordsQuery.operator - 操作人
   * @param {number} signInRecordsQuery.addressId - 网店id
   * @param {string} signInRecordsQuery.lessonName - 课节内容
   * @param {number} signInRecordsQuery.signInStatus - 签到状态
   * @param {number} signInRecordsQuery.courseSellType - 收费方式,0:自定义 1:按课时 2:按时间段 3:按期
   * @param {number} signInRecordsQuery.classId - 班级id
   * @param {number} signInRecordsQuery.teacherId - 老师id
   * @param {string} signInRecordsQuery.operateMobile - 操作人手机号码
   * @param {string} signInRecordsQuery.startTime - 签到开始时间
   * @param {string} signInRecordsQuery.endTime - 签到结束时间
   * @param {number} signInRecordsQuery.eduCourseId - 教务课程id
   *  连锁模式为总部教务课程id
   * @param {string} signInRecordsQuery.operateName - 操作人姓名
   * @return {Promise}
   */
  async findSignInBrieInfo(kdtId, signInRecordsQuery) {
    return this.invoke('findSignInBrieInfo', [kdtId, signInRecordsQuery]);
  }
  /**
   *  机构签到课程表看板查询某天的课表 V2 添加老师或助教查询
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1056274
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页条件
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} lessonsForSignInQuery - 查询条件
   *  @param {string} lessonsForSignInQuery.queryDate - 查询的日期
   *  @param {number} lessonsForSignInQuery.kdtId - 总部或校区kdtId
   *  @param {Array.<Array>} lessonsForSignInQuery.assistantIds[] - 助教id列表
   *  @param {Array.<Array>} lessonsForSignInQuery.teacherIds[] - 老师id列表
   *  @param {Object} lessonsForSignInQuery.operator - 操作人
   *  @return {Promise}
   */
  async findLessonsV2(kdtId, pageRequest, lessonsForSignInQuery) {
    return this.invoke('findLessonsV2', [kdtId, pageRequest, lessonsForSignInQuery]);
  }

  /**
   *  机构端查询有安排课程的日期，在课程看板上打点所用 V2 添加老师或助教查询
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1056272
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} lessonKanBan - 查询条件
   *  @param {Array.<Array>} lessonKanBan.assistantIds[] - 助教id列表
   *  @param {Array} lessonKanBan.assistantIds[] -
   *  @param {Array.<Array>} lessonKanBan.teacherIds[] - 老师id列表
   *  @param {Array} lessonKanBan.teacherIds[] -
   *  @param {string} lessonKanBan.startTime - 查询起始时间
   *  @param {string} lessonKanBan.endTime - 查询结束时间
   *  @return {Promise}
   */
  async findDateOfLessonKanBanV2(kdtId, lessonKanBan) {
    return this.invoke('findDateOfLessonKanBanV2', [kdtId, lessonKanBan]);
  }
}

module.exports = SignInFacade;
