const BaseService = require('../../../../base/BaseService');

/* com.youzan.owl.api.client.edu.teacher.TeacherFacade -  */
class TeacherFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.edu.teacher.TeacherFacade';
  }

  /**
   *  根据query条件查询教师列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/701620
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页条件
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query - 查询条件
   *  @param {number} query.kdtId - 店铺id
   *  @param {Array.<Array>} query.teacherIds[] - 老师id集合，不传表示查询所有
   *  @param {number} query.source - 获取方式0自动，1手动
   *  @param {string} query.keyword - 模糊搜索的关键词，搜老师昵称或者员工名字，可以不传
   *  @return {Promise}
   */
  async findPage(kdtId, pageRequest, query) {
    return this.invoke('findPage', [kdtId, pageRequest, query]);
  }
}

module.exports = TeacherFacade;
