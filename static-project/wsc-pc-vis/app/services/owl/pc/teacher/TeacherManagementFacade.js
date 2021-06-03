const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.pc.api.teacher.TeacherManagementFacade -  */
class TeacherManagementFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.teacher.TeacherManagementFacade';
  }

  /**
  *  老师查询
    包含数据统计（上课次数、实到人数、应到人数、消耗课时、试听学员）
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/450371
  *
  *  @param {number} kdtId -
  *  @param {Object} query -
  *  @param {string} query.endDate - 上课时间-结束时间
  *  @param {string} query.keyword - 老师名称、联系方式
  *  @param {string} query.startDate - 上课时间-开始时间
  *  @param {Object} pageRequest -
  *  @param {number} pageRequest.pageNumber -
  *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
  *  @param {number} pageRequest.pageSize -
  *  @param {Object} pageRequest.sort -
  *  @return {Promise}
  */
  async queryTeacherListWithStatistic(kdtId, query, pageRequest) {
    return this.invoke('queryTeacherListWithStatistic', [
      kdtId,
      query,
      pageRequest,
    ]);
  }

  /* com.youzan.owl.pc.api.teacher.TeacherManagementFacade -  */
  /**
   *  导出老师查询文件
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/450372
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {string} query.endDate - 上课时间-结束时间
   *  @param {string} query.keyword - 老师名称、联系方式
   *  @param {string} query.startDate - 上课时间-开始时间
   *  @return {Promise}
   */
  async exportTeacherListWithStatistic(kdtId, query) {
    return this.invoke('exportTeacherListWithStatistic', [kdtId, query]);
  }

  /**
  *  老师线下课列表查询
  走教育，库存走ic
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/450373
  *
  *  @param {number} kdtId -
  *  @param {Object} query -
  *  @param {string} query.courseTitle - 线下课名称
  *  @param {number} query.courseType - 线下课类型 null：全部  1：正式课
  *  @param {number} query.teacherNo - 老师资源编号
  *  @param {Object} pageRequest -
  *  @param {number} pageRequest.pageNumber -
  *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
  *  @param {number} pageRequest.pageSize -
  *  @param {Object} pageRequest.sort -
  *  @return {Promise}
  */
  async queryCourseList(kdtId, query, pageRequest) {
    return this.invoke('queryCourseList', [kdtId, query, pageRequest]);
  }

  /**
  *  老师线下课列表查询走教育，库存走ic
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/450374
  *
  *  @param {number} kdtId -
  *  @param {Object} query -
  *  @param {string} query.courseTitle - 线下课名称
  *  @param {number} query.courseType - 线下课类型 null：全部  1：正式课
  *  @param {number} query.teacherNo - 老师资源编号
  *  @return {Promise}
  */
  async exportCourseList(kdtId, query) {
    return this.invoke('exportCourseList', [kdtId, query]);
  }

  /**
   *  老师课表查询
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/450375
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {string} query.courseTitle - 课程名称
   *  @param {string} query.endDate - 上课时间-结束时间
   *  @param {number} query.teacherNo - 老师资源编号
   *  @param {string} query.startDate - 上课时间-开始时间
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @return {Promise}
   */
  async queryLessonList(kdtId, query, pageRequest) {
    return this.invoke('queryLessonList', [kdtId, query, pageRequest]);
  }

  /**
   *  老师课表导出
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/450376
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {string} query.courseTitle - 课程名称
   *  @param {string} query.endDate - 上课时间-结束时间
   *  @param {number} query.teacherNo - 老师资源编号
   *  @param {string} query.startDate - 上课时间-开始时间
   *  @return {Promise}
   */
  async exportLessonList(kdtId, query) {
    return this.invoke('exportLessonList', [kdtId, query]);
  }

  /**
     *  老师课表查询
     *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/458356
     *
     *  @param {number} kdtId -
     *  @param {Object} query -
     *  @param {string} query.courseTitle - 课程名称
     *  @param {string} query.endDate - 上课时间-结束时间
     *  @param {number} query.teacherNo - 老师资源编号
     *  @param {string} query.startDate - 上课时间-开始时间
     *  @param {Object} pageRequest -
     *  @param {number} pageRequest.pageNumber -
     *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
     *  @param {number} pageRequest.pageSize -
     *  @param {Object} pageRequest.sort -
     *  @return {Promise}
     */
  async queryTeacherLessonStatistics(kdtId, query) {
    return this.invoke('queryTeacherLessonStatistics', [
      kdtId,
      query,
    ]);
  }

  /**
   *  根据id查询教师信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/538759
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} teacherQuery -
   *  @param {number} teacherQuery.teacherId - 老师id
   *  @param {number} teacherQuery.targetKdtId - 目标kdtId
   *  @return {Promise}
   */
  async getTeacherById(kdtId, teacherQuery) {
    return this.invoke('getTeacherById', [kdtId, teacherQuery]);
  }
}

module.exports = TeacherManagementFacade;
