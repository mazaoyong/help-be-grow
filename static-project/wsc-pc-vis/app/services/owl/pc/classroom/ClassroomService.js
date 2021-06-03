const BaseService = require('../../../base/BaseService');

/**
 */
class ClassRoomService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.classroom.ClassroomFacade';
  }

  /**
   *  创建教室
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/347506
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {string} command.classroomName - 教室名称
   *  @param {number} command.addressId - 教室地址Id，目前使用的是多网点的网点，记录其id
   *  @param {number} command.capacity - 教室容量
   *  @return {Promise}
   */
  async createClassroom(kdtId, command) {
    return this.invoke('createClassroom', [kdtId, command]);
  }

  /**
   *  更新教室
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/347507
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {string} command.classroomName - 教室名称
   *  @param {number} command.id - id
   *  @param {number} command.addressId - 教室地址，目前使用的是多网点的网点，记录其他id
   *  @param {number} command.capacity - 教室容量
   *  @return {Promise}
   */
  async updateClassroom(kdtId, command) {
    return this.invoke('updateClassroom', [kdtId, command]);
  }

  /**
   *  删除教室
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/347508
   *
   *  @param {number} kdtId -
   *  @param {number} id -
   *  @return {Promise}
   */
  async deleteClassroom(kdtId, id) {
    return this.invoke('deleteClassroom', [kdtId, id]);
  }

  /**
   *  删除教室 支持连锁
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/425219
   *
   *  @param {number} operatorKdtId -
   *  @param {Object} classroomDeleteCommand -
   *  @param {number} classroomDeleteCommand.kdtId - 校区店铺id
   *  @param {number} classroomDeleteCommand.id - 待删除教室id
   *  @return {Promise}
   */
  async deleteClassroomV2(operatorKdtId, classroomDeleteCommand) {
    return this.invoke('deleteClassroomV2', [operatorKdtId, classroomDeleteCommand]);
  }

  /**
   *  通过id获取教室基本信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/347509
   *
   *  @param {number} kdtId -
   *  @param {number} id -
   *  @return {Promise}
   */
  async getClassroomById(kdtId, id) {
    return this.invoke('getClassroomById', [kdtId, id]);
  }

  /**
   *  通过id获取教室基本信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/425221
   *
   *  @param {number} operatorKdtId -
   *  @param {Object} classroomIdQuery - 查询参数
   *  @param {number} classroomIdQuery.kdtId - 校区店铺id
   *  @param {number} classroomIdQuery.id - 教室id
   *  @return {Promise}
   */
  async getClassroomByIdV2(operatorKdtId, classroomIdQuery) {
    return this.invoke('getClassroomByIdV2', [operatorKdtId, classroomIdQuery]);
  }

  /**
   *  分页查询教室
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/350140
   *
   *  @param {number} kdtId -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query -
   *  @param {string} query.classroomName - 教室名称
   *  @param {number} query.addressId - 教室地址，目前使用的是多网点的网点id
   *  @return {Promise}
   */
  async findPageByCondition(kdtId, pageRequest, query) {
    return this.invoke('findPageByCondition', [kdtId, pageRequest, query]);
  }

  /**
   *  通过id获取教室基本信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/670961
   *
   *  @param {number} operatorKdtId - 操作店铺
   *  @param {Object} query - 查询参数
   *  @param {string} query.classroomNo - 教室编号
   *  @param {number} query.kdtId - 校区店铺id
   *  @return {Promise}
   */
  async getClassroomByNo(operatorKdtId, query) {
    return this.invoke('getClassroomByNo', [operatorKdtId, query]);
  }
}

module.exports = ClassRoomService;
