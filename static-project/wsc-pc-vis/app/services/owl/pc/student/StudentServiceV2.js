const BaseService = require('../../../base/BaseService');

/**
 * 学员相关
 */
class StudentFacadeV2 extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.student.StudentFacadeV2';
  }

  /**
   *  分页综合搜索
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/421785
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页条件
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query - 查询条件
   *  @param {string} query.searchStartDate - 开始时间「最近上课时间」
   *  @param {string} query.searchEndDate - 截止时间「最近上课时间」
   *  @param {string} query.name - 学员姓名
   *  @param {string} query.mobile - 学员姓名
   *  @param {Array.<Array>} query.includeStudentIds[] - 包含在内的学员
   *  @param {string} query.studentNo - 学号
   *  @param {number} query.targetKdtId - 目标店铺id
   *  @return {Promise}
   */
  async findPageByQuery(kdtId, pageRequest, query) {
    return this.invoke('findPageByQuery', [kdtId, pageRequest, query]);
  }

  /**
   *  使用学员id删除
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/421777
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} command - 删除参数
   *  @param {number} command.studentId - 学员id
   *  @param {number} command.targetKdtId - 目标店铺id
   *  @param {number} command.userId - 学员关联的用户id
   *  @return {Promise}
   */
  async delete(kdtId, command) {
    return this.invoke('delete', [kdtId, command]);
  }
}

module.exports = StudentFacadeV2;
