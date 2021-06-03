const BaseService = require('../../../base/BaseService');

/**
 * customer base service
 */
class StudentService extends BaseService {
  /**
   * service name
   */
  get SERVICE_NAME() {
    return 'com.youzan.owl.edu.api.student.StudentFacade';
  }

  /**
   * 获取客户学员列表
   *
   * @see http://zanapi.qima-inc.com/site/service/view/217549
   * @memberof StudentService
   * @param {Object} req - 请求参数
   * @param {number} req.kdtId - 店铺 Id
   * @param {numver} req.customerUserId - 有赞 userId
   * @param {string} req.keyword - 店铺 Id
   * @return {Promise<Object>}
   */
  async findStudentList(req) {
    const res = await this.invoke('getCustomerStudentList', [req]);

    return res;
  }

  /**
   * 新增学员
   *
   * @see http://zanapi.qima-inc.com/site/service/view/217186
   * @param {Object} req
   * @memberof StudentService
   */
  async create(req) {
    const res = await this.invoke('createStudent', [req]);
    return res;
  }

  /**
   *  获取学员详情
   *
   *  @see http://zanapi.qima-inc.com/site/service/view/217547
   *  @param {number} kdtId - kdtId
   *  @param {number} customerUserId - 客户有赞user id
   *  @param {string} alias - 学员alias
   * @return {Promise<Object>}
   */
  async detail(kdtId, customerUserId, alias) {
    const res = await this.invoke('getStudentDetail', [{ kdtId, customerUserId, alias }]);

    return res;
  }

  /**
   * 更新学员信息
   *
   * @see http://zanapi.qima-inc.com/site/service/view/217545
   * @param {Object} req
   * @return {Promise<Object>}
   * @memberof StudentService
   */
  async update(req) {
    const res = await this.invoke('updateStudent', [req]);
    return res;
  }

  /**
   *  删除学员
   *
   *  @see http://zanapi.qima-inc.com/site/service/view/217546
   *  @param {number} kdtId - kdtId
   *  @param {number} customerUserId - 客户有赞user id
   *  @param {string} alias - 学员alias
   * @return {Promise<Object>}
   */
  async delete(kdtId, customerUserId, alias) {
    const res = await this.invoke('deleteStudent', [{ kdtId, customerUserId, alias }]);

    return res;
  }

  /**
   * 获取店铺学员列表
   *
   * @see http://zanapi.qima-inc.com/site/service/view/230371
   * @param {Object} params - 请求参数
   * @param {Object} pageable - 分页相关参数
   * @param {number} kdtId - 店铺 Id
   * @return {Promise<Object>}
   */
  async getKdtStudentList(params, pageable, kdtId) {
    const res = await this.invoke('pageKdtStudentList', [kdtId, params, pageable]);
    return res;
  }

  /**
   * 批量获取学员基本信息
   *
   * @see http://zanapi.qima-inc.com/site/service/view/299842
   * @param {number} kdtId
   * @param {{accountType: number, customerId: number}[]} accounts
   */
  async findStudentBaseInfo(kdtId, accounts) {
    const res = await this.invoke('findStudentBaseInfo', [kdtId, accounts]);
    return res;
  }
}

module.exports = StudentService;
