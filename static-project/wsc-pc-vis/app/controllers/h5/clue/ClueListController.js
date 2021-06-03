const BaseController = require('../base/BaseController');
const ClueTagPcService = require('../../../services/owl/pc/clue/enrollsetting/ClueTagPcService');
const ClueSourcePcService = require('../../../services/owl/pc/clue/ClueSourcePcService');
const ClueQueryFacade = require('../../../services/owl/pc/clue/ClueQueryFacade');

class ClueListController extends BaseController {
  //  我的线索列表页
  async getIndexHtml(ctx) {
    await ctx.render('h5/my-clue.html');
  }

  formatToNumber(obj = {}) {
    for (let key in obj) {
      if (obj[key]) {
        obj[key] = Number(obj[key]);
      }
    }

    return obj;
  }

  // 分页获取标签列表
  async getFindTagGroupPageJson(ctx) {
    const kdtId = ctx.kdtId;
    const pageRequest = {
      pageNumber: Number(ctx.query.pageNumber),
      pageSize: ctx.query.pageSize || 10,
    };
    const result = await new ClueTagPcService(ctx).findTagGroupPage(kdtId, { ...pageRequest });
    ctx.json(0, 'ok', result);
  }

  // 分页获取来源列表
  async getFindSourceGroupPageJson(ctx) {
    const kdtId = ctx.kdtId;
    const pageRequest = {
      pageNumber: Number(ctx.query.pageNumber),
      pageSize: Number(ctx.query.pageSize || 10),
    };
    const query = {
      needSystemDefault: ctx.query.needSystemDefault || true,
    };
    const result = await new ClueSourcePcService(ctx).findSourceGroupPage(kdtId, { ...pageRequest }, query);
    ctx.json(0, 'ok', result);
  }

  // 分页获取线索列表
  async getFindMyClueByPageJson(ctx) {
    const kdtId = ctx.kdtId;
    const ownerId = this.formatOperator.userId;
    let { clueInfoQuery = {}, direction, property, pageNumber } = ctx.getQueryParse();
    clueInfoQuery.ownerId = ownerId;
    let { recordDateRange, createAtDateRange, revisitDateRange } = clueInfoQuery;
    recordDateRange = this.formatToNumber(recordDateRange);
    createAtDateRange = this.formatToNumber(createAtDateRange);
    revisitDateRange = this.formatToNumber(revisitDateRange);
    clueInfoQuery.recordDateRange = recordDateRange;
    clueInfoQuery.createAtDateRange = createAtDateRange;
    clueInfoQuery.revisitDateRange = revisitDateRange;
    const request = {
      pageNumber: Number(pageNumber),
    };
    if (direction) {
      request.sort = {
        orders: [{
          direction,
          property,
        }],
      };
    }

    const result = await new ClueQueryFacade(ctx).findMyClueByPage(
      kdtId, request, clueInfoQuery
    );
    ctx.json(0, 'ok', result);
  }
};

module.exports = ClueListController;
