const BaseController = require('../../base/BaseController');
const ExerciseBookFacade = require('../../../services/api/owl/pc/ExerciseBookFacade');
const ExerciseBookStatisticsFacade = require('../../../services/api/owl/pc/ExerciseBookStatisticsFacade');
const { checkEduChainStore } = require('@youzan/utils-shop');

class WorkbookController extends BaseController {
  async init(ctx) {
    super.init();
  }

  async getIndexHtml(ctx) {
    await this.initVisPage(ctx).catch(e => console.error(e));
    await this.initBdappInfo(ctx).catch(e => console.error(e));

    await this.ctx.getAbilitiesByMultiNamespaceV2(
      ctx,
      [{ businessName: 'edu', namespaceName: '督学互动' }],
      { shopInfo: ctx.getState('shopInfo') }
    );

    ctx.setState('isEduChainStore', checkEduChainStore(ctx.getState('shopInfo')));

    await ctx.render('supv/homework/workbook.html');
  }

  // 分页查询作业本列表
  async findPageByCondition(ctx) {
    const { kdtId } = ctx;
    const { query, pageRequest } = ctx.getQueryParse() || {};
    const result = await new ExerciseBookFacade(ctx).findPageByCondition(kdtId, pageRequest, query);
    ctx.json(0, 'ok', result);
  }

  // 作业本上下架
  async updateExerciseBookSoldStatus(ctx) {
    const { kdtId } = ctx;
    const { id, status } = ctx.request.body || {};
    const operator = this.formatOperator || {};
    const result = await new ExerciseBookFacade(ctx).updateExerciseBookSoldStatus(kdtId, { id, operator, status });
    ctx.json(0, 'ok', result);
  }

  // 创建作业本
  async createExerciseBook(ctx) {
    const { kdtId } = ctx;
    const params = ctx.request.body || {};
    const operator = this.formatOperator || {};
    const result = await new ExerciseBookFacade(ctx).createExerciseBook(kdtId, { ...params, operator });
    ctx.json(0, 'ok', result);
  }

  // 更新作业本
  async updateExerciseBook(ctx) {
    const { kdtId } = ctx;
    const params = ctx.request.body || {};
    const operator = this.formatOperator || {};
    const result = await new ExerciseBookFacade(ctx).updateExerciseBook(kdtId, { ...params, operator });
    ctx.json(0, 'ok', result);
  }

  // 删除作业本
  async deleteExerciseBook(ctx) {
    const { kdtId } = ctx;
    const params = ctx.request.body || {};
    const operator = this.formatOperator || {};
    const result = await new ExerciseBookFacade(ctx).deleteExerciseBook(kdtId, { ...params, operator });
    ctx.json(0, 'ok', result);
  }

  // 获取作业本详情
  async getExerciseBookDetail(ctx) {
    const { kdtId } = ctx;
    const { id } = ctx.getQueryParse() || {};
    const result = await new ExerciseBookFacade(ctx).getExerciseBookDetail(kdtId, id);
    ctx.json(0, 'ok', result);
  }

  // 获取作业本概览数据
  async getExerciseBookOverview(ctx) {
    const { kdtId } = ctx;
    const { exerciseBookId } = ctx.getQueryParse() || {};
    const result = await new ExerciseBookStatisticsFacade(ctx).getExerciseBookOverview(kdtId, exerciseBookId);
    ctx.json(0, 'ok', result);
  }

  // 获取班级列表 - （作业本）
  async findClassPageByCondition(ctx) {
    const { kdtId } = ctx;
    const { query, pageRequest } = ctx.getQueryParse() || {};
    const result = await new ExerciseBookFacade(ctx).findClassPageByCondition(kdtId, pageRequest, query);
    ctx.json(0, 'ok', result);
  }

  // 获取班级关联作业本列表
  async findExerciseRelClassPage(ctx) {
    const { kdtId } = ctx;
    const { query, pageRequest } = ctx.getQueryParse() || {};
    const result = await new ExerciseBookFacade(ctx).findExerciseRelClassPage(kdtId, pageRequest, query);
    ctx.json(0, 'ok', result);
  }
}

module.exports = WorkbookController;
