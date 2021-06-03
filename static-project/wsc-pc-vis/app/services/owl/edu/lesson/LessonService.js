const BaseService = require('../../../base/BaseService');

/**
 * 日程
 * @class LessonService
 * @extends {BaseService}
 */
class LessonService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.edu.api.lesson.LessonFacade';
  }

  /**
   *  获取一次课节的统计信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/351190
   *
   *  @param {number} kdtId - 店铺id
   *  @param {string} lessonNo - 课节编号
   *  @return {Promise}
   */
  async getKanBanDetail(kdtId, lessonNo) {
    return this.invoke('getKanBanDetail', [kdtId, lessonNo]);
  }

  /**
   *  获取一次课节详情，支持连锁
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/425242
   *
   *  @param {number} operatorKdtId - 店铺id
   *  @param {Object} lessonNoQuery - 课节编号
   *  @param {string} lessonNoQuery.lessonNo - 课节编号
   *  @param {number} lessonNoQuery.kdtId - 校区店铺id
   *  @return {Promise}
   */
  async getKanBanDetailV2(operatorKdtId, lessonNoQuery) {
    return this.invoke('getKanBanDetailV2', [operatorKdtId, lessonNoQuery]);
  }

  /**
               *  按周资源视图
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/568888
  *
               *  @param {number} operatorKdtId - 店铺id
               *  @param {Object} pageRequest -
               *  @param {number} pageRequest.pageNumber -
               *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
               *  @param {number} pageRequest.pageSize -
               *  @param {Object} pageRequest.sort -
               *  @param {Object} query - 查询实体
               *  @param {string} query.classroomNo - 教室编号
               *  @param {number} query.appointRule - 预约规则
   1：学员预约后才可上课
   2：学员无需预约即可上课
               *  @param {number} query.kdtId - 店铺id
               *  @param {string} query.classNo - 班级编号
               *  @param {number} query.startTime - 开始时间
               *  @param {number} query.endTime - 结束时间
               *  @param {string} query.teacherNo - 老师编号
               *  @param {string} query.eduCourseName - 教务课程名称
               *  @param {number} query.resourceType - 资源类型
               *  @param {string} query.lessonName - 课节名称
               *  @param {number} query.addressId - 网店id
               *  @return {Promise}
               */
  async findResourceKanBanPage(operatorKdtId, pageRequest, query) {
    return this.invoke('findResourceKanBanPage', [
      operatorKdtId,
      pageRequest,
      query,
    ]);
  }
}

module.exports = LessonService;
