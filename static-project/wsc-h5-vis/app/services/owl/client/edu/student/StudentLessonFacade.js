const BaseService = require('../../../../base/BaseService');

class StudentLessonFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.edu.student.StudentLessonFacade';
  }

  /**
   *  查询一段时间内是否有上课记录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/351532
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {number} query.kdtId -
   *  @param {string} query.startTime - 开始时间
   *  @param {string} query.endTime - 结束时间
   *  @param {number} query.userId -
   *  @param {number} query.studentId -
   *  @return {Promise}
   */
  async findStudentValidRecordList(kdtId, query) {
    return this.invoke('findStudentValidRecordList', [kdtId, query]);
  }

  /**
   *  查询某天的上课记录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/357964
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {number} query.kdtId -
   *  @param {string} query.startTime - 开始时间
   *  @param {string} query.endTime - 结束时间
   *  @param {number} query.userId -
   *  @return {Promise}
   */
  async findStudentLessonByDate(kdtId, query) {
    return this.invoke('findStudentLessonByDate', [kdtId, query]);
  }

  /**
   *  学习记录 查询用户上课记录的基本信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/357962
   *
   *  @param {number} kdtId -
   *  @param {number} userId -
   *  @return {Promise}
   */
  async findStudentRecordById(kdtId, userId) {
    return this.invoke('findStudentRecordById', [kdtId, userId]);
  }

  /**
   *  查询指定学员指定课程的上课记录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/357627
   *  查询指定学员指定课程的上课记录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/357961
   *
   *  @param {number} kdtId -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query -
   *  @param {number} query.studentId - 学员id
   *  @param {string} query.endDate -
   *  @param {number} query.eduCourseId - 教务课程id
   *  @param {string} query.startDate -
   *  @return {Promise}
   */
  async findPageLessonRecord(kdtId, pageRequest, query) {
    return this.invoke('findPageLessonRecord', [kdtId, pageRequest, query]);
  }

  /**
   *  查询指定学员指定课程的上课记录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/662554
   *
   *  @param {number} kdtId -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query -
   *  @param {number} query.studentId - 学员id
   *  @param {string} query.endDate -
   *  @param {number} query.eduCourseId - 教务课程id
   *  @param {string} query.startDate -
   *  @return {Promise}
   */
  async findPageLessonRecordV2(kdtId, pageRequest, query) {
    return this.invoke('findPageLessonRecordV2', [kdtId, pageRequest, query]);
  }

  /**
             *  查询冻结了课时的学员课表，用于将学员移除日程

 注意：必须是课时资产
*  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/707499
*
             *  @param {number} kdtId -
             *  @param {Object} pageRequest -
             *  @param {number} pageRequest.pageNumber -
             *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
             *  @param {number} pageRequest.pageSize -
             *  @param {Object} pageRequest.sort -
             *  @param {Object} query -
             *  @param {Array.<Array>} query.assetNos[] - 资产编号
             *  @param {number} query.kdtId - 校区店铺ID
             *  @param {string} query.startTime - 开始时间
             *  @param {string} query.endTime - 结束时间
             *  @return {Promise}
             */
  async findLockedPage(kdtId, pageRequest, query) {
    return this.invoke('findLockedPage', [kdtId, pageRequest, query]);
  }
}

module.exports = StudentLessonFacade;
