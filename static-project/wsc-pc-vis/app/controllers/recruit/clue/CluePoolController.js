const ClueExportFacade = require('../../../services/api/owl/pc/ClueExportFacade');
const ClueBaseController = require('./ClueBaseController');
const AttributeItemService = require('../../../services/owl/pc/clue/AttributeItemService');
const UnifiedAttributeItemService = require('../../../services/owl/pc/clue/UnifiedAttributeItemService');
const ClueQueryFacade = require('../../../services/owl/pc/clue/ClueQueryFacade');
const ClueRecordFacade = require('../../../services/owl/pc/clue/ClueRecordFacade');
const ClueOperateFacade = require('../../../services/owl/pc/clue/ClueOperateFacade');
const RelatedOrderFacade = require('../../../services/owl/pc/clue/RelatedOrderFacade');
const StaffService = require('../../../services/sam/StaffService');

class CluePoolController extends ClueBaseController {
  async setNewClueWhiteList(ctx) {
    await this.setWhiteList(ctx, [{ key: 'clue_list', name: 'useNewClueList' }]);
  }

  async getIndexHtml(ctx) {
    await this.initPluginStatus();
    await this.initUserRole();
    await this.initExportable();
    ctx.setGlobal('operator', this.operator || {});
    ctx.setGlobal('userInfo', ctx.getLocalSession('userInfo'));
    await this.setNewClueWhiteList(ctx);
    await ctx.render('recruit/clue/cluepool.html');
  }

  async getAllIndexHtml(ctx) {
    await this.initPluginStatus();
    await this.initUserRole();
    await this.initExportable();
    ctx.setGlobal('operator', this.operator || {});
    ctx.setGlobal('userInfo', ctx.getLocalSession('userInfo'));
    await this.setNewClueWhiteList(ctx);
    await ctx.render('recruit/clue/clueall.html');
  }

  async getMineIndexHtml(ctx) {
    await this.initPluginStatus();
    await this.initUserRole();
    ctx.setGlobal('operator', this.operator || {});
    ctx.setGlobal('userInfo', ctx.getLocalSession('userInfo'));
    await this.setNewClueWhiteList(ctx);
    await ctx.render('recruit/clue/cluemine.html');
  }

  // 查询线索详情
  async getDetailById(ctx) {
    const { kdtId } = ctx;
    const { clueId } = ctx.getQueryParse();

    const res = await new ClueQueryFacade(ctx).getDetailById(kdtId, clueId);

    ctx.json(0, 'ok', res);
  }

  // 查询线索详情
  async getDetailByIdForHide(ctx) {
    const { kdtId } = ctx;
    const { clueId } = ctx.getQueryParse();

    const res = await new ClueQueryFacade(ctx).getDetailByIdForHide(kdtId, clueId);

    ctx.json(0, 'ok', res);
  }

  // 修改线索状态
  async changeState(ctx) {
    const { kdtId } = ctx;
    const { clueId, targetStateCode, orderNo: relatedOrderNo } = ctx.request.body;
    const operator = this.formatOperator;

    const res = await new ClueOperateFacade(ctx).changeState(kdtId, {
      clueId,
      targetStateCode,
      operator,
      relatedOrderNo,
    });

    ctx.json(0, 'ok', res);
  }

  // 查询线索关联订单
  async queryRelatedOrder(ctx) {
    const { kdtId } = ctx;
    const {
      params: { page, query },
    } = ctx.getQueryParse();
    query.operator = this.formatOperator;
    const res = await new RelatedOrderFacade(ctx).query(kdtId, page, query);

    ctx.json(0, 'ok', res);
  }

  // 查询线索订单归属校区
  async checkOrderBelongsTo(ctx) {
    const { kdtId } = ctx;
    const { query } = ctx.getQueryParse();
    const res = await new RelatedOrderFacade(ctx).getRelatedOrderWithCheck(kdtId, {
      clueId: +query.clueId,
      orderNo: query.orderNo,
    });
    ctx.json(0, 'ok', res);
  }

  // 领取线索(批量)
  async takeClues(ctx) {
    const { kdtId } = ctx;
    const { clueIds } = ctx.request.body;
    const operator = this.formatOperator;

    const res = await new ClueOperateFacade(ctx).takeClues(kdtId, { clueIds, operator });

    ctx.json(0, 'ok', res);
  }

  // 分配线索(批量)
  async distributeClues(ctx) {
    const { kdtId } = ctx;
    const req = ctx.request.body;
    const operator = this.formatOperator;

    const res = await new ClueOperateFacade(ctx).distributeClues(kdtId, { ...req, operator });

    ctx.json(0, 'ok', res);
  }

