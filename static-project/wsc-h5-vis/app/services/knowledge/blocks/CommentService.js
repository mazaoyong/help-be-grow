const KnowledgeBaseService = require('../KnowledgeBaseService');

/* com.youzan.owl.api.CommentService -  */
class CommentService extends KnowledgeBaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.CommentService';
  }

  /**
   *  根据商店id和内容别名获取留言列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/136208
   *
   *  @param {Object} commentRequestDTO -
   *  @param {number} commentRequestDTO.kdtId - 店铺id 必填
   *  @param {number} commentRequestDTO.adminId - 兼容卡门,本质也是userId
   *  @param {string} commentRequestDTO.alias - 内容别名 必填
   *  @param {number} commentRequestDTO.pageSize - 分页的size
   *  @param {number} commentRequestDTO.userId - 留言的用户id 查询用户的留言记录时必填 查询内容留言记录时不填
   *  @param {number} commentRequestDTO.pageNum - 分页的start
   *  @param {number} commentRequestDTO.chosen - 0:展示全部，1:展示精选
   *  @return {Promise}
   */
  async getCommentListByKdtIdAndAlias(commentRequestDTO) {
    return this.invoke('getCommentListByKdtIdAndAlias', [commentRequestDTO]);
  }

  /**
   *  买家留言商品
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/136209
   *
   *  @param {Object} commentDO -
   *  @param {number} commentDO.toCommentId - 这条评论的回复的id 一期可不填
   *  @param {number} commentDO.fansId - 用户的fansId
   *  @param {number} commentDO.kdtId - 店铺id 必填
   *  @param {number} commentDO.adminId - 兼容卡门,本质也是userId
   *  @param {number} commentDO.commentType - 状态 1:h5评论  2:微信小程序评论
   *  @param {string} commentDO.alias - 内容别名 必填
   *  @param {number} commentDO.userType - 状态 0:普通用户  1:商家用户
   *  @param {string} commentDO.productComment - 用户对商品评论内容 必填
   *  @param {number} commentDO.type - 知识付费类型 1:专栏, 2:内容, 4:直播
   *  @param {number} commentDO.userId - 留言的用户id 需要填
   *  @param {number} commentDO.toUserId - 这条评论的回复的用户的id 一期可不填
   *  @param {number} commentDO.fansType - 用户的fans类型
   *  @return {Promise}
   */
  async addComment(commentDO) {
    return this.invoke('addComment', [commentDO]);
  }

  /**
   *  买家查看自己的留言历史
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/136210
   *
   *  @param {Object} commentRequestDTO -
   *  @param {number} commentRequestDTO.kdtId - 店铺id 必填
   *  @param {number} commentRequestDTO.adminId - 兼容卡门,本质也是userId
   *  @param {string} commentRequestDTO.alias - 内容别名 必填
   *  @param {number} commentRequestDTO.pageSize - 分页的size
   *  @param {number} commentRequestDTO.userId - 留言的用户id 查询用户的留言记录时必填 查询内容留言记录时不填
   *  @param {number} commentRequestDTO.pageNum - 分页的start
   *  @param {number} commentRequestDTO.chosen - 0:展示全部，1:展示精选
   *  @return {Promise}
   */
  async getCommentListByKdtIdAndAliasAndUserId(commentRequestDTO) {
    return this.invoke('getCommentListByKdtIdAndAliasAndUserId', [
      commentRequestDTO,
    ]);
  }

  /**
   *  买家删除自己的留言
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/136211
   *
   *  @param {Object} commentDO -
   *  @param {number} commentDO.kdtId - 店铺id 必填
   *  @param {boolean} commentDO.isDelete - 删除时必填
   *  @param {number} commentDO.adminId - 兼容卡门,本质也是userId
   *  @param {string} commentDO.alias - 别名 必填
   *  @param {number} commentDO.isPraise - 点赞时必填
   *  @param {number} commentDO.id - 自增主键 必填
   *  @param {number} commentDO.userId - 留言的用户id 必填
   *  @return {Promise}
   */
  async deleteCommentByKdtIdAndAliasAndCommentId(commentDO) {
    console.log('------------', commentDO);
    return this.invoke('deleteCommentByKdtIdAndAliasAndCommentId', [commentDO]);
  }

  /**
   *  买家点赞任意的留言
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/136212
   *
   *  @param {Object} commentDO -
   *  @param {number} commentDO.kdtId - 店铺id 必填
   *  @param {boolean} commentDO.isDelete - 删除时必填
   *  @param {number} commentDO.adminId - 兼容卡门,本质也是userId
   *  @param {string} commentDO.alias - 别名 必填
   *  @param {number} commentDO.isPraise - 点赞时必填
   *  @param {number} commentDO.id - 自增主键 必填
   *  @param {number} commentDO.userId - 留言的用户id 必填
   *  @return {Promise}
   */
  async praiseCommentOrCancelByKdtIdAndAliasAndCommentId(commentDO) {
    console.log('------------', commentDO);
    return this.invoke('praiseCommentOrCancelByKdtIdAndAliasAndCommentId', [
      commentDO,
    ]);
  }
}

module.exports = CommentService;
