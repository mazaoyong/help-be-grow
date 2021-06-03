const BaseController = require('../base/BaseController');

const CluePluginService = require('../../services/owl/pc/clue/CluePluginService');
const StaffReadService = require('../../services/staff/core/StaffReadService');
const { get } = require('lodash');

class ClueController extends BaseController {
  async init() {
    super.init();
    await this._initPluginStatus();
  }

  // 公海池页面
  async getCluePoolHtml(ctx) {
    await this._initUserRole();
    ctx.setGlobal('userInfo', ctx.getLocalSession('userInfo'));
    await ctx.render('ump/clue/cluepool.html');
  }

  // 全部线索页面
  async getAllClueHtml(ctx) {
    await this._initUserRole();
    ctx.setGlobal('userInfo', ctx.getLocalSession('userInfo'));
    await ctx.render('ump/clue/clueall.html');
  }

  // 我的线索页面
  async getMyClueHtml(ctx) {
    await this._initUserRole();
    ctx.setGlobal('userInfo', ctx.getLocalSession('userInfo'));
    await ctx.render('ump/clue/cluemine.html');
  }

  // 线索回收站页面
  async getClueRecycleHTML(ctx) {
    await ctx.render('ump/clue/cluerecycle.html');
  }

  // 线索导入页面
  async getClueImportHTML(ctx) {
    await ctx.render('ump/clue/clueimport.html');
  }

  // 线索设置页面
  async getClueSettingHTML(ctx) {
    await ctx.render('ump/clue/cluesetting.html');
  }

  // 线索来源页面
  async getClueSourceHtml(ctx) {
    await ctx.render('ump/clue/cluesource.html');
  }

  // 线索标签页面
  async getClueTagsHTML(ctx) {
    await ctx.render('ump/clue/cluetags.html');
  }

  // 线索流转原因页面
  async getClueTransferHTML(ctx) {
    await ctx.render('ump/clue/cluetransfer.html');
  }

  // 初始化 global 上的插件启用状态 PluginEnabled
  async _initPluginStatus() {
    const { ctx } = this;
    const cluePluginInitStatus = await new CluePluginService(ctx).getInitStatus(ctx.kdtId);
    // 初始化状态 0-未初始化，1-初始化中，99-异常，100-完成，只有为 100 的时候才为已启用状态。
    const pluginEnabled = cluePluginInitStatus && cluePluginInitStatus.initStatus === 100;
    ctx.setGlobal('pluginEnabled', pluginEnabled);
  }

  // 初始化用户角色
  async _initUserRole() {
    const { ctx } = this;
    const operator = this.formatOperator;
    const result = await new StaffReadService(ctx).queryOne({
      kdtId: ctx.kdtId,
      adminId: operator.userId,
      operatorId: operator.userId,
      operator: operator.nickName,
    });
    const userRoles = get(result, 'orgDepRoles[0].roles', []);
    const isAdmin = userRoles.some(item => item.roleId === 1);
    ctx.setGlobal('isAdmin', isAdmin);
  }
}

module.exports = ClueController;
