// 打卡任务相关接口
const BaseService = require('../../base/BaseService');

class GciTaskService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.gci.api.facade.GciTaskFacade';
  }

  /**
   * [打卡列表]{@link http://zanapi.qima-inc.com/site/service/view/166694}
   *
   * @param {Object} req - 请求参数
   * @returns {Promise.<Object>} - 任务列表
   */
  async list(req) {
    const result = await this.invoke('listGciTasks', [req]);
    return result;
  }

  /**
   * [查询任务详情]{@link http://zanapi.qima-inc.com/site/service/view/193868}
   *
   * @param {number} kdtId - kdtId
   * @param {number} taskId - 任务 id
   * @returns {Promise.<Object>} - 任务详情
   */
  async detail(kdtId, taskId) {
    const result = await this.invoke('getGciTask', [kdtId, taskId]);
    return result;
  }

  /**
   * [更新任务]{@link http://zanapi.qima-inc.com/site/service/view/166696}
   *
   * @param {Object} req - 请求参数
   * @returns {Promise.<boolean>} - 更新结果，true 表示删除成功
   */
  async update(req) {
    const result = await this.invoke('updateGciTask', [req]);
    return result;
  }
}

module.exports = GciTaskService;
