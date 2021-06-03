const BaseService = require('../../../base/BaseService');

/**
 * 查询资源相关接口
 *
 * @class ResourceFacadeService
 * @extends {BaseService}
 */
class ResourceFacadeService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.resource.ResourceFacade';
  }

  /**
   * 班级分页查询，带冲突检测
   *
   * @param {*} kdtId
   * @param {*} pageRequest
   * @param {*} eduCourseQuery
   * @memberof EduCourseFacadeService
   */
  async findClassConflict(kdtId, pageRequest, eduCourseQuery) {
    return this.invoke('findClassConflict', [kdtId, pageRequest, eduCourseQuery]);
  }

  /**
   * 分页查询老师助教信息（带冲突检测）
   *
   * @param {*} kdtId
   * @param {*} pageRequest
   * @param {*} query
   * @memberof ResourceFacadeService
   */
  async findTeacherConflict(kdtId, pageRequest, query) {
    return this.invoke('findTeacherConflict', [kdtId, pageRequest, query]);
  }

  /**
   * 分页查询教室信息（带冲突检测）
   *
   * @param {*} kdtId
   * @param {*} pageRequest
   * @param {*} query
   * @memberof ResourceFacadeService
   */
  async findClassroomConflict(kdtId, pageRequest, query) {
    return this.invoke('findClassroomConflict', [kdtId, pageRequest, query]);
  }

  /**
   * 提交创建排课信息之前检测冲突
   *
   * @param {*} kdtId
   * @param {*} query
   * @memberof ResourceFacadeService
   */
  async checkResourceConflict(kdtId, query) {
    return this.invoke('checkResourceConflict', [kdtId, query]);
  }
}

module.exports = ResourceFacadeService;
