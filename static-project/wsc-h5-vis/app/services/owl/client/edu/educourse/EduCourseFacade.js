const BaseService = require('../../../../base/BaseService');
/* com.youzan.owl.api.client.edu.educourse.EduCourseFacade -  */
class EduCourseFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.edu.educourse.EduCourseFacade';
  }

  /**
   *  教务课程分页查询
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/466709
   *
   *  @param {number} operatorKdtId - 店铺id
   *  @param {Object} pageRequest - 分页参数
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} eduCourseQuery - 查询实体
   *  @param {number} eduCourseQuery.applicableCampusType - 是否是全部校区,0:部分校区1:全部校区
   *  @param {number} eduCourseQuery.kdtId - 店铺id
   *  @param {string} eduCourseQuery.name - 课程名称
   *  @param {number} eduCourseQuery.teachType - 授课方式
   *  @param {Array.<Array>} eduCourseQuery.eduCourseIds[] - 课程id列表
   *  @return {Promise}
   */
  async findPageByCondition(operatorKdtId, pageRequest, eduCourseQuery) {
    return this.owlInvoke('findPageByCondition', [
      operatorKdtId,
      pageRequest,
      eduCourseQuery,
    ]);
  }
}

module.exports = EduCourseFacade;
