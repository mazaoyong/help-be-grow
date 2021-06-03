const BaseService = require('../../base/BaseService');

/**
 * 学员相关接口
 * @class StudentFacade
 * @extends {BaseService}
 */
class StudentFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.student.StudentFacade';
  }

  /**
   * 根据学员id查询学员信息
   *
   * @see http://zanapi.qima-inc.com/site/service/view/351637
   * @param {*} kdtId
   * @param {*} studentId
   * @memberof StudentFacade
   */
  async getInfoById(kdtId, studentId) {
    const result = await this.invoke('getDetailById', [kdtId, studentId]);
    return result;
  }

  /**
   * 根据学员id删除学员
   *
   * @see http://zanapi.qima-inc.com/site/service/view/355333
   * @param {*} kdtId
   * @param {*} command
   * @memberof StudentFacade
   */
  async delete(kdtId, command) {
    const result = await this.invoke('delete', [kdtId, command]);
    return result;
  }

  /**
   * 更新学员信息
   *
   * @see http://zanapi.qima-inc.com/site/service/view/351635
   * @param {Object} kdtId
   * @param {Object} studentDTO
   * @return {Promise<Object>}
   * @memberof StudentService
   */
  async update(kdtId, studentDTO) {
    const res = await this.invoke('update', [kdtId, studentDTO]);
    return res;
  }

  /**
   *  根据学员id获取学员详情信息【脱敏】
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/745784
   *
   *  @param {number} kdtId - 店铺id
   *  @param {number} studentId - 学员id
   *  @return {Promise}
   */
  async getDetailByIdForHide(kdtId, studentId) {
    return this.invoke('getDetailByIdForHide', [kdtId, studentId]);
  }
}

module.exports = StudentFacade;
