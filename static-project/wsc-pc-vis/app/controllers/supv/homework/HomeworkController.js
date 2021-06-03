const BaseController = require('../../base/BaseController');
const HomeworkFacade = require('../../../services/api/owl/pc/HomeworkFacade');
const { checkEduChainStore } = require('@youzan/utils-shop');

// 作业详情编辑 过滤xss
const homeworkFilterXss = async (ctx, params) => {
  const { detail = [] } = params || {};

  const filteredDetail = await Promise.all(detail.map(async item => {
    if (item.mediaType === 1) {
      const content = await ctx.visXss(item, 'detail.content');
      return content;
    }
    return item;
  }));

  return {
    ...params,
    detail: filteredDetail,
  };
};

class ExaminationController extends BaseController {
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

    await ctx.render('supv/homework/homework.html');
  }

  // 创建作业
  async createHomework(ctx) {
    const { kdtId } = ctx;
    const params = ctx.request.body || {};
    const operator = this.formatOperator || {};
    const data = await homeworkFilterXss(ctx, params);
    const result = await new HomeworkFacade(ctx).createHomework(kdtId, { ...data, operator });
    ctx.json(0, 'ok', result);
  }

  // 编辑作业
  async updateHomework(ctx) {
    const { kdtId } = ctx;
    const params = ctx.request.body || {};
    const operator = this.formatOperator || {};
    const data = await homeworkFilterXss(ctx, params);
    const result = await new HomeworkFacade(ctx).updateHomework(kdtId, { ...data, operator });
    ctx.json(0, 'ok', result);
  }

  // 获取作业详情
  async getHomeworkDetail(ctx) {
    const { kdtId } = ctx;
    const { homeworkId } = ctx.getQueryParse() || {};
    const result = await new HomeworkFacade(ctx).getHomeworkDetail(kdtId, homeworkId);
    ctx.json(0, 'ok', result);
  }

  // 删除作业
  async deleteHomework(ctx) {
    const { kdtId } = ctx;
    const { id } = ctx.request.body || {};
    const operator = this.formatOperator || {};
    const result = await new HomeworkFacade(ctx).deleteHomework(kdtId, { id, operator });
    ctx.json(0, 'ok', result);
  }
}

module.exports = ExaminationController;
