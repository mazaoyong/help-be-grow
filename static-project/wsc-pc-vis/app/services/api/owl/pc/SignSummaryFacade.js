const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.pc.api.signin.SignSummaryFacade */
class SignSummaryFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.signin.SignSummaryFacade';
  }

  /**
   * 查询学员资产课时汇总
   * @link http://zanapi.qima-inc.com/site/service/view/1011868
   * @param {number} kdtId -
   * @param {Object} pageRequest - 分页请求
   * @param {number} pageRequest.pageNumber -
   * @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   * @param {number} pageRequest.pageSize -
   * @param {Object} pageRequest.sort -
   * @param {Object} query - 学员资产纬度课时汇总查询
   * @param {string} query.lessonEndTime - 上课结束时间
   * @param {string} query.courseName - 线下课名 TODO 该名字要不要去掉呢？？？待确认、班级要不要去掉呢？？？
   * @param {number} query.kdtId - 校区ID
   * @param {string} query.signInEndTime - 签到结束时间
   * @param {number} query.eduCourseId - 教务课程id
   *  连锁模式为总部教务课程id
   * @param {number} query.userId - 学员id
   * @param {string} query.lessonStartTime - 上课开始时间
   * @param {string} query.signInStartTime - 签到开始时间
   * @return {Promise}
   */
  async findAssetSignSummaryInfo(kdtId, pageRequest, query) {
    return this.invoke('findAssetSignSummaryInfo', [kdtId, pageRequest, query]);
  }

  /**
   * 查询学员课时汇总
   * @link http://zanapi.qima-inc.com/site/service/view/1011867
   * @param {number} kdtId -
   * @param {Object} pageRequest - 分页请求
   * @param {number} pageRequest.pageNumber -
   * @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   * @param {number} pageRequest.pageSize -
   * @param {Object} pageRequest.sort -
   * @param {Object} query - 学员纬度课时汇总查询
   * @param {string} query.lessonEndTime - 上课结束时间
   * @param {number} query.kdtId - 校区ID
   * @param {string} query.deductionStartTime - 扣减开始时间
   * @param {string} query.signInEndTime - 签到结束时间
   * @param {number} query.eduCourseId - 教务课程id
   *  连锁模式为总部教务课程id
   * @param {number} query.userId - 学员id
   * @param {string} query.lessonStartTime - 上课开始时间
   * @param {string} query.deductionEndTime - 扣减结束时间
   * @param {string} query.signInStartTime - 签到开始时间
   * @return {Promise}
   */
  async findStudentSignSummaryInfo(kdtId, pageRequest, query) {
    return this.invoke('findStudentSignSummaryInfo', [kdtId, pageRequest, query]);
  }

  /**
   * 导出学员课时汇总任务
   * @link http://zanapi.qima-inc.com/site/service/view/1014533
   * @param {number} kdtId -
   * @param {Object} query - 学员纬度课时汇总查询
   * @param {string} query.lessonEndTime - 上课结束时间
   * @param {number} query.kdtId - 校区ID
   * @param {string} query.deductionStartTime - 扣减开始时间
   * @param {string} query.signInEndTime - 签到结束时间
   * @param {number} query.eduCourseId - 教务课程id
   *  连锁模式为总部教务课程id
   * @param {number} query.userId - 学员id
   * @param {string} query.lessonStartTime - 上课开始时间
   * @param {string} query.deductionEndTime - 扣减结束时间
   * @param {string} query.signInStartTime - 签到开始时间
   * @return {Promise}
   */
  async exportStudentSignSummaryInfoTask(kdtId, query) {
    return this.invoke('exportStudentSignSummaryInfoTask', [kdtId, query]);
  }

  /**
   * 导出学员资产课时汇总 任务
   * @link http://zanapi.qima-inc.com/site/service/view/1014535
   * @param {number} kdtId -
   * @param {Object} query - 学员资产纬度课时汇总查询
   * @param {string} query.lessonEndTime - 上课结束时间
   * @param {number} query.kdtId - 校区ID
   * @param {string} query.deductionStartTime - 扣减开始时间
   * @param {number} query.userId - 学员id
   * @param {string} query.lessonStartTime - 上课开始时间
   * @param {string} query.registerStartTime - 报名开始时间
   * @param {string} query.signInStartTime - 签到开始时间
   * @param {number} query.classId - 班级ID
   * @param {number} query.courseStatus - 课程状态，1:已学完,2:未开始,3:进行中,4:已退课
   * @param {string} query.signInEndTime - 签到结束时间
   * @param {string} query.registerEndTime - 报名结束时间
   * @param {number} query.eduCourseId - 教务课程id
   *  连锁模式为总部教务课程id
   * @param {string} query.deductionEndTime - 扣减结束时间
   * @return {Promise}
   */
  async exportAssetSignSummaryInfoTask(kdtId, query) {
    return this.invoke('exportAssetSignSummaryInfoTask', [kdtId, query]);
  }

  /**
   * 课程汇总查询明细
   * @link http://zanapi.qima-inc.com/site/service/view/1015293
   * @param {number} kdtId -
   * @param {Object} query - undefined
   * @return {Promise}
   */
  async getAssetDetail(kdtId, query) {
    return this.invoke('getAssetDetail', [kdtId, query]);
  }
}

module.exports = SignSummaryFacade;
