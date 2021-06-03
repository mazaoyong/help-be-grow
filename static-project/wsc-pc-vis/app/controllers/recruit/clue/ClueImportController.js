const ClueBaseController = require('./ClueBaseController');
const StorageQiniuFileWriteService = require('../../../services/common/StorageQiniuFileWriteService');
const ClueImportService = require('../../../services/owl/pc/clue/ClueImportService');
const ClueSettingPcService = require('../../../services/owl/pc/clue/enrollsetting/ClueSettingPcService');

class ClueImportController extends ClueBaseController {
  async getIndexHTML(ctx) {
    await this.initPluginStatus();
    await ctx.render('recruit/clue/clueimport.html');
  }

  // 获取上传token
  async getUploadToken(ctx) {
    const operator = this.formatOperator;
    const request = {
      ip: operator.clientIp,
      channel: 'owl_crm_clue',
      fromApp: 'wsc-pc-vis',
      operatorType: 2,
      operatorId: operator.userId,
      maxSize: 500 * 1024 * 1024,
    };
    const data = await new StorageQiniuFileWriteService(ctx).getPrivateFileUploadToken(request);
    return ctx.json(0, 'ok', data);
  }

  // 获取线索列表
  async getClueListJSON(ctx) {
    const { kdtId } = ctx;
    const { query = {}, pageRequest = {} } = ctx.getQueryParse();

    const data = await new ClueImportService(ctx).findPage(kdtId, pageRequest, query);

    ctx.json(0, 'ok', data);
  }

  // 创建导入线索任务
  async createImportTaskJson(ctx) {
    const { kdtId, request } = ctx;
    const command = request.body;
    // 塞入操作人信息
    command.operator = this.formatOperator;

    const data = await new ClueImportService(ctx).create(kdtId, command);

    ctx.json(0, 'ok', data);
  }

  // 获取员工列表
  async getStaffListJson(ctx) {
    const { kdtId } = ctx;
    const { pageRequest } = ctx.getQueryParse();

    const data = await new ClueSettingPcService(ctx).findStaffPage(kdtId, pageRequest);

    ctx.json(0, 'ok', data);
  }

  // 获取线索导入模板
  async getImporTempJson(ctx) {
    const { kdtId } = ctx;

    const data = await new ClueImportService(ctx).getImportTemplate(kdtId);

    ctx.json(0, 'ok', data);
  }
}

module.exports = ClueImportController;
