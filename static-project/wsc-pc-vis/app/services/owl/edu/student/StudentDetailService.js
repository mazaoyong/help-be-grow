/* com.youzan.owl.pc.api.student.StudentDetailFacade -  */
const BaseService = require('../../../base/BaseService');

class StudentDetailFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.student.StudentDetailFacade';
  }

  /**
   *  学员详情页修改来源
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/797873
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {string} command.identityNo - 身份标识
   *  @param {number} command.clueId - 线索id, 兼容灰度期间的业务正常
   *  @return {Promise}
   */
  async modifySource(kdtId, command) {
    return this.invoke('modifySource', [kdtId, command]);
  }

  /**
   *  学员详情页, 学员信息查询, 包括资料项等等
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/797871
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {string} query.identityNo - 身份标识
   *  @param {number} query.clueId - 线索id, 兼容灰度期间的业务正常
   *  @return {Promise}
   */
  async getByNo(kdtId, query) {
    return this.invoke('getByNo', [kdtId, query]);
  }

  /**
   *  学员详情页保存资料项信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/797872
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {string} command.identityNo - 身份标识
   *  @param {Array.<Object>} command.attributeItems[] - 资料项信息
   *  @param {number} command.clueId - 线索id, 兼容灰度期间的业务正常
   *  @return {Promise}
   */
  async saveAttribute(kdtId, command) {
    return this.invoke('saveAttribute', [kdtId, command]);
  }

  /**
   *  检测是否是潜在学员
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/832552
   *
   *  @param {number} kdtId -
   *  @param {number} studentId -
   *  @return {Promise}
   */
  async checkIsPotential(kdtId, studentId) {
    return this.invoke('checkIsPotential', [kdtId, studentId]);
  }
}

module.exports = StudentDetailFacade;
