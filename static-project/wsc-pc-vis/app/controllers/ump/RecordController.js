const BaseController = require('../base/BaseController');
const SubscriptionService = require('../../services/owl/SubscriptionService');
const ExportRecordsService = require('../../services/owl/ExportRecordsService');
const ScheduleExportFacade = require('../../services/owl/pc/schedule/ScheduleExportFacade');
const { checkEduChainStore } = require('@youzan/utils-shop');

class RecordController extends BaseController {
  async init() {
    await super.init();
    if (!this.ctx.acceptJSON) {
      await this.ctx.getAbilitiesByNamespace(this.ctx, {
        namespaceId: 'course',
        businessId: 'wsc-pc-vis',
      });
    }
  }
  // 查询订购记录列表
  async getListJson(ctx) {
    const kdtId = ctx.kdtId;
    const { orderNo, startDate, endDate, page, size, kdtIdList } = ctx.getQueryParse();
    const res = await new SubscriptionService(ctx).getSubRecordList(
      kdtId,
      orderNo,
      startDate,
      endDate,
      kdtIdList,
      page,
      size,
    );
    ctx.json(0, 'ok', res);
  }

  // 导出订购记录
  async getExportJson(ctx) {
    const kdtId = ctx.kdtId;
    const { orderNo, startDate, endDate, kdtIdList } = ctx.request.body || {};

    const { operatorName, operatorPhone } = this.operator;
    const res = await new SubscriptionService(ctx).exportOrderExcelFile(
      kdtId,
      orderNo,
      startDate,
      endDate,
      kdtIdList,
      operatorName,
      operatorPhone,
    );
    ctx.json(0, 'ok', res);
  }

  async getIndexHtml(ctx) {
    ctx.setState('isEduChainStore', checkEduChainStore(ctx.getState('shopInfo')));

    await ctx.render('ump/record/index.html');
  }
  // 导出文件列表
  async getExportsLists(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.query || {};
    req.kdtId = kdtId;

    const res = await new ExportRecordsService(ctx).getExportsLists(req);

    return ctx.json(0, 'ok', res);
  }

  // 新的导出记录列表接口
  async findPageByCondition(ctx) {
    const kdtId = ctx.kdtId;
    const query = ctx.getQueryParse() || {};
    const {
      size,
      page,
      type
    } = query;
    const pageRequest = {
      pageNumber: page,
      pageSize: size,
    };

    const result = await new ScheduleExportFacade(ctx).findPageByCondition(
      kdtId,
      pageRequest,
      {
        type
      },
    );
    ctx.json(0, 'ok', result);
  }

  // 获取下载链接
  async getDownLoadUrlById(ctx) {
    const kdtId = ctx.kdtId;
    const query = ctx.request.body || {};
    const operator = this.formatOperator;
    const params = {
      operateName: operator.nickName,
      operateMobile: operator.mobile,
      ...query,
    };
    const result = await new ScheduleExportFacade(ctx).getById(kdtId, params);
    ctx.json(0, 'ok', result);
  }
}

module.exports = RecordController;
