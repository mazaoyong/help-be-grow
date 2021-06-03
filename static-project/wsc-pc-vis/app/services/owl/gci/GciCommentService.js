// 打卡日记相关接口
const BaseService = require('../../base/BaseService');

class GciCommentService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.gci.api.facade.CommentFacade';
  }

  /**
   * [分页获取讲师评论列表]{@link http://zanapi.qima-inc.com/site/service/view/166665}
   *
   * @param {Object} req - 请求参数
   * @param {number} req.kdtId - kdtId
   * @param {number} req.taskId - 打卡任务 id
   * @param {number} req.gciLogId - 打卡日记 id
   * @param {number} req.page - 页码
   * @param {number} req.size - 每页大小
   * @returns {Promise.<Object>} - 老师评论列表
   */
  async teacherList(req) {
    const result = await this.invoke('listTeacherComments', [req]);
    return result;
  }

  /**
   * 老师评论
   *
   * @see http://zanapi.qima-inc.com/site/service/view/193823
   *
   * @param {*} req
   * @returns {Promise.<boolean>} - 删除结果，true 表示删除成功
   */
  async commentLog(req) {
    req.commentUserType = 2; // 2 代表讲师评论
    const result = await this.invoke('commentLog', [req]);
    return result;
  }

  /**
   * [删除评论]{@link http://zanapi.qima-inc.com/site/service/view/166663}
   *
   * @param {number} req.taskId - 打卡任务 id
   * @param {number} req.gciLogId - 打卡日记 id
   * @param {number} req.commentId - 评论日记
   * @returns {Promise.<boolean>} - 删除结果，true 表示删除成功
   */
  async delete(req) {
    const result = await this.invoke('deleteComment', [req]);
    return result;
  }
}

module.exports = GciCommentService;