  // 放弃线索(批量)
  async giveUpClues(ctx) {
    const { kdtId } = ctx;
    const { reason, clueIds } = ctx.request.body;
    const operator = this.formatOperator;

    const res = await new ClueOperateFacade(ctx).giveUpClues(kdtId, { reason, clueIds, operator });

    ctx.json(0, 'ok', res);
  }

  // 删除线索(批量)
  async deleteClues(ctx) {
    const { kdtId } = ctx;
    const { reason, clueIds, reasonId } = ctx.request.body;
    const operator = this.formatOperator;
    const res = await new ClueOperateFacade(ctx).deleteClues(kdtId, { reason, clueIds, reasonId, operator });

    ctx.json(0, 'ok', res);
  }

  // 永久删除线索（批量）
  async permanentlyDeleteClues(ctx) {
    const { kdtId } = ctx;
    const { clueIds = [], reason } = ctx.request.body;
    const operator = this.formatOperator;

    const data = await new ClueOperateFacade(ctx).permanentlyDeleteClues(kdtId, {
      clueIds,
      operator,
      reason,
    });
    return ctx.json(0, 'ok', data);
  }

  // 还原线索(批量)
  async restoreClues(ctx) {
    const { kdtId } = ctx;
    const { reason, clueIds, restoreType, userId } = ctx.request.body;
    const operator = this.formatOperator;

    const res = await new ClueOperateFacade(ctx).restoreClues(kdtId, {
      reason,
      clueIds,
      operator,
      userId,
      restoreType,
    });

    ctx.json(0, 'ok', res);
  }

  // 转让线索(批量)
  async transferClues(ctx) {
    const { kdtId } = ctx;
    const req = ctx.request.body;
    const operator = this.formatOperator;

    const res = await new ClueOperateFacade(ctx).transferClues(kdtId, { ...req, operator });

    ctx.json(0, 'ok', res);
  }

  // 线索标签更新接口
  async updateClueTags(ctx) {
    const { kdtId } = ctx;
    const { clueId, tagIds } = ctx.request.body;
    const operator = this.formatOperator;

    const res = await new ClueOperateFacade(ctx).updateClueTags(kdtId, {
      tagIds,
      clueId,
      operator,
    });

    ctx.json(0, 'ok', res);
  }

  async findAttributeItems(ctx) {
    // 获取资料项列表
    const { kdtId } = ctx;
    const res = await new AttributeItemService(ctx).findAttributeItemsByKdtId(kdtId);

    return ctx.json(0, 'ok', res);
  }

  async findUnifiedAttributeItems(ctx) {
    // 获取客户资料项列表
    const { kdtId, query } = ctx;
    const res = await new UnifiedAttributeItemService(ctx).findAttributeItemsByKdtId(kdtId, query);
    return ctx.json(0, 'ok', res);
  }

  async createClue(ctx) {
    const { kdtId } = ctx;
    const { command } = ctx.request.body;

    command.operator = this.formatOperator;

    const res = await new ClueOperateFacade(ctx).create(kdtId, command);

    return ctx.json(0, 'ok', res);
  }

  async updateClue(ctx) {
    const { kdtId } = ctx;
    const { command } = ctx.request.body;

    command.operator = this.formatOperator;

    const res = await new ClueOperateFacade(ctx).update(kdtId, command);

    return ctx.json(0, 'ok', res);
  }

  // 分页查询跟进记录列表
  async findPageClueRecords(ctx) {
    const { kdtId } = ctx;
    const { recordQuery, pageRequest } = ctx.getQueryParse();

    const res = await new ClueRecordFacade(ctx).findPageClueRecords(
      kdtId,
      recordQuery,
      pageRequest,
    );

    ctx.json(0, 'ok', res);
  }

  // 线索详情页添加跟进记录
  async createClueRecord(ctx) {
    const { kdtId } = ctx;
    const req = ctx.request.body;
    const operator = this.formatOperator;

    const res = await new ClueRecordFacade(ctx).createClueRecord(kdtId, { ...req, operator });

    ctx.json(0, 'ok', res);
  }

  // 线索详情页更新跟进记录
  async updateClueRecord(ctx) {
    const { kdtId } = ctx;
    const req = ctx.request.body;
    const operator = this.formatOperator;

    const res = await new ClueRecordFacade(ctx).updateClueRecord(kdtId, { ...req, operator });

    ctx.json(0, 'ok', res);
  }

  // 全部线索
  async findAllByPage(ctx) {
    const { kdtId } = ctx;
    const { request = {}, clueInfoQuery = {} } = ctx.getQueryParse();
    ['recordDateRange', 'createAtDateRange', 'revisitDateRange'].forEach(key => {
      if (clueInfoQuery[key]) {
        clueInfoQuery[key].startTime = Number(clueInfoQuery[key].startTime);
        clueInfoQuery[key].endTime = Number(clueInfoQuery[key].endTime);
      }
    });
    const data = await new ClueQueryFacade(ctx).findAllByPage(kdtId, request, clueInfoQuery);
    return ctx.json(0, 'ok', data);
  }

