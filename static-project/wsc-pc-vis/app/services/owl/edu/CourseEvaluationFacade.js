const BaseService = require('../../base/BaseService');

/* com.youzan.owl.pc.api.comment.CommentFacade -  */
class CommentFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.comment.CommentFacade';
  }

  /**
   *  分页获取评论列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/429114
   *
   *  @param {number} kdtId - 当前操作的kdtId
   *  @param {Object} commentRequestDTO -
   *  @param {number} commentRequestDTO.chosenSticky - 选择精选或者置顶的留言的查询字段
   *  @param {string} commentRequestDTO.search - 搜索字段，搜索留言的发起的用户或者留言的内容时必填
   *  @param {number} commentRequestDTO.sortType - 0 为最新的留言在先  1为最早发表的留言在前
   *  @param {number} commentRequestDTO.contentId - 内容id 必填
   *  @param {string} commentRequestDTO.alias - 内容id 必填
   *  @param {Array.<Array>} commentRequestDTO.kdtIdList[] - 校区id列表
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @return {Promise}
   */
  async getCommentPageForShop(kdtId, commentRequestDTO, pageRequest) {
    return this.invoke('getCommentPageForShop', [kdtId, commentRequestDTO, pageRequest]);
  }

  /**
   *  获取一家店的知识付费的所有内容的未读评论总数
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/421568
   *
   *  @param {number} kdtId - 当前操作的kdtId
   *  @param {Object} commentShopDTO -
   *  @param {number} commentShopDTO.toCommentId - 这条评论的回复的id 必填
   *  @param {number} commentShopDTO.kdtId - 店铺id 必填
   *  @param {number} commentShopDTO.contentId - 内容别名 必填
   *  @param {string} commentShopDTO.alias - 内容别名
   *  @param {number} commentShopDTO.userType - 状态 0:普通用户  1:商家用户
   *  @param {string} commentShopDTO.productComment - 用户对商品评论内容 必填
   *  @param {number} commentShopDTO.userId - 留言的用户id 必填
   *  @param {number} commentShopDTO.toUserId - 这条评论的回复的用户的id 必填
   *  @return {Promise}
   */
  async getNonReadCommentsCountByKdtId(kdtId, commentShopDTO) {
    return this.invoke('getNonReadCommentsCountByKdtId', [kdtId, commentShopDTO]);
  }

  /**
   *  点开内容的评论后，评论数清零
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/421569
   *
   *  @param {number} kdtId - 当前操作的kdtId
   *  @param {Object} commentShopDTO -
   *  @param {number} commentShopDTO.toCommentId - 这条评论的回复的id 必填
   *  @param {number} commentShopDTO.kdtId - 店铺id 必填
   *  @param {number} commentShopDTO.contentId - 内容别名 必填
   *  @param {string} commentShopDTO.alias - 内容别名
   *  @param {number} commentShopDTO.userType - 状态 0:普通用户  1:商家用户
   *  @param {string} commentShopDTO.productComment - 用户对商品评论内容 必填
   *  @param {number} commentShopDTO.userId - 留言的用户id 必填
   *  @param {number} commentShopDTO.toUserId - 这条评论的回复的用户的id 必填
   *  @return {Promise}
   */
  async readComments(kdtId, commentShopDTO) {
    return this.invoke('readComments', [kdtId, commentShopDTO]);
  }

  /**
   *  留言课程列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/421570
   *
   *  @param {number} kdtId -
   *  @param {Object} commentShopQueryDTO -
   *  @param {number} commentShopQueryDTO.chosenSticky - 选择精选或者置顶的留言的查询字段
   *  @param {string} commentShopQueryDTO.search - 搜索字段，搜索留言的发起的用户或者留言的内容时必填
   *  @param {number} commentShopQueryDTO.sortType - 0 为最新的留言在先  1为最早发表的留言在前
   *  @param {number} commentShopQueryDTO.contentId - 内容id 必填
   *  @param {string} commentShopQueryDTO.alias - 内容id 必填
   *  @param {Array.<Array>} commentShopQueryDTO.kdtIdList[] - 校区id列表
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @return {Promise}
   */
  async findPageByKdtId(kdtId, commentShopQueryDTO, pageRequest) {
    return this.invoke('findPageByKdtId', [kdtId, commentShopQueryDTO, pageRequest]);
  }

  /**
   *  置顶评论
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/421565
   *
   *  @param {number} kdtId - 当前操作的kdtId
   *  @param {Object} commentShopDTO -
   *  @param {boolean} commentShopDTO.isChosen - 是否精选
   *  @param {number} commentShopDTO.contentId - 内容id 必填
   *  @param {string} commentShopDTO.alias - 别名 必填
   *  @param {number} commentShopDTO.id - 自增主键 必填
   *  @param {number} commentShopDTO.userId - 留言的用户id 必填
   *  @param {boolean} commentShopDTO.isSticky - 是否置顶
   *  @return {Promise}
   */
  async setCommentChosenSticky(kdtId, commentShopDTO) {
    return this.invoke('setCommentChosenSticky', [kdtId, commentShopDTO]);
  }

  /**
   *  回复评论
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/421566
   *
   *  @param {number} kdtId - 当前操作的kdtId
   *  @param {Object} commentDTO -
   *  @param {number} commentDTO.toCommentId - 这条评论的回复的id 必填
   *  @param {number} commentDTO.contentId - 内容别名 必填
   *  @param {string} commentDTO.alias - 内容别名
   *  @param {string} commentDTO.productComment - 用户对商品评论内容 必填
   *  @param {number} commentDTO.type - 知识付费类型 1:专栏, 2:内容, 4:直播
   *  @param {number} commentDTO.userId - 留言的用户id 必填
   *  @param {number} commentDTO.toUserId - 这条评论的回复的用户的id 必填
   *  @return {Promise}
   */
  async replyComment(kdtId, commentDTO) {
    return this.invoke('replyComment', [kdtId, commentDTO]);
  }

  /**
   *  删除评论
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/421567
   *
   *  @param {number} kdtId - 当前操作的kdtId
   *  @param {Object} commentDTO -
   *  @param {boolean} commentDTO.isChosen - 是否精选
   *  @param {number} commentDTO.contentId - 内容id 必填
   *  @param {string} commentDTO.alias - 别名 必填
   *  @param {number} commentDTO.id - 自增主键 必填
   *  @param {number} commentDTO.userId - 留言的用户id 必填
   *  @param {boolean} commentDTO.isSticky - 是否置顶
   *  @return {Promise}
   */
  async deleteComment(kdtId, commentDTO) {
    return this.invoke('deleteComment', [kdtId, commentDTO]);
  }

  /**
   *  批量置顶、隐藏、设置精选 评论
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1071665
   *
   *  @param {number} kdtId - 当前操作的kdtId
   *  @param {Object} command -
   *  @param {boolean} command.isChosen - 是否精选
   *  @param {Array.<Object>} command.itemList[] - 批量操作的list
   *  @param {boolean} command.isSticky - 是否置顶
   *  @param {Object} command.operator - 操作人
   *  @param {boolean} command.isHide - 是否隐藏
   *  @return {Promise}
   */
  async batchSetCommentChosenSticky(kdtId, command) {
    return this.invoke('batchSetCommentChosenSticky', [kdtId, command]);
  }
}

module.exports = CommentFacade;
