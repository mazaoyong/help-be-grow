const utilsShop = require('@youzan/utils-shop');
const { checkChainStore } = utilsShop;
const BaseController = require('../base/BaseController');
const ClueWorkTableFacade = require('../../../services/owl/pc/clue/ClueWorkTableFacade');

class WorkTableController extends BaseController {
  // 工作台页面
  async getIndexHtml(ctx) {
    if (checkChainStore(ctx.getState('shopInfo'))) {
      await this.setCampusInfo(ctx);
    }
    await this.checkHomeworkWhiteList(ctx);
    await ctx.render('h5/work-table.html');
  }

  // 获取工作台信息
  async getWorkTableDataJson(ctx) {
    const kdtId = ctx.kdtId;
    const { userId } = this.formatOperator;

    let result = {};
    const workTableService = new ClueWorkTableFacade(ctx);
    await Promise.all([
      workTableService.getClueDataOverview(kdtId, userId),
      workTableService.getClueTodoOverview(kdtId, userId),
    ])
      .then(([data, todaData]) => {
        result = { ...data, ...todaData };
      });

    return ctx.json(0, 'ok', result);
  }

  async checkHomeworkWhiteList(ctx) {
    const prevWhiteList = this.ctx.getState('whitelist', {});
    const homeworkEnabled = await this.checkInWhiteList(ctx, 'edu_homework');

    const newWhiteList = { ...prevWhiteList, homework: homeworkEnabled };
    this.ctx.setState('whitelist', newWhiteList);
    this.ctx.setGlobal('whitelist', newWhiteList);
  }
};

module.exports = WorkTableController;
