const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.pc.api.teacher.TeacherFacade */
class TeacherFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.teacher.TeacherFacade';
  }

  /**
   * 根据query条件查询助教列表
   * @link http://zanapi.qima-inc.com/site/service/view/1056120
   * @param {number} kdtId -
   * @param {Object} pageRequest - 分页请求
   * @param {number} pageRequest.pageNumber -
   * @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   * @param {number} pageRequest.pageSize -
   * @param {Object} pageRequest.sort -
   * @param {Object} query - Description:: TeacherQuery
   * @param {number} query.kdtId - 店铺id
   * @param {Array} query.assistantIds - 助教id集合，不传表示查询所有
   * @param {number} query.source - 获取方式
   * @param {string} query.keyword - 模糊搜索的关键词，搜助教昵称或者员工名字，可以不传
   * @param {Object} query.operator - 操作人
   * @return {Promise}
   */
  async findAssistantPage(kdtId, pageRequest, query) {
    return this.invoke('findAssistantPage', [kdtId, pageRequest, query]);
  }
}

module.exports = TeacherFacade;
