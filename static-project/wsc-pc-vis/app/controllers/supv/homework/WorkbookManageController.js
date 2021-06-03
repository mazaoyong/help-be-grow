const BaseController = require('../../base/BaseController');
const HomeworkFacade = require('../../../services/api/owl/pc/HomeworkFacade');
const ExerciseBookStatisticsFacade = require('../../../services/api/owl/pc/ExerciseBookStatisticsFacade');
const ExerciseRewardFacade = require('../../../services/api/owl/pc/ExerciseRewardFacade');
const { checkEduChainStore } = require('@youzan/utils-shop');

class WorkbookManageController extends BaseController {
  async init(ctx) {
    super.init();
  }

  async getIndexHtml(ctx) {
    await this.initVisPage(ctx).catch(e => console.error(e));
    await this.initBdappInfo(ctx).catch(e => console.error(e));

    ctx.setState('isEduChainStore', checkEduChainStore(ctx.getState('shopInfo')));

    await ctx.render('supv/homework/workbook.html');
  }

  // 分页查询作业本中的作业列表
  async findPageByCondition(ctx) {
    const { kdtId } = ctx;
    const { query, pageRequest } = ctx.getQueryParse() || {};
    const result = await new HomeworkFacade(ctx).findPageByCondition(kdtId, pageRequest, query);
    ctx.json(0, 'ok', result);
  }

  // 查询作业本下面的学员信息列表
  async findStudentPageByCondition(ctx) {
    const { kdtId } = ctx;
    const { query, pageRequest } = ctx.getQueryParse() || {};
    const result = await new ExerciseBookStatisticsFacade(ctx).findStudentPageByCondition(kdtId, pageRequest, query);
    ctx.json(0, 'ok', result);
  }

  // 学员列表信息导出
  async exportStudent(ctx) {
    const { kdtId } = ctx;
    const { query } = ctx.request.body || {};
    const result = await new ExerciseBookStatisticsFacade(ctx).exportStudent(kdtId,
      { ...query, operator: this.formatOperator || {} }
    );
    ctx.json(0, 'ok', result);
  }

  // 获取作业奖励规则
  async getExerciseReward(ctx) {
    const { kdtId } = ctx;
    const { query } = ctx.getQueryParse() || {};
    const result = await new ExerciseRewardFacade(ctx).getExerciseReward(kdtId, query);
    ctx.json(0, 'ok', result);
  }

  // 修改作业奖励规则
  async saveExerciseReward(ctx) {
    const { kdtId } = ctx;
    const { query } = ctx.request.body || {};
    const result = await new ExerciseRewardFacade(ctx).saveExerciseReward(kdtId, query);
    ctx.json(0, 'ok', result);
  }
}

module.exports = WorkbookManageController;
