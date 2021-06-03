const BaseController = require('../../base/BaseController');
const ClueExportFacade = require('../../../services/api/owl/pc/ClueExportFacade');
const CluePluginService = require('../../../services/owl/pc/clue/CluePluginService');
const StaffReadService = require('../../../services/staff/core/StaffReadService');
const { checkEduShop, checkEduBranchStore } = require('@youzan/utils-shop');
const { get } = require('lodash');

class ClueBaseController extends BaseController {
  /**
   *  在非教育店铺时初始化 global 上的插件启用状态 PluginEnabled
   */
  async initPluginStatus() {
    const { ctx } = this;
    if (!checkEduShop(ctx.getState('shopInfo'))) {
      const cluePluginInitStatus = await new CluePluginService(ctx).getInitStatus(ctx.kdtId);
      // 初始化状态 0-未初始化，1-初始化中，99-异常，100-完成，只有为 100 的时候才为已启用状态。
      const pluginEnabled = cluePluginInitStatus && cluePluginInitStatus.initStatus === 100;
      ctx.setGlobal('pluginEnabled', pluginEnabled);
    }
  }

  async initUserRole() {
    const { ctx } = this;
    const operator = this.formatOperator;
    const result = await new StaffReadService(ctx).queryOne({
      kdtId: ctx.kdtId,
      adminId: operator.userId,
      operatorId: operator.userId,
      operator: operator.nickName,
    });
    const userRoleId = get(result, 'orgDepRoles[0].roles[0].roleId');
    ctx.setGlobal('userRoleId', userRoleId);
  }

  async initExportable() {
    const { ctx } = this;

    /** 非教育校区一律可以导出线索 */
    if (!checkEduBranchStore(ctx.getState('shopInfo'))) {
      ctx.setGlobal('clueExportable', true);
      return;
    }

    try {
      /** 教育校区要根据店铺配置来判断 **/
      const result = await new ClueExportFacade(ctx).getClueExportConfig(ctx.kdtId);
      ctx.setGlobal('clueExportable', result);
    } catch (e) {
      /** 接口报错的时候应该降级成不允许导出 */
      ctx.setGlobal('clueExportable', false);
    }
  }
}

module.exports = ClueBaseController;
