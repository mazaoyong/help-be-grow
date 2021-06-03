const BaseService = require('../../base/BaseService');

/* com.youzan.owl.api.ceres.CeresPostMDFacade -  */
class EduPostMDFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.ceres.CeresPostMDFacade';
  }

  /**
   *  移动端老师查询动态列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/499936
   *
   *  @param {number} kdtId - 校区 kdtId
   *  @param {Object} pageRequest - 分页
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query - 查询条件
   *  @param {Object} query.viewedUser - 被查看用户的信息
   *  @param {Object} query.operator - 操作人
   *  @return {Promise}
   */
  async findPostsForStaff(kdtId, pageRequest, query) {
    return this.invoke('findPostsForStaff', [kdtId, pageRequest, query]);
  }

  /**
   *  动态详情查询，带评论
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/499938
   *
   *  @param {number} kdtId - 校区
   *  @param {Object} query - 查询条件
   *  @param {number} query.postId -
   *  @param {Object} query.operator - 操作人
   *  @return {Promise}
   */
  async findPostDetail(kdtId, query) {
    return this.invoke('findPostDetail', [kdtId, query]);
  }

  /**
   *  编辑点评时获取详情接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/507233
   *
   *  @param {number} kdtId - 校区
   *  @param {number} postId - 点评 id
   *  @return {Promise}
   */
  async getPostById(kdtId, postId) {
    return this.invoke('getPostById', [kdtId, postId]);
  }

  /**
             *  创建动态接口
*  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/499931
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
             *  @param {number} command.comeFrom - 来源
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
*  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/499932
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
   *  查询可点评的学生列表，只支持当页全选
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/499939
   *
   *  @param {number} kdtId - 校区
   *  @param {Object} pageRequest - 分页参数
  /*
   *  移动端老师查询动态列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/499936
   *
   *  @param {number} kdtId - 校区 kdtId
   *  @param {Object} pageRequest - 分页
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {[object Object]} pageRequest.sort.orders -
   *  @param {Object} query - 查询条件
   *  @param {string} query.keyword - 根据姓名搜索
   *  @return {Promise}
   */
  async findStudentsForReview(kdtId, pageRequest, query) {
    return this.invoke('findStudentsForReview', [kdtId, pageRequest, query]);
  }

  /**
   *  根据老师查询近期点评过的学生列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/499940
   *
   *  @param {number} kdtId - 校区
   *  @param {Object} query - 查询条件
   *  @param {number} query.userId - teacherId
   *  @return {Promise}
   */
  async findRecentReviewedStudents(kdtId, query) {
    return this.invoke('findRecentReviewedStudents', [kdtId, query]);
  }

  /**
   *  查找日程下的学生，支持按学员名称搜索
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/509141
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

  /**
   *  删除动态接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/499933
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
             *  查询收件箱最新消息
*  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/500390
*
             *  @param {number} kdtId - 校区
             *  @param {Object} userDTO - 用户信息
             *  @param {number} userDTO.userRole - 用户角色
 0: 买家/普通用户,
 1: 学员,
 2: 教职人员/管理人员
             *  @param {number} userDTO.userId - 用户 id
             *  @return {Promise}
             */
  async findMessageBox(kdtId, userDTO) {
    return this.invoke('findMessageBox', [kdtId, userDTO]);
  }

  /**
   *  查询用户消息列表，可以选择查询所有消息或仅未读消息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/500391
   *
   *  @param {number} kdtId - 校区
   *  @param {Object} pageRequest - 分页参数
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query - 查询条件
   *  @param {Object} query.user - 用户信息
   *  @return {Promise}
   */
  async findUserMessages(kdtId, pageRequest, query) {
    return this.invoke('findUserMessages', [kdtId, pageRequest, query]);
  }

  /**
             *  查询用户小红点
*  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/513324
*
             *  @param {number} kdtId - 校区
             *  @param {Object} userDTO - 用户信息
             *  @param {number} userDTO.userRole - 用户角色
 0: 买家/普通用户,
 1: 学员,
 2: 教职人员/管理人员
             *  @param {number} userDTO.userId - 用户 id
             *  @return {Promise}
             */
  async findUserBadge(kdtId, userDTO) {
    return this.invoke('findUserBadge', [kdtId, userDTO]);
  }

  /**
             *  创建互动接口
*  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/499934
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
  async createLike(kdtId, command) {
    return this.invoke('createLike', [kdtId, command]);
  }

  async deleteLike(kdtId, command) {
    return this.invoke('deleteLike', [kdtId, command]);
  }

  async createComment(kdtId, command) {
    return this.invoke('createComment', [kdtId, command]);
  }

  async deleteComment(kdtId, command) {
    return this.invoke('deleteComment', [kdtId, command]);
  }

  /**
   *  查询评论列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/529979
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
   *  根据老师或员工的 userId 查询教师+员工的组合信息如果有 teacherName 则前端使用 teacherName，否则使用 staffName
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/535661
   *
   *  @param {number} kdtId -
   *  @param {number} userId -
   *  @return {Promise}
   */
  async getStaffInfoById(kdtId, userId) {
    return this.invoke('getStaffInfoById', [kdtId, userId]);
  }

  /**
   *  更新家校圈封面
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/664654
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {string} command.coverUrl -
   *  @param {number} command.userId -
   *  @return {Promise}
   */
  async updateCover(kdtId, command) {
    return this.invoke('updateCover', [kdtId, command]);
  }
}

module.exports = EduPostMDFacade;
