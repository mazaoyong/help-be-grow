/**
 * 有赞教育店铺创建相关
 */
const BaseController = require('../base/BaseController');
const AttributeItemService = require('../../../services/owl/pc/clue/AttributeItemService');
const ClueSourcePcService = require('../../../services/owl/pc/clue/ClueSourcePcService');
const ClueOperateService = require('../../../services/owl/pc/clue/ClueOperateService');
const ClueQueryFacade = require('../../../services/owl/pc/clue/ClueQueryFacade');

class IndexController extends BaseController {
  async getIndexHtml(ctx) {
    await ctx.render('h5/update-clue.html');
  }

  async findAttributeItemsByKdtId(ctx) { // 获取资料项列表
    const { kdtId } = ctx;
    const res = await new AttributeItemService(ctx).findAttributeItemsByKdtId(kdtId);

    return ctx.json(0, 'ok', res);
  }

  async findSourceGroupPage(ctx) { // 获取来源列表
    const { kdtId } = ctx;
    const { pageNumber, pageSize, needSystemDefault } = ctx.query;
    const pageRequest = {
      pageNumber,
      pageSize,
    };
    const query = {
      needSystemDefault,
    };
    const res = await new ClueSourcePcService(ctx).findSourceGroupPage(kdtId, pageRequest, query);

    return ctx.json(0, 'ok', res);
  }

  async getAttributesById(ctx) { // 获取资料项列表(编辑)
    const { kdtId } = ctx;
    const { clueId } = ctx.query;
    const res = await new ClueQueryFacade(ctx).getAttributesById(kdtId, clueId);

    return ctx.json(0, 'ok', res);
  }

  async create(ctx) { // 创建线索
    const { kdtId } = ctx;
    const { attributes, clueAddDistribute, sourceId, name, telephone } = ctx.request.body;
    const userId = ctx.getLocalSession('userInfo').id;
    const mobile = ctx.getLocalSession('userInfo').mobile;
    const source = 'wsc-pc-vis';
    const command = {
      attributes,
      clueAddDistribute,
      sourceId,
      name,
      telephone,
      operator: {
        userId,
        mobile,
        source,
      },
    };
    const res = await new ClueOperateService(ctx).create(kdtId, command);

    return ctx.json(0, 'ok', res);
  }

  async update(ctx) { // 更新线索
    const { kdtId } = ctx;
    const { attributes, clueId, sourceId } = ctx.request.body;
    const userId = ctx.getLocalSession('userInfo').id;
    const mobile = ctx.getLocalSession('userInfo').mobile;
    const source = 'wsc-pc-vis';
    const command = {
      attributes,
      clueId,
      sourceId,
      operator: {
        userId,
        mobile,
        source,
      },
    };
    const res = await new ClueOperateService(ctx).update(kdtId, command);

    return ctx.json(0, 'ok', res);
  }
}

module.exports = IndexController;
