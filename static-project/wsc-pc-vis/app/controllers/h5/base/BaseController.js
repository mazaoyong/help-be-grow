const BaseController = require('../../base/BaseController');
const SamMenuService = require('../../../services/sam/MenuService');
const RigMenuService = require('../../../services/rig/MenuService');
const RigGaryService = require('../../../services/rig/GrayService');
const StaffService = require('../../../services/sam/StaffService');
const { samAdapter, rigAdapter } = require('./filter');
const { degradeGetUserRoleId, degradeGetTeacherRoleId } = require('./utils');
const ShopSwitchService = require('../../../services/shopcenter/chain/ShopSwitchService');

const { checkEduSingleStore, checkEduHqStore, checkEduBranchStore } = require('@youzan/utils-shop');

const lodash = require('lodash');
const _get = lodash.get;
/**
 * Project Base Controller
 */
class H5BaseController extends BaseController {
  async init() {
    await super.init();
    // 只有页面请求才需要初始化的数据
    if (!this.ctx.acceptJSON) {
      this.initKdtId();
      this.initUserInfo();
      if (this.ctx.kdtId) {
        // 店铺列表未选择某个店铺的时候，是没有kdtId的，这个时候不用请求权限和角色
        await this.initPermission();
        await this.initStaffRole();
      }
    }
  }

  /**
   * 返回格式化后的操作人信息
   *
   * @readonly
   * @memberof BaseController
   */
  get formatOperator() {
    const formatOperator = super.formatOperator;

    return Object.assign({}, formatOperator, { source: 'wsc-pc-vis-client' });
  }

  /**
   * global 设置 kdt_id
   */
  initKdtId() {
    const kdtId = this.ctx.kdtId || 0;
    this.ctx.setGlobal('kdtId', kdtId);
    this.ctx.setState('kdtId', kdtId);
  }

  async initPermission() {
    // 获取权限
    const { ctx } = this;
    const { kdtId } = ctx;
    const adminId = ctx.getLocalSession('userInfo').id;
    // 1.判断店铺是否在 rig 灰度名单内
    const grayDto = {
      thirdTenantId: String(kdtId),
      thirdUserId: String(adminId),
      namespace: 'np_yz_shop',
    };

    const isInRigGrayRelease = await new RigGaryService(ctx).isInGrayRelease(grayDto);

    // 2.1 如果不再灰度名单里，那么走 SAM，保持老逻辑
    if (!isInRigGrayRelease) {
      const biz = 'wsc';
      const excludeMenuItemTypes = 0;

      const dto = {
        kdtId,
        adminId,
        biz,
        excludeMenuItemTypes,
      };

      const menu = await new SamMenuService(ctx).getHoverMenuTree(dto);

      const res = samAdapter(menu); // 将导航栏处理为返回权限点

      ctx.setGlobal('permission', res); // 设置小程序权限点

      return res;
    }

    // 2.2 在灰度名单里，就要走新逻辑
    const shopInfo = ctx.getState('shopInfo');

    // 2.2.1 根据店铺类型判断需要使用哪个菜单版本
    let version = '';
    if (checkEduSingleStore(shopInfo)) {
      version = 'edu_h5_single_v1';
    } else if (checkEduHqStore(shopInfo)) {
      version = 'edu_h5_hq_v1';
    } else if (checkEduBranchStore(shopInfo)) {
      version = 'edu_h5_online_v2';
    }

    // 如果没有店铺信息的页面，那么就做一个降级处理
    if (!version) {
      ctx.setGlobal('permission', {});
      return {};
    }

    const rigDto = {
      version,
      thirdTenantId: String(kdtId),
      thirdUserId: String(adminId),
      namespace: 'np_yz_shop',
      platform: 102,
    };

    const rigMenu = await new RigMenuService(ctx).getMenuTree(rigDto);

    ctx.setGlobal('permission', rigAdapter(rigMenu)); // 设置小程序权限点
    return rigMenu;
  }

  async initStaffRole() {
    const { ctx } = this;
    const { kdtId } = ctx;
    const adminId = ctx.getLocalSession('userInfo').id;
    const biz = 'wsc';
    const dto = {
      adminId,
      biz,
      kdtId,
    };
    const res = await new StaffService(ctx).findStaffRole(dto);

    const finalUserRoleId = degradeGetUserRoleId(res);

    ctx.setGlobal('roleId', finalUserRoleId); // 设置小程序权限点

    return res;
  }

  async initScheduleStaffRole() {
    const { ctx } = this;
    const { kdtId } = ctx;
    const adminId = ctx.getLocalSession('userInfo').id;
    const biz = 'wsc';
    const dto = {
      adminId,
      biz,
      kdtId,
    };
    const res = await new StaffService(ctx).findStaffRole(dto);

    const finalUserRoleId = degradeGetTeacherRoleId(res);

    ctx.setGlobal('roleId', finalUserRoleId); // 设置小程序权限点

    return res;
  }

  initUserInfo() {
    const { ctx } = this;
    const userInfo = ctx.getLocalSession('userInfo');

    ctx.setGlobal('visUserInfo', userInfo || {});
  }

  /**
   * 连锁-机构小程序切换条信息
   *   初始化global的switchInfo
   *
   */
  async setCampusInfo(ctx) {
    const rootKdtId = _get(ctx.getState('shopInfo'), 'rootKdtId');
    const adminId = ctx.getLocalSession('userInfo').id;
    const request = {
      adminId,
      hasHq: true,
      hqKdtId: rootKdtId,
      pageSize: 10,
      pageNum: 1,
    };

    const res = await new ShopSwitchService(ctx).searchShopForSwitch(request);
    ctx.setGlobal('campusInfo', {
      total: res.total,
    });
  }
}

module.exports = H5BaseController;
