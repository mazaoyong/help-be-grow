const ClueBaseController = require('./ClueBaseController');
const ClueSourcePcService = require('../../../services/owl/pc/clue/enrollsetting/ClueSourcePcService');
class ClueSourceController extends ClueBaseController {
  async getIndexHtml(ctx) {
    await this.initPluginStatus();
    await ctx.render('recruit/clue/cluesource.html');
  }

  // 查询线索来源分组
  async findSourceGroupList(ctx) {
    const { kdtId } = ctx;
    const query = ctx.getQueryParse();
    const data = await new ClueSourcePcService(ctx).findSourceGroupList(kdtId, query);
    return ctx.json(0, 'ok', data);
  }

  // 查询线索来源分组（带二级线索详情）
  async findSourceGroupPage(ctx) {
    const { kdtId } = ctx;
    const {
      pageRequest,
      query,
    } = ctx.getQueryParse();
    const { kdtId: subKdtId } = ctx.query;
    const data = await new ClueSourcePcService(ctx).findSourceGroupPage(subKdtId || kdtId, pageRequest, query);
    return ctx.json(0, 'ok', data);
  }

  // 创建线索来源分组
  async createSourceGroup(ctx) {
    const { kdtId } = ctx;
    const { command } = ctx.request.body;
    const data = await new ClueSourcePcService(ctx).createSourceGroup(kdtId, command);
    return ctx.json(0, 'ok', data);
  }

  // 更新线索来源分组
  async updateSourceGroup(ctx) {
    const { kdtId } = ctx;
    const { command } = ctx.request.body;
    const data = await new ClueSourcePcService(ctx).updateSourceGroup(kdtId, command);
    return ctx.json(0, 'ok', data);
  }

  // 删除线索来源分组
  async deleteSourceGroup(ctx) {
    const { kdtId } = ctx;
    const { groupId } = ctx.request.body;
    const data = await new ClueSourcePcService(ctx).deleteSourceGroup(kdtId, groupId);
    return ctx.json(0, 'ok', data);
  }

  // 查询线索来源
  async findSourcePage(ctx) {
    const { kdtId } = ctx;
    const { pageRequest = {}, query = {} } = ctx.getQueryParse();
    const data = await new ClueSourcePcService(ctx).findSourcePage(kdtId, pageRequest, query);
    return ctx.json(0, 'ok', data);
  }

  // 创建线索来源
  async createSource(ctx) {
    const { kdtId } = ctx;
    const { command } = ctx.request.body;
    const data = await new ClueSourcePcService(ctx).createSource(kdtId, command);
    return ctx.json(0, 'ok', data);
  }

  // 更新线索来源
  async updateSource(ctx) {
    const { kdtId } = ctx;
    const { command } = ctx.request.body;
    const data = await new ClueSourcePcService(ctx).updateSource(kdtId, command);
    return ctx.json(0, 'ok', data);
  }

  // 批量更改线索来源分组
  async changeGroup(ctx) {
    const { kdtId } = ctx;
    const { command } = ctx.request.body;
    const data = await new ClueSourcePcService(ctx).changeGroup(kdtId, command);
    return ctx.json(0, 'ok', data);
  }

  // 批量删除线索来源
  async batchDeleteSource(ctx) {
    const { kdtId } = ctx;
    const { sourceIds } = ctx.request.body;
    const data = await new ClueSourcePcService(ctx).batchDeleteSource(kdtId, sourceIds);
    return ctx.json(0, 'ok', data);
  }
}

module.exports = ClueSourceController;
