const ClueBaseController = require('./ClueBaseController');
const ClueTagPcService = require('../../../services/owl/pc/clue/enrollsetting/ClueTagPcService');
class ClueSettingController extends ClueBaseController {
  async getIndexHTML(ctx) {
    await this.initPluginStatus();
    await ctx.render('recruit/clue/cluetags.html');
  }

  // 获取线索标签分组列表
  async getTagGroupsJson(ctx) {
    const { kdtId, request } = ctx;
    const command = request.query;

    const data = await new ClueTagPcService(ctx).findTagGroupList(kdtId, command);

    ctx.json(0, 'ok', data);
  }

  // 创建线索标签分组
  async createTagGroupJson(ctx) {
    const { kdtId, request } = ctx;

    const command = request.body;

    const data = await new ClueTagPcService(ctx).createTagGroup(kdtId, command);

    ctx.json(0, 'ok', data);
  }

  // 编辑线索标签分组
  async updateTagGroupJson(ctx) {
    const { kdtId, request } = ctx;

    const command = request.body;

    const data = await new ClueTagPcService(ctx).updateTagGroup(kdtId, command);

    ctx.json(0, 'ok', data);
  }

  // 删除线索标签分组
  async deleteTagGroupJson(ctx) {
    const { kdtId, request } = ctx;

    const { groupId } = request.body;

    const data = await new ClueTagPcService(ctx).deleteTagGroup(kdtId, groupId);

    ctx.json(0, 'ok', data);
  }

  // 获取线索标签分页
  async getTagListJson(ctx) {
    const { kdtId } = ctx;

    const { query, pageRequest } = ctx.getQueryParse();

    const data = await new ClueTagPcService(ctx).findTagPage(kdtId, pageRequest, query);

    ctx.json(0, 'ok', data);
  }

  // 创建线索标签
  async craeteTagJson(ctx) {
    const { kdtId, request } = ctx;

    const command = request.body;

    const data = await new ClueTagPcService(ctx).createTag(kdtId, command);

    ctx.json(0, 'ok', data);
  }

  // 更新标签
  async updateTagJson(ctx) {
    const { kdtId, request } = ctx;

    const command = request.body;

    const data = await new ClueTagPcService(ctx).updateTag(kdtId, command);

    ctx.json(0, 'ok', data);
  }

  // 删除线索标签
  async deleteTagJson(ctx) {
    const { kdtId, request } = ctx;

    const { tagId } = request.body;

    const data = await new ClueTagPcService(ctx).deleteTag(kdtId, tagId);

    ctx.json(0, 'ok', data);
  }

  // 删除线索标签
  async deleteTagsJson(ctx) {
    const { kdtId, request } = ctx;

    const { tagIds } = request.body;

    const data = await new ClueTagPcService(ctx).deleteTags(kdtId, tagIds);

    ctx.json(0, 'ok', data);
  }

  // 批量更换线索标签分组
  async transTagGroupJson(ctx) {
    const { kdtId, request } = ctx;

    const command = request.body;

    const data = await new ClueTagPcService(ctx).changeGroup(kdtId, command);

    ctx.json(0, 'ok', data);
  }

  // 分页查询线索标签
  async findTagGroupPage(ctx) {
    const { kdtId } = ctx;
    const { pageRequest } = ctx.getQueryParse();

    const res = await new ClueTagPcService(ctx).findTagGroupPage(kdtId, pageRequest);

    ctx.json(0, 'ok', res);
  }
}

module.exports = ClueSettingController;
