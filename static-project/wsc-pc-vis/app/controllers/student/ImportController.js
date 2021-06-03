const BaseController = require('../base/BaseController');
const ImportFacade = require('../../services/owl/pc/importtask/ImportFacade');
const StuImportFacade = require('../../services/owl/pc/importtask/StuImportFacade');
const StuImportRowFacade = require('../../services/owl/pc/importtask/StuImportRowFacade');
const StaffService = require('../../services/sam/StaffService');
const StaffReadService = require('../../services/staff/core/StaffReadService');
const SingleStaffService = require('../../services/sam/gateway/staff/SingleStaffService');

class ImportController extends BaseController {
  async getIndexHtml(ctx) {
    await ctx.render('student/import/studentImport.html');
  }

  async createImportTask(ctx) {
    const { kdtId } = ctx;
    const { clientIp, source, mobile, userId, nickName } = this.formatOperator;

    const rawStaffInfo = await new StaffService(ctx).getStaff({
      kdtId,
      adminId: userId,
    });

    const operator = {
      userId,
      nickName: (rawStaffInfo && rawStaffInfo.name) || nickName,
      mobile,
      source,
      clientIp,
    };

    const req = ctx.request.body || {};
    req.targetKdtId = req.subshop || kdtId;
    req.operator = operator;

    const res = await new StuImportFacade(ctx).create(kdtId, req);
    ctx.json(0, 'success', res);
  }

  async findImportTaskByPage(ctx) {
    const { kdtId } = ctx;
    const { query = {}, pageRequest = {} } = ctx.getQueryParse();

    const res = await new StuImportFacade(ctx).findByPage(kdtId, query, pageRequest);
    ctx.json(0, 'success', res);
  }

  async findRowsByPage(ctx) {
    const { kdtId } = ctx;
    const { query = {}, pageRequest = {} } = ctx.getQueryParse();

    const res = await new StuImportRowFacade(ctx).findRowsByPage(kdtId, query, pageRequest);
    ctx.json(0, 'success', res);
  }

  async findRowsDesensitizeByPage(ctx) {
    const { kdtId } = ctx;
    const { query = {}, pageRequest = {} } = ctx.getQueryParse();

    const res = await new StuImportRowFacade(ctx).findRowsDesensitizeByPage(
      kdtId,
      query,
      pageRequest,
    );
    ctx.json(0, 'success', res);
  }

  async getImportTask(ctx) {
    const { kdtId } = ctx;
    const { taskId } = ctx.request.query || {};
    const res = await new ImportFacade(ctx).getImportTask(kdtId, taskId);
    ctx.json(0, 'success', res);
  }

  async getChainStaffList(ctx) {
    const { kdtId, query } = ctx;
    const { targetKdtId = kdtId, pageNo, keyword } = query;
    const commonOptions = {
      mode: 'CHAIN_SHOP',
    };
    const chainOptions = {
      kdtIds: [targetKdtId],
    };
    const fieldOptions = {
      keyword,
      keywordMatchFields: ['NAME'],
    };
    const params = {
      kdtId,
      operatorId: this.formatOperator.userId,
      pageNo,
      fieldOptions,
      commonOptions,
      chainOptions,
    };
    const data = await new StaffReadService(ctx).queryPage(params);

    ctx.json(0, 'ok', data);
  }

  async getSingleShopStaffList(ctx) {
    const { kdtId, query } = ctx;
    const querySingleStaffRequest = Object.assign({}, query, { kdtId });
    const data = await new SingleStaffService(ctx).find(querySingleStaffRequest);

    ctx.json(0, 'ok', data);
  }

  async getRowById(ctx) {
    const { kdtId } = ctx;
    const { query = {} } = ctx.getQueryParse();
    const { taskId = 0, rowId = 0 } = query;

    const data = await new StuImportRowFacade(ctx).getRowById(kdtId, taskId, rowId);
    ctx.json(0, 'success', data);
  }

  async saveRow(ctx) {
    const { kdtId } = ctx;
    const { rowFields = [], taskId, rowId } = ctx.request.body || {};
    const saveCommand = {
      operator: this.formatOperator,
      rowFields,
      taskId,
    };

    if (rowId) {
      saveCommand.rowId = rowId;
    }

    const data = await new StuImportRowFacade(ctx).saveRow(kdtId, saveCommand);
    ctx.json(0, 'success', data);
  }

