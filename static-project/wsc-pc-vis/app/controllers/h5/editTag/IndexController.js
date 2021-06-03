/**
 * 有赞教育店铺创建相关
 */
const BaseController = require('../base/BaseController');
const ClueTagPcService = require('../../../services/owl/pc/clue/enrollsetting/ClueTagPcService');
const ClueOperateService = require('../../../services/owl/pc/clue/ClueOperateService');

class IndexController extends BaseController {
  async findTagGroupPage(ctx) { // 获取线索标签列表
    const { kdtId } = ctx;
    const { pageSize, pageNumber } = ctx.query;
    const pageRequest = {
      pageSize,
      pageNumber,
    };
    const res = await new ClueTagPcService(ctx).findTagGroupPage(kdtId, pageRequest);

    return ctx.json(0, 'ok', res);
  }

  async updateClueTags(ctx) { // 保存线索标签
    const { kdtId } = ctx;
    const { clueId, tagIds } = ctx.request.body;
    const userId = ctx.getLocalSession('userInfo').id;
    const mobile = ctx.getLocalSession('userInfo').mobile;
    const source = 'wsc-pc-vis';
    const command = {
      clueId,
      operator: {
        userId,
        mobile,
        source,
      },
      tagIds,
    };
    const res = await new ClueOperateService(ctx).updateClueTags(kdtId, command);

    return ctx.json(0, 'ok', res);
  }
}

module.exports = IndexController;