  // 线索池
  async findPublicPoolByPage(ctx) {
    const { kdtId } = ctx;
    const { request = {}, clueInfoQuery = {} } = ctx.getQueryParse();
    ['recordDateRange', 'createAtDateRange', 'revisitDateRange'].forEach(key => {
      if (clueInfoQuery[key]) {
        clueInfoQuery[key].startTime = Number(clueInfoQuery[key].startTime);
        clueInfoQuery[key].endTime = Number(clueInfoQuery[key].endTime);
      }
    });
    const data = await new ClueQueryFacade(ctx).findPublicPoolByPage(kdtId, request, clueInfoQuery);
    return ctx.json(0, 'ok', data);
  }

  // 我的线索
  async findMyClueByPage(ctx) {
    const { kdtId } = ctx;
    const { request = {}, clueInfoQuery = {} } = ctx.getQueryParse();
    ['recordDateRange', 'createAtDateRange', 'revisitDateRange'].forEach(key => {
      if (clueInfoQuery[key]) {
        clueInfoQuery[key].startTime = Number(clueInfoQuery[key].startTime);
        clueInfoQuery[key].endTime = Number(clueInfoQuery[key].endTime);
      }
    });
    const data = await new ClueQueryFacade(ctx).findMyClueByPage(kdtId, request, clueInfoQuery);
    return ctx.json(0, 'ok', data);
  }

  // 全部线索加统计
  async findAllByPageWithCount(ctx) {
    const { kdtId } = ctx;
    const { request = {}, clueInfoQuery = {} } = ctx.getQueryParse();
    ['recordDateRange', 'createAtDateRange', 'revisitDateRange'].forEach(key => {
      if (clueInfoQuery[key]) {
        clueInfoQuery[key].startTime = Number(clueInfoQuery[key].startTime);
        clueInfoQuery[key].endTime = Number(clueInfoQuery[key].endTime);
      }
    });
    const data = await new ClueQueryFacade(ctx).findAllByPageWithCount(kdtId, request, clueInfoQuery);
    return ctx.json(0, 'ok', data);
  }

  // 线索池加统计
  async findPublicPoolByPageWithCount(ctx) {
    const { kdtId } = ctx;
    const { request = {}, clueInfoQuery = {} } = ctx.getQueryParse();
    ['recordDateRange', 'createAtDateRange', 'revisitDateRange'].forEach(key => {
      if (clueInfoQuery[key]) {
        clueInfoQuery[key].startTime = Number(clueInfoQuery[key].startTime);
        clueInfoQuery[key].endTime = Number(clueInfoQuery[key].endTime);
      }
    });
    const data = await new ClueQueryFacade(ctx).findPublicPoolByPageWithCount(kdtId, request, clueInfoQuery);
    return ctx.json(0, 'ok', data);
  }

  // 我的线索加统计
  async findMyClueByPageWithCount(ctx) {
    const { kdtId } = ctx;
    const { request = {}, clueInfoQuery = {} } = ctx.getQueryParse();
    ['recordDateRange', 'createAtDateRange', 'revisitDateRange'].forEach(key => {
      if (clueInfoQuery[key]) {
        clueInfoQuery[key].startTime = Number(clueInfoQuery[key].startTime);
        clueInfoQuery[key].endTime = Number(clueInfoQuery[key].endTime);
      }
    });
    const data = await new ClueQueryFacade(ctx).findMyClueByPageWithCount(kdtId, request, clueInfoQuery);
    return ctx.json(0, 'ok', data);
  }

  async findMyRole(ctx) {
    const dto = {
      adminId: this.operator.operatorId,
      biz: 'wsc',
      kdtId: ctx.kdtId,
    };
    const res = await new StaffService(ctx).findStaffRole(dto);
    return ctx.json(0, 'ok', res);
  }

  async postExportClueJson() {
    const { ctx } = this;
    const requestData = ctx.getPostData();
    const operator = this.formatOperator;

    const filterOptions = requestData.query || {};

    ['recordDateRange', 'createAtDateRange', 'revisitDateRange'].forEach(key => {
      const dateOption = filterOptions[key];
      if (typeof dateOption !== 'object') {
        delete filterOptions[key];
        return;
      }
      if (!dateOption.startTime) {
        delete dateOption.startTime;
      }
      if (!dateOption.endTime) {
        delete dateOption.endTime;
      }
    });

    const query = { ...filterOptions, operator };

    const result = await new ClueExportFacade(ctx).exportClue(ctx.kdtId, query);
    ctx.success(result);
  }
}

module.exports = CluePoolController;
