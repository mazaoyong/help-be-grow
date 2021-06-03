
const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.pc.api.ceres.CeresPostPCFacade -  */
class EduPostPCFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.ceres.CeresPostPCFacade';
  }

  /**
   *  网页端查询评论列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/502918
   *
   *  @param {number} kdtId - 校区
   *  @param {Object} pageRequest - 分页
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {[object Object]} pageRequest.sort.orders -
   *  @param {Object} query - 查询条件
   *  @param {number} query.postId -
   *  @return {Promise}
   */
  async findComments(kdtId, pageRequest, query) {
    return this.invoke('findComments', [kdtId, pageRequest, query]);
  }

  /**
               *  创建动态接口
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/499943
  *
               *  @param {number} kdtId - 校区
               *  @param {Object} command - 创建命令
               *  @param {string} command.lessonNo - 关联日程
               *  @param {number} command.visibility - 可见范围
   0: 全校可见,
   1: 仅被点评学员可见,
   2: 仅本节课学员
               *  @param {number} command.kdtId - 操作
               *  @param {number} command.postType - 动态类型，本期只有点评，默认为0，可不传
               *  @param {number} command.locationType - 位置信息
   0: 不展示位置,
   1: 展示校区名,
   2: 展示校区名-课程名
               *  @param {string} command.textContent - 文本内容
               *  @param {Object} command.operator - 操作人
               *  @param {Array.<Object>} command.extraContents[] - 媒体内容
               *  @param {number} command.selectAllMark - 全选标志：1，全选，0，不全选，目前仅当 lessonNo 不为空时有值
               *  @param {Array.<Array>} command.excludeStudentIds[] - 当全选标志位为 1 时，此字段传入点评时被反选排除的学生 student_id
               *  @param {number} command.comeFrom - 创建来源
   0: PC端，1: 移动端
               *  @param {Object} command.user - 动态创建人信息
               *  @param {Array.<Object>} command.mentionedUsers - 被点评的用户列表，当前仅为学员
               *  @return {Promise}
               */
  async createReview(kdtId, command) {
    return this.invoke('createReview', [kdtId, command]);
  }

  /**
               *  更新动态接口
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/499944
  *
               *  @param {number} kdtId - 校区
               *  @param {Object} command - 更新命令
               *  @param {string} command.lessonNo - 不更新此字段
               *  @param {number} command.visibility - 可见范围
   0: 全校可见,
   1: 仅被点评学员可见,
   2: 仅本节课学员
               *  @param {number} command.kdtId - 操作
               *  @param {number} command.locationType - 位置信息
   0: 不展示位置,
   1: 展示校区名,
   2: 展示校区名-课程名
               *  @param {string} command.textContent - 文本内容
               *  @param {number} command.postId - 动态 id
               *  @param {Object} command.operator - 操作人信息
               *  @param {Array.<Object>} command.extraContents[] - 媒体内容
               *  @return {Promise}
               */
  async updateReview(kdtId, command) {
    return this.invoke('updateReview', [kdtId, command]);
  }

  /**
     *  删除动态接口
     *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/499945
     *
     *  @param {number} kdtId - 校区
     *  @param {Object} command - 删除命令
     *  @param {number} command.kdtId - 校区
     *  @param {number} command.postId - 动态 id
     *  @param {Object} command.operator -
     *  @return {Promise}
     */
  async deleteReview(kdtId, command) {
    return this.invoke('deleteReview', [kdtId, command]);
  }

  /**
               *  创建互动接口
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/499946
  *
               *  @param {number} kdtId - 校区
               *  @param {Object} command - 创建命令
               *  @param {Object} command.receiver - 被回复人
               *  @param {number} command.interactionType - 互动类型
   1: 点赞,
   2: 评论
               *  @param {Object} command.sender - 互动发送者
               *  @param {number} command.postId -
               *  @param {string} command.replyContent - 回复内容
               *  @param {Object} command.operator - 操作人
               *  @return {Promise}
               */
  async createComment(kdtId, command) {
    return this.invoke('createComment', [kdtId, command]);
  }

  /**
               *  删除回复/取消点赞
   执行此操作时需要校验操作人信息
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/499947
  *
               *  @param {number} kdtId - 校区
               *  @param {Object} command - 删除命令
               *  @param {number} command.CommentId - 删除互动/取消点赞
               *  @param {Object} command.sender - 发送人
               *  @param {Object} command.operator - 操作人
               *  @return {Promise}
               */
  async deleteComment(kdtId, command) {
    return this.invoke('deleteComment', [kdtId, command]);
  }

  /**
     *  网页端老师查询点评列表
     *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/499948
     *
     *  @param {number} kdtId - 校区 kdtId
     *  @param {Object} pageRequest - 分页
     *  @param {number} pageRequest.pageNumber -
     *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
     *  @param {number} pageRequest.pageSize -
     *  @param {Object} pageRequest.sort -
     *  @param {Object} query - 查询条件
     *  @param {string} query.lessonNo - 日程编码，contractNo
     *  @param {number} query.userId - 学生的 userId，即 studentId
     *  @return {Promise}
     */
  async findPostsForStaff(kdtId, pageRequest, query) {
    return this.invoke('findPostsForStaff', [kdtId, pageRequest, query]);
  }

  /**
   *  查询分享的位置信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/509802
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {string} query.lessonNo - 根据日程查询课程名
   *  @param {number} query.kdtId - 校区 kdtId
   *  @return {Promise}
   */
  async findLocationInfo(kdtId, query) {
    return this.invoke('findLocationInfo', [kdtId, query]);
  }

  /**
   *  查找日程下的学生，支持按学员名称搜索
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/509778
   *
   *  @param {number} kdtId -
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query -
   *  @param {string} query.lessonNo - 日程编码
   *  @param {string} query.name - 学员姓名模糊搜索
   *  @return {Promise}
   */
  async findStudentsOnLesson(kdtId, pageRequest, query) {
    return this.invoke('findStudentsOnLesson', [kdtId, pageRequest, query]);
  }
}

module.exports = EduPostPCFacade;
