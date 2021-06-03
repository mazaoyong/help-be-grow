const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.pc.api.ceres.CeresPostPCFacade -  */
class CeresPostPCFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.ceres.CeresPostPCFacade';
  }

  /**
             *  创建动态接口
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/516873
  *
             *  @param {number} kdtId - 校区
             *  @param {Object} command - 创建命令
             *  @param {string} command.lessonNo - 关联日程，用户点评时不需要填
             *  @param {number} command.visibility - 可见范围
  0: 全校可见,
  1: 仅被点评学员可见,
  2: 仅本节课学员
  用户点评时只能填0
             *  @param {number} command.kdtId - 校区
             *  @param {number} command.postType - 动态类型
  点评：0，用户动态：1
             *  @param {number} command.locationType - 位置信息
  0: 不展示位置,
  1: 展示校区名,
  2: 展示校区名-课程名
  用户点评时只能填0
             *  @param {string} command.textContent - 文本内容
             *  @param {Object} command.operator - 操作人
             *  @param {Array.<Object>} command.extraContents[] - 媒体内容
             *  @param {number} command.selectAllMark - 全选标志：1，全选，0，不全选，目前仅当 lessonNo 不为空时有值，用户点评时不需要填
             *  @param {Array.<Array>} command.excludeStudentIds[] - 当全选标志位为 1 时，此字段传入点评时被反选排除的学生 student_id，用户点评时不需要填
             *  @param {number} command.comeFrom - 来源
  0: PC端，1: 移动端
             *  @param {Object} command.user - 动态创建人信息
             *  @param {Array.<Object>} command.mentionedUsers - 被点评的用户列表，当前仅为学员，用户点评时不需要填
             *  @return {Promise}
             */
  async createReview(kdtId, command) {
    return this.invoke('createReview', [kdtId, command]);
  }
}

module.exports = CeresPostPCFacade;