  async batchUpdateFields(ctx) {
    const { kdtId } = ctx;
    const updateCommand = Object.assign({}, ctx.request.body, { operator: this.formatOperator });

    const data = await new StuImportRowFacade(ctx).batchUpdateFields(kdtId, updateCommand);
    ctx.json(0, 'success', data);
  }

  async batchDeleteRows(ctx) {
    const { kdtId } = ctx;
    const deleteRowsCommand = Object.assign({}, ctx.request.body, {
      operator: this.formatOperator,
    });

    const data = await new StuImportRowFacade(ctx).batchDeleteRows(kdtId, deleteRowsCommand);
    ctx.json(0, 'success', data);
  }

  async prepareImport(ctx) {
    const { kdtId } = ctx;
    const { taskId } = ctx.request.body || {};

    const data = await new StuImportFacade(ctx).prepareImport(kdtId, taskId);
    ctx.json(0, 'success', data);
  }

  async getValidateSummary(ctx) {
    const { kdtId } = ctx;
    const { taskId } = ctx.getQueryParse();

    const data = await new StuImportFacade(ctx).getValidateSummary(kdtId, taskId);
    ctx.json(0, 'success', data);
  }

  async submitImport(ctx) {
    const { kdtId } = ctx;
    const { taskId, cover } = ctx.request.body || {};

    const data = await new StuImportFacade(ctx).submitImport(kdtId, { taskId, cover });
    ctx.json(0, 'success', data);
  }

  async findTaskProgress(ctx) {
    const { kdtId } = ctx;

    const { query } = ctx.getQueryParse();
    const data = await new StuImportFacade(ctx).findTaskProgress(kdtId, query);
    ctx.json(0, 'success', data);
  }

  async getByTaskId(ctx) {
    const { kdtId } = ctx;

    const { taskId } = ctx.getQueryParse();
    const data = await new StuImportFacade(ctx).getByTaskId(kdtId, taskId);
    ctx.json(0, 'success', data);
  }

  async prepareReimport(ctx) {
    const { kdtId } = ctx;

    const { taskId } = ctx.request.body || {};
    const data = await new StuImportFacade(ctx).prepareReimport(kdtId, taskId);
    ctx.json(0, 'success', data);
  }

  async listRowFieldErrorSummary(ctx) {
    const { kdtId } = ctx;

    const { taskIds } = ctx.getQueryParse();
    const data = await new StuImportFacade(ctx).listRowFieldErrorSummary(kdtId, taskIds);
    ctx.json(0, 'success', data);
  }

  async findSameRows(ctx) {
    const { kdtId } = ctx;

    const data = await new StuImportRowFacade(ctx).findSameRows(kdtId, ctx.getQueryParse());
    ctx.json(0, 'success', data);
  }

  async getSameData(ctx) {
    const { kdtId } = ctx;

    const data = await new StuImportRowFacade(ctx).getSameData(kdtId, ctx.getQueryParse());
    ctx.json(0, 'success', data);
  }

  async getTemplate(ctx) {
    const { kdtId } = ctx;
    const data = await new StuImportFacade(ctx).getTemplate(kdtId, ctx.getQueryParse());
    ctx.json(0, 'success', data);
  }

  async getHeader(ctx) {
    const { kdtId } = ctx;
    const data = await new StuImportFacade(ctx).getHeader(kdtId, ctx.getQueryParse());
    ctx.json(0, 'success', data);
  }

  async getSpecifiedHeader(ctx) {
    const { kdtId } = ctx;
    const data = await new StuImportFacade(ctx).getSpecifiedHeader(kdtId, ctx.getQueryParse());
    ctx.json(0, 'success', data);
  }

  async templateCheck(ctx) {
    const { kdtId } = ctx;
    const data = await new StuImportFacade(ctx).templateCheck(kdtId, ctx.getQueryParse());
    ctx.json(0, 'success', data);
  }

  async templateCheckByTaskId(ctx) {
    const { kdtId } = ctx;
    const { taskId } = ctx.getQueryParse();
    const data = await new StuImportFacade(ctx).templateCheckByTaskId(kdtId, taskId);
    ctx.json(0, 'success', data);
  }

  async againValidate(ctx) {
    const { kdtId } = ctx;
    const { taskId } = ctx.getQueryParse();
    const data = await new StuImportFacade(ctx).againValidate(kdtId, taskId);
    ctx.json(0, 'success', data);
  }
}

module.exports = ImportController;
