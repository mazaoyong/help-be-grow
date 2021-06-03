const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.pc.api.exercisebook.HomeworkFacade */
class HomeworkFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.exercisebook.HomeworkFacade';
  }

  /**
   * 查询作业详情，b端
   * @link http://zanapi.qima-inc.com/site/service/view/1003716
   * @param {number} kdtId -
   * @param {number} homeworkId -
   * @return {Promise}
   */
  async getBusinessDetail(kdtId, homeworkId) {
    return this.invoke('getBusinessDetail', [kdtId, homeworkId]);
  }

  /**
   * 创建作业
   * @link http://zanapi.qima-inc.com/site/service/view/1008737
   * @param {number} kdtId -
   * @param {Object} command -
   * @param {number} command.scoreStyle - 评分机制
   *  1：分数制
   *  2：等第制
   * @param {string} command.publishTime - 上架时间
   * @param {number} command.exerciseBookId - 作业本id
   * @param {number} command.timerPublish - 定时发布的开关
   *  1：开启
   *  0：关闭
   * @param {number} command.scoreRule - 计分规则
   *  1：十分制
   *  2：百分制
   * @param {Array} command.detail - 详情
   * @param {string} command.title - 作业标题
   * @param {string} command.deadline - 截止日期
   * @param {Object} command.operator - 操作人
   * @return {Promise}
   */
  async createHomework(kdtId, command) {
    return this.invoke('createHomework', [kdtId, command]);
  }

  /**
   * 更新作业
   * @link http://zanapi.qima-inc.com/site/service/view/1008738
   * @param {number} kdtId -
   * @param {Object} command -
   * @param {number} command.scoreStyle - 评分机制
   *  1：分数制
   *  2：等第制
   * @param {string} command.publishTime - 上架时间
   * @param {number} command.exerciseBookId - 作业本id
   * @param {number} command.timerPublish - 定时发布的开关
   *  1：开启
   *  0：关闭
   * @param {number} command.scoreRule - 计分规则
   *  1：十分制
   *  2：百分制
   * @param {number} command.id - 作业id
   * @param {Array} command.detail - 详情
   * @param {string} command.title - 作业标题
   * @param {string} command.deadline - 截止日期
   * @param {Object} command.operator - 操作人
   * @return {Promise}
   */
  async updateHomework(kdtId, command) {
    return this.invoke('updateHomework', [kdtId, command]);
  }

  /**
   * 删除作业
   * @link http://zanapi.qima-inc.com/site/service/view/1008739
   * @param {number} kdtId -
   * @param {Object} command -
   * @param {number} command.id - 作业id
   * @param {Object} command.operator - 操作人
   * @return {Promise}
   */
  async deleteHomework(kdtId, command) {
    return this.invoke('deleteHomework', [kdtId, command]);
  }

  /**
   * 查询作业详情，b端
   * @link http://zanapi.qima-inc.com/site/service/view/1008455
   * @param {number} kdtId -
   * @param {number} homeworkId -
   * @return {Promise}
   */
  async getHomeworkDetail(kdtId, homeworkId) {
    return this.invoke('getHomeworkDetail', [kdtId, homeworkId]);
  }

  /**
   * 分页查询某个作业本下的作业列表
   * @link http://zanapi.qima-inc.com/site/service/view/1008741
   * @param {number} kdtId -
   * @param {Object} pageRequest - 分页请求
   * @param {number} pageRequest.pageNumber -
   * @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   * @param {number} pageRequest.pageSize -
   * @param {Object} pageRequest.sort -
   * @param {Object} query -
   * @param {number} query.exerciseBookId - 作业本id
   * @param {string} query.title - 作业名称
   * @return {Promise}
   */
  async findPageByCondition(kdtId, pageRequest, query) {
    return this.invoke('findPageByCondition', [kdtId, pageRequest, query]);
  }
}

module.exports = HomeworkFacade;
