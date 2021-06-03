const BaseService = require('../../../base/BaseService');

/**
 * 课程相关接口
 * @class EduCourseFacadeService
 * @extends {BaseService}
 */
class EduCourseFacadeService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.educourse.EduCourseFacade';
  }

  /**
   * 教务课程分页查询
   *
   * @param {*} kdtId
   * @param {*} pageRequest
   * @param {*} eduCourseQuery
   * @memberof EduCourseFacadeService
   */
  async findPageByCondition(kdtId, pageRequest, eduCourseQuery) {
    return this.invoke('findPageByCondition', [kdtId, pageRequest, eduCourseQuery]);
  }

  /**
     *  查询指定教务课程(new 兼容连锁)
     *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/425094
     *
     *  @param {number} operatorKdtId - 当前店铺id
     *  @param {Object} eduCourseDetailQuery -
     *  @param {number} eduCourseDetailQuery.kdtId - 被查询的店铺id
     *  @param {number} eduCourseDetailQuery.id - 被查询的课程id
     *  @return {Promise}
     */
  async getByIdV2(operatorKdtId, eduCourseDetailQuery) {
    return this.invoke('getByIdV2', [operatorKdtId, eduCourseDetailQuery]);
  }

  /**
   *  检查教务课程是否可以删除
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/425088
   *
   *  @param {number} operatorKdtId -
   *  @param {Object} eduCourseCheckQuery -
   *  @param {number} eduCourseCheckQuery.kdtId - 店铺id
   *  @param {number} eduCourseCheckQuery.id - 课程id
   *  @return {Promise}
   */
  async checkEduCourse(operatorKdtId, eduCourseCheckQuery) {
    return this.invoke('checkEduCourse', [operatorKdtId, eduCourseCheckQuery]);
  }

  /**
   *  根据教务课程查询店铺信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/425092
   *
   *  @param {number} operatorKdtId -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} eduCourseShopQuery -
   *  @param {number} eduCourseShopQuery.kdtId - 店铺id
   *  @param {number} eduCourseShopQuery.id - 课程id
   *  @return {Promise}
   */
  async findPageByEduCourse(operatorKdtId, pageRequest, eduCourseShopQuery) {
    return this.invoke('findPageByEduCourse', [
      operatorKdtId,
      pageRequest,
      eduCourseShopQuery,
    ]);
  }

  /**
   *  删除教务课程(new 兼容连锁)
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/425091
   *
   *  @param {number} operatorKdtId - 当前店铺id
   *  @param {Object} eduCourseDeleteCommand -
   *  @param {number} eduCourseDeleteCommand.kdtId - 店铺id
   *  @param {number} eduCourseDeleteCommand.id - 课程id
   *  @return {Promise}
   */
  async deleteEduCourseV2(operatorKdtId, eduCourseDeleteCommand) {
    return this.invoke('deleteEduCourseV2', [
      operatorKdtId,
      eduCourseDeleteCommand,
    ]);
  }

  /**
               *  创建教务课程
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/360279
  *
    *  @param {number} operatorKdtId - 当前店铺id
    *  @param {Object} command - 创建实体
    *  @param {number} command.applyType - 适用年龄类型
   0：月龄
   1：年龄
    *  @param {number} command.minApply - 最小适用
    *  @param {number} command.maxApply - 最大适用
    *  @param {Array.<Object>} command.applicableCampusList[] - 指定校区列表
    *  @param {number} command.kdtId - 店铺kdtId
    *  @param {string} command.name - 课程名称
    *  @param {number} command.teachType - 授课方式
   0：一对一
   1：班课
    *  @param {number} command.applicableCampusType - 是否是全部校区,0：否 1：是
    *  @return {Promise}
    */
  async createEduCourse(operatorKdtId, command) {
    return this.invoke('createEduCourse', [operatorKdtId, command]);
  }

  /**
   *  更新教务课程
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/360280
   *
   *  @param {number} operatorKdtId - 当前店铺id
   *  @param {Object} command - 编辑实体
   *  @param {number} command.applyType - 适用年龄类型
   *  @param {number} command.minApply - 最小适用
   *  @param {number} command.maxApply - 最大适用
   *  @param {Array.<Object>} command.applicableCampusList[] - 指定校区列表
   *  @param {number} command.kdtId - 店铺id
   *  @param {string} command.name - 课程名称
   *  @param {number} command.id - id
   *  @param {number} command.isAllChain - 是否是全部校区,0：否 1：是
   *  @return {Promise}
   */
  async updateEduCourse(operatorKdtId, command) {
    return this.invoke('updateEduCourse', [operatorKdtId, command]);
  }
}

module.exports = EduCourseFacadeService;
