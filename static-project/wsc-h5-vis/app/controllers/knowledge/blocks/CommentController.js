const KnowledgeBaseController = require('../KnowledgeBaseController');
const CommentService = require('../../../services/knowledge/blocks/CommentService');

class CommentController extends KnowledgeBaseController {
  /**
   * 获取内容留言列表
   */
  async getListJson(ctx) {
    const { alias = '', pageNum = 1, pageSize = 20, chosen } = ctx.query;
    const kdtId = ctx.kdtId;
    const userId = ctx.buyerId;
    const ret = await new CommentService(ctx).getCommentListByKdtIdAndAlias({
      kdtId, alias, pageNum, pageSize, userId, chosen,
    });
    ctx.json(0, 'ok', ret);
  }

  /**
   * 获取用户留言记录列表
   */
  async getUserlistJson(ctx) {
    const { alias = '', pageNum = 1, pageSize = 20, chosen } = ctx.query;
    const kdtId = ctx.kdtId;
    const userId = ctx.buyerId;
    const ret = await new CommentService(ctx).getCommentListByKdtIdAndAliasAndUserId({
      kdtId, alias, userId, pageNum, pageSize, chosen,
    });
    ctx.json(0, 'ok', ret);
  }

  /**
   * 增加评论
   */
  async postAddJson(ctx) {
    const {
      alias = '',
      productComment = '',
      userType = 1,
      commentType = 1,
    } = ctx.getPostData();
    const kdtId = ctx.kdtId;
    const userId = ctx.buyerId;
    const ret = await new CommentService(ctx).addComment({
      kdtId, alias, userId, userType, productComment, commentType,
    });
    ctx.json(0, 'ok', ret);
  }

  /**
   * 点赞
   */
  async postPraiseJson(ctx) {
    const { id = '', isPraise = '', alias = '' } = ctx.getPostData();
    const kdtId = ctx.kdtId;
    const userId = ctx.buyerId;
    const ret = await new CommentService(ctx).praiseCommentOrCancelByKdtIdAndAliasAndCommentId({
      userId, kdtId, id, isPraise, alias,
    });
    ctx.json(0, 'ok', ret);
  }

  /**
   * 删除评论
   */
  async postDeleteJson(ctx) {
    const { id = '', alias = '', isDelete = true } = ctx.getPostData();
    const kdtId = ctx.kdtId;
    const userId = ctx.buyerId;
    const ret = await new CommentService(ctx).deleteCommentByKdtIdAndAliasAndCommentId({
      userId, kdtId, id, alias, isDelete,
    });
    ctx.json(0, 'ok', ret);
  }
}

module.exports = CommentController;
