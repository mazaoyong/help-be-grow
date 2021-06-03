const BaseService = require('../../../base/BaseService');

/**
 *  com.youzan.owl.pc.api.lesson.StudentLessonFacade
 * */
class StudentLessonService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.lesson.StudentLessonFacade';
  }

  /**
   *  获取一次课节的统计信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/359057
   *
   *  @param {number} kdtId - 店铺id
   *  @param {string} lessonNo - 课节编号
   *  @return {Promise}
   */
  async getStatisticalInfo(kdtId, lessonNo) {
    return this.invoke('getStatisticalInfo', [kdtId, lessonNo]);
  }

  /**
   *  获取一次课节的统计信息, 支持连锁
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/436220
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} lessonNoQuery - 课节编号查询参数
   *  @param {string} lessonNoQuery.lessonNo - 课节编号
   *  @param {number} lessonNoQuery.kdtId - 校区店铺id
   *  @return {Promise}
   */
  async getStatisticalInfoV2(kdtId, lessonNoQuery) {
    return this.invoke('getStatisticalInfoV2', [kdtId, lessonNoQuery]);
  }

  /**
   *  创建学员课表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/359056
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} command - 创建实体
   *  @param {string} command.lessonNo - 课节编号
   *  @param {Array.<Object>} command.studentAssets[] - 学员资产
   *  @param {integer} command.studentAssets[].studentId - 学员id
   *  @param {string} command.studentAssets[].assetNo - 资产编号
   *  @return {Promise}
   */
  async createStudentLesson(kdtId, command) {
    return this.invoke('createStudentLessonV2', [kdtId, command]);
  }

  /**
   *  获取一次课节的统计信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/359057
   *
   *  @param {number} kdtId - 店铺id
   *  @param {string} studentId - 学员Id
   *  @return {Promise}
   */
  async getStatisticalInfoByStudentId(kdtId, studentId) {
    return this.invoke('getRecordByStudentId', [kdtId, studentId]);
  }

  /**
   *  查询单个学生基本信息上课记录, 支持连锁
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/436341
   *
   *  @param {number} kdtId -
   *  @param {string} query -
   *  @return {Promise}
   */
  async getRecordByStudentIdV2(kdtId, query) {
    return this.invoke('getRecordByStudentIdV2', [kdtId, query]);
  }

  /**
   *  查询学员课表，用于查看将被删除的学员日程
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/707492
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页参数
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query - 查询参数
   *  @param {Array.<Array>} query.assetNos[] - 资产编号
   *  @param {number} query.kdtId - 校区店铺ID
   *  @param {string} query.startTime - 开始时间
   *  @param {string} query.endTime - 结束时间
   *  @return {Promise}
   */
  async findLittlePage(kdtId, pageRequest, query) {
    return this.invoke('findLittlePage', [kdtId, pageRequest, query]);
  }

  /**
  *  查询冻结了课时的学员课表，用于将学员移除日程

   注意：必须是课时资产
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/707493
  *
  *  @param {number} kdtId - 店铺id
  *  @param {Object} pageRequest - 分页参数
  *  @param {number} pageRequest.pageNumber -
  *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
  *  @param {number} pageRequest.pageSize -
  *  @param {Object} pageRequest.sort -
  *  @param {Object} query - 查询参数
  *  @param {Array.<Array>} query.assetNos[] - 资产编号
  *  @param {number} query.kdtId - 校区店铺ID
  *  @param {string} query.startTime - 开始时间
  *  @param {string} query.endTime - 结束时间
  *  @return {Promise}
  */
  async findLockedPage(kdtId, pageRequest, query) {
    return this.invoke('findLockedPage', [kdtId, pageRequest, query]);
  }

  /**
   *  批量取消学员课表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/713143
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} command - 取消参数
   *  @param {number} command.kdtId - 校区店铺id
   *  @param {Array.<Array>} command.studentLessonNos[] - 学员课表编号list
   *  @param {Object} command.operator - 操作者信息
   *  @return {Promise}
   */
  async batchCancel(kdtId, command) {
    return this.invoke('batchCancel', [kdtId, command]);
  }
}

module.exports = StudentLessonService;
