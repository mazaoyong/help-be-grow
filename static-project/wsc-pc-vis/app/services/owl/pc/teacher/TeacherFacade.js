const BaseService = require('../../../base/BaseService');

/**
 * 教师
 */
class TeacherFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.teacher.TeacherFacade';
  }

  /**
   * 根据query条件查询教师列表
   *
   * @see http://zanapi.qima-inc.com/site/service/view/351631
   *
   * @param {number} kdtId - 店铺id
   * @param {Object} query - 查询条件
   * @param {string} query.keyword - 模糊搜索的关键词，搜老师昵称或者员工名字，可以不传
   * @param {0|1} query.source - 获取方式，0 自动，1 手动，需传 teacherIds
   * @param {number[]} query.teacherIds - 老师 ids
   */
  async find(kdtId, query) {
    return this.invoke('find', [kdtId, query]);
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

  /**
   *  查询某个店铺下的老师信息，不分页
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/532036
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {Array.<Array>} query.teacherIds[] - 老师id集合，不传表示查询所有
   *  @param {Array} query.teacherIds[] -
   *  @param {number} query.source - 获取方式0自动，1手动
   *  @param {string} query.keyword - 模糊搜索的关键词，搜老师昵称或者员工名字，可以不传
   *  @return {Promise}
   */
  async findTeachers(kdtId, query) {
    return this.invoke('findTeachers', [kdtId, query]);
  }

  /**
   *  分页查询 - 可选择是否只查有排课的老师
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/590283
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页条件
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query - 查询条件
   *  @param {number} query.hasLesson - 是否只查有排课的老师
                                        0：否
                                        1：是
   *  @param {number} query.kdtId - 店铺id
   *  @param {Array.<Array>} query.eduCourseIds[] - 线下课关联课程
   *  @param {string} query.keyword - 模糊搜索的关键词，搜老师昵称或者员工名字，可以不传
   *  @return {Promise}
   */
  async findCourseTeacherPage(kdtId, pageRequest, query) {
    return this.invoke('findCourseTeacherPage', [kdtId, pageRequest, query]);
  }
}

module.exports = TeacherFacade;
