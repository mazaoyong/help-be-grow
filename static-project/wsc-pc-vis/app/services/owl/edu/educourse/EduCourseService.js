const BaseService = require('../../../base/BaseService');

/**
 * @class 教务课程服务接口
 */
class EduCourseService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.educourse.EduCourseFacade';
  }

  /**
   *  教务课程分页查询
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/351176
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页参数
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} eduCourseQuery - 查询实体
   *  @param {number} eduCourseQuery.kdtId - 店铺id
   *  @param {string} eduCourseQuery.name - 课程名称
   *  @param {number} eduCourseQuery.teachType - 授课方式
   *  @return {Promise}
   */
  async findPageByCondition(kdtId, pageRequest, eduCourseQuery) {
    return this.invoke('findPageByCondition', [kdtId, pageRequest, eduCourseQuery]);
  }

  /**
  *  创建教务课程
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/351172
  *
  *  @param {number} kdtId - 店铺id
  *  @param {Object} command - 创建实体
  *  @param {number} command.applyType - 适用年龄类型
  1：月龄
  2：年龄
  *  @param {number} command.minApply - 最小适用
  *  @param {number} command.maxApply - 最大适用
  *  @param {string} command.name - 课程名称
  *  @param {number} command.teachType - 授课方式
  1：班课
  2：一对一
  *  @return {Promise}
  */
  async createEduCourse(kdtId, command) {
    return this.invoke('createEduCourse', [kdtId, command]);
  }

  /**
   *  创建教务课程
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/351173
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} command - 编辑实体
   *  @param {number} command.applyType - 适用年龄类型
   *  @param {number} command.minApply - 最小适用
   *  @param {number} command.maxApply - 最大适用
   *  @param {string} command.name - 课程名称
   *  @param {number} command.id - id
   *  @return {Promise}
   */
  async updateEduCourse(kdtId, command) {
    return this.invoke('updateEduCourse', [kdtId, command]);
  }

  /**
   *  查询指定教务课程
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/351175
   *
   *  @param {number} kdtId - 店铺id
   *  @param {number} id - id
   *  @return {Promise}
   */
  async getById(kdtId, id) {
    return this.invoke('getById', [kdtId, id]);
  }

  /**
   *  删除教务课程
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/351174
   *
   *  @param {number} kdtId - 店铺id
   *  @param {number} id - id
   *  @return {Promise}
   */
  async deleteEduCourse(kdtId, id) {
    return this.invoke('deleteEduCourse', [kdtId, id]);
  }

  /**
   *  验证课程名称是否重复
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/419728
   *
   *  @param {number} kdtId - 店铺id
   *  @param {number} eduCourseId - 课程id，编辑的时候需要传，新建的时候不用传
   *  @param {string} eduCourseName - 需要检测的课程名称
   *  @return {Promise}
   */
  async checkEduCourseNameRepeat(kdtId, eduCourseId, eduCourseName) {
    return this.invoke('checkEduCourseNameRepeat', [
      kdtId,
      eduCourseId,
      eduCourseName,
    ]);
  }
}

module.exports = EduCourseService;
