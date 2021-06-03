const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.edu.api.educlass.EduClassFacade -  */class EduClassService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.edu.api.educlass.EduClassFacade';
  }

  /**
   *  分页查询班级信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/425160
   *
   *  @param {number} operatorKdtId -
   *  @param {Object} page -
   *  @param {number} page.pageNumber -
   *  @param {boolean} page.countEnabled - 是否开启count，默认为开启
   *  @param {number} page.pageSize -
   *  @param {Object} page.sort -
   *  @param {Object} query -
   *  @param {number} query.kdtId - 校区店铺id
   *  @param {string} query.eduClassName - 班级名称
   *  @param {number} query.classStatus - 班级状态
   *  @param {number} query.eduCourseId - 课程id
   *  @return {Promise}
   */
  async findEduClassByCondition(operatorKdtId, page, query) {
    return this.invoke('findEduClassByCondition', [operatorKdtId, page, query]);
  }
}

module.exports = EduClassService;
