// 打卡日记相关接口
const BaseService = require('../../base/BaseService');

class GciLogService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.gci.api.facade.GciLogFacade';
  }

  /**
   * 分页获取某个打卡任务下的打卡日记列表
   *
   * @see http://zanapi.qima-inc.com/site/service/view/193851
   *
   * @param {Object} req - 请求参数
   * @param {number} req.kdtId - kdtId
   * @param {number} req.taskId - 打卡任务 id
   * @param {number} req.alias - 打卡别名
   * @param {number} req.page - 页码
   * @param {number} req.size - 每页大小
   */
  async list(req) {
    req.role = 1;
    const result = await this.invoke('listGciLogs', [req]);
    return result;
  }

  /**
   * 打卡日记精选
   *
   * @see http://zanapi.qima-inc.com/site/service/view/193852
   * @param {*} kdtId - kdtId
   * @param {*} gciLogId - 打卡日记 id
   * @param {*} selectionStatus - 精选状态
   * @returns
   */
  async updateSelectionStatus(kdtId, gciLogId, selectionStatus) {
    const result = await this.invoke('updateSelectionStatus', [kdtId, gciLogId, selectionStatus]);
    return result;
  }

  /**
   * 打卡日记显示/隐藏
   *
   * @see http://zanapi.qima-inc.com/site/service/view/193853
   * @param {*} kdtId - kdtId
   * @param {*} gciLogId - 打卡日记 id
   * @param {*} selectionStatus - 精选状态
   * @returns
   */
  async updateShowStatus(kdtId, gciLogId, showStatus) {
    const result = await this.invoke('updateShowStatus', [kdtId, gciLogId, showStatus]);
    return result;
  }
}

module.exports = GciLogService;
