const BaseController = require('../../base/BaseController');
const QuestionsFacade = require('../../../services/owl/pc/questions/QuestionFacade');

class QuestionBankImportController extends BaseController {
  async createImportTask(ctx) {
    const { kdtId } = ctx;
    const command = ctx.request.body;
    const operator = this.formatOperator;

    const res = await new QuestionsFacade(ctx).createImportTask(
      kdtId,
      Object.assign({}, command, { operator })
    );

    ctx.json(0, 'ok', res);
  }

  async findImportTaskByPage(ctx) {
    const { kdtId } = ctx;
    const pageRequest = ctx.getQueryParse();

    const res = await new QuestionsFacade(ctx).findImportTaskByPage(
      kdtId,
      pageRequest,
      {}
    );

    // 统一导入一二期数据结构
    const content = res.content && res.content.map(importItem => {
      const { createdAt, importProgress, failedMsg, failedFileUrl, ...data } = importItem;
      const message = failedMsg || (failedFileUrl ? '请下载失败报表，修改后重新导入' : '');
      return {
        importType: 7, // 题库导入
        createAt: createdAt,
        importStage: importProgress,
        message,
        failedFileUrl,
        ...data,
      };
    });

    ctx.json(0, 'ok', { ...res, content });
  }
}

module.exports = QuestionBankImportController;
