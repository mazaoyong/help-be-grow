const BaseController = require('../base/BaseController');
// const CommentPCFacade = require('../../../services/owl/api/facade/CommentPCFacade');
const ShopChainSearchService = require('../../services/shopcenter/shopfront/chain/ShopChainSearchService');
const CourseEvaluationFacade = require('../../services/owl/edu/CourseEvaluationFacade');

class CommentController extends BaseController {
  async getIndexHtml(ctx) {
    await ctx.render('edu-admin/comment/index.html');
  }

  // 根据kdtid 查询未读评论数
  async getNonReadCommentsCountByKdtId(ctx) {
    // const kdtId = ctx.kdtId;
    // const res = await new CommentPCFacade(ctx).getNonReadCommentsCountByKdtId(kdtId);
    // return ctx.json(0, 'ok', res);

    const { kdtId } = ctx;
    const commentShopDTO = {
      kdtIdList: [],
    };
    const res = await new CourseEvaluationFacade(ctx).getNonReadCommentsCountByKdtId(
      kdtId,
      commentShopDTO,
    );
    ctx.json(0, 'ok', res);
  }

  // 搜索后代店铺
  async searchDescendentShop(ctx) {
    const { query } = ctx;
    const { hqKdtId, pageSize, pageNum, shopName } = query;
    const request = {
      hqKdtId,
      pageSize,
      pageNum,
      shopName,
      // 店铺连锁角色，1:总部，2:网店，3:仓库，4:合伙人
      shopRoleList: [2],
    };
    const res = await new ShopChainSearchService(ctx).searchDescendentShop(request);
    ctx.json(0, 'ok', res);
  }

  // B端分页获取评论列表
  async getCommentPageForShop(ctx) {
    const { kdtId, query } = ctx;
    const { pageNum, pageSize, contentId, chosenSticky, alias, subKdtId } = query;
    const commentRequestDTO = {
      contentId,
      chosenSticky: chosenSticky === '' ? null : chosenSticky,
      alias,
      kdtIdList: subKdtId === '' ? null : [subKdtId],
    };
    const pageRequest = {
      pageNumber: Number(pageNum),
      pageSize: pageSize,
      sort: {
        orders: [
          {
            direction: 'DESC',
            property: 'created_at',
            nullHandling: null,
          },
        ],
      },
    };
    const res = await new CourseEvaluationFacade(ctx).getCommentPageForShop(
      kdtId,
      commentRequestDTO,
      pageRequest,
    );
    ctx.json(0, 'ok', res);
  }
  // B端置顶评论
  async setCommentChosenSticky(ctx) {
    const { kdtId, request } = ctx;
    const { id, isSticky, isChosen, isHide, kdtId: commentKdtId } = request.body;
    // kdtIdList 为一个数组是后端接口的历史遗留问题
    const commentShopDTO = { id, isSticky, isChosen, isHide, kdtIdList: [commentKdtId] };
    const res = await new CourseEvaluationFacade(ctx).setCommentChosenSticky(kdtId, commentShopDTO);
    ctx.json(0, 'ok', res);
  }
  // B端批量处理评论
  async setBatchCommentChosenSticky(ctx) {
    const { kdtId, request } = ctx;
    const { itemList, isSticky, isChosen, isHide } = request.body;
    const commentShopDTO = { itemList, isSticky, isChosen, isHide, operator: this.formatOperator };
    const res = await new CourseEvaluationFacade(ctx).batchSetCommentChosenSticky(
      kdtId,
      commentShopDTO,
    );
    ctx.json(0, 'ok', res);
  }
  // B端回复评论
  async replyComment(ctx) {
    const { kdtId, request } = ctx;
    const { productComment, toCommentId, toUserId, contentId, alias, subKdtId } = request.body;
    const commentDTO = {
      productComment,
      toCommentId,
      userId: this.formatOperator.userId,
      toUserId,
      contentId,
      alias,
      kdtIdList: subKdtId === '' ? null : [subKdtId],
    };
    const res = await new CourseEvaluationFacade(ctx).replyComment(kdtId, commentDTO);
    ctx.json(0, 'ok', res);
  }
  // B端删除评论
  async deleteComment(ctx) {
    const { kdtId, request } = ctx;
    const { id, contentId, kdtId: commentKdtId } = request.body;
    const commentDTO = {
      id,
      contentId,
      // kdtIdList 为一个数组是后端接口的历史遗留问题
      kdtIdList: [commentKdtId],
    };
    const res = await new CourseEvaluationFacade(ctx).deleteComment(kdtId, commentDTO);
    ctx.json(0, 'ok', res);
  }
  // 获取一家店的知识付费的所有内容的未读评论总数
  // async getNonReadCommentsCountByKdtIdV2(ctx) {
  //   const { kdtId } = ctx;
  //   const commentShopDTO = {
  //     kdtIdList: [],
  //   };
  //   const res = await new CourseEvaluationFacade(ctx).getNonReadCommentsCountByKdtId(kdtId, commentShopDTO);
  //   ctx.json(0, 'ok', res);
  // }
  // 点开内容的评论后，评论数清零
  async readComments(ctx) {
    const { kdtId, request } = ctx;
    const { alias } = request.body;
    const commentShopDTO = {
      alias,
    };
    const res = await new CourseEvaluationFacade(ctx).readComments(kdtId, commentShopDTO);
    ctx.json(0, 'ok', res);
  }
  // 留言课程列表
  async findPageByKdtId(ctx) {
    const { kdtId, query } = ctx;
    const { sortBy, pageNum } = query;
    const commentShopQueryDTO = {
      kdtIdList: [],
    };
    const pageRequest = {
      pageNumber: Number(pageNum),
      pageSize: 20,
      sort: {
        orders: [
          {
            direction: 'DESC',
            property: sortBy,
            nullHandling: null,
          },
        ],
      },
    };
    const res = await new CourseEvaluationFacade(ctx).findPageByKdtId(
      kdtId,
      commentShopQueryDTO,
      pageRequest,
    );
    ctx.json(0, 'ok', res);
  }
}

module.exports = CommentController;
