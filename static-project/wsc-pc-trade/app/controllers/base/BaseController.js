const { PCBaseController } = require('@youzan/wsc-pc-base');
const uuid = require('uuid/v4');
const get = require('lodash/get');
const reduce = require('lodash/reduce');
const map = require('lodash/map');
const MultiStoreAdminService = require('../../services/multistore/MultiStoreAdminService');
const StaffServiceV2 = require('../../services/sam/StaffServiceV2');
const MultiStoreSettingService = require('../../services/multistore/MultiStoreSettingService');
const ShopQueryService = require('../../services/shop/ShopQueryService');
const ProdReadService = require('../../services/shopcenter/ShopProdReadService');
const { getOperatorInfo } = require('@youzan/wsc-pc-base/app/lib/util');
const RigRoleService = require('../../services/sam/RigRoleService');
const { appName, orgType } = require('../../constants');
const ShopConfigReadService = require('../../services/shop/ShopConfigReadService');
const HQStoreSearchService = require('../../services/retail/HQStoreSearchService');
const lodash = require('lodash');
const { checkLiteOnlineStoreManager } = require('@youzan/utils-shop');

const NewRoleService = require('../../services/sam/NewRoleService');
const NewStaffService = require('../../services/sam/NewStaffService');

const SUPPLY_MODE_CONFIG_KEY = 'online_subshop_supply_mode';
const REQUEST_ID = Symbol.for('wsc-pc-trade#requestId');

/**
 * Project Base Controller
 * @class BaseController
 * @extends {PCBaseController<IWscPcTradeDefine>>}
 */
class BaseController extends PCBaseController {
  async init() {
    await super.init();

    // retail-utils 依赖 _global.business.shopInfo
    // utils-shop 依赖 _global.business.shopMetaInfo
    const shopInfo = this.ctx.getState('shopInfo');
    this.ctx.setGlobal('business', {
      shopMetaInfo: shopInfo,
      shopInfo,
    });
  }

  // wsc-pc-trade 业务相关的 _global 参数初始方法

  /**
   * 初始化当前用户（网点管理员）的管理店铺 Id
   * （命名是否考虑修改？）
   *
   * @memberof BaseController
   */
  async initStoreId() {
    const { ctx } = this;
    const { kdtId, userId: adminId } = ctx;
    const storeId = await new MultiStoreAdminService(ctx).getStoreIdByAdminIdAndKdtId({
      kdtId,
      adminId,
    });
    ctx.setEnv('storeId', storeId);
  }

  /**
   * 初始化当前用户角色、权限信息
   *
   * @memberof BaseController
   */
  async initTeamAdmin() {
    const { ctx } = this;
    const { kdtId, userId: adminId } = ctx;
    const teamAdmin = await new StaffServiceV2(ctx).findStaffRole({
      kdtId,
      adminId,
      biz: 'wsc',
      isPhysical: true, // 必须是真实员工
    });
    // 微商城支持多角色
    ctx.setEnv('teamAdmin', teamAdmin);
  }

  /**
   * 初始化当前所属教育店铺版本信息
   *
   * @memberof BaseController
   */
  async initVersionStatus() {
    const { ctx } = this;
    if (!ctx.isYZEdu) {
      return;
    }

    const kdtId = ctx.kdtId;
    const rootKdtId = get(ctx.getState('shopInfo'), 'rootKdtId');
    try {
      const result = await new ProdReadService(ctx).queryShopProdVersions(rootKdtId || kdtId);
      if (Array.isArray(result) && result.length) {
        const versionStatus = result
          .filter(item => item.lifecycleStatus !== 'prepare')
          .sort((pre, next) => parseInt(next.beginTime) - parseInt(pre.beginTime));
        ctx.setGlobal('versionStatus', versionStatus[0] || {}); // 教育店铺版本
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('get version error', e);
      ctx.setGlobal('versionStatus', {}); // 异常处理
    }
  }

  /**
   * 初始化是否开启多门店参数
   *
   * @memberof BaseController
   */
  async initIsShowMultiStore() {
    const { ctx } = this;
    const { kdtId } = ctx;
    const isShowMultiStore = await new MultiStoreSettingService(ctx).getMultiStoreSettingsByKdtId(
      kdtId,
    );
    ctx.setEnv('isShowMultiStore', (isShowMultiStore && isShowMultiStore.status === 1) || false);
  }

  async initWechatDeliveryWhiteList(ctx) {
    const { kdtId } = ctx;
    const wechatDelivery = await this.grayRelease('wechat_delivery', kdtId);
    ctx.setGlobal({ wechatDelivery });
  }

  /**
   * 当前请求唯一的 requestId，一般作为调用后端接口时的参数使用
   * @returns {string}
   */
  get requestId() {
    if (!this[REQUEST_ID]) {
      this[REQUEST_ID] = uuid();
    }
    return this[REQUEST_ID];
  }

  // 操作人
  get operator() {
    const { ctx } = this;
    const userInfo = ctx.getLocalSession('userInfo');
    const operator = {
      role: 'seller',
      operatorPhone: userInfo.mobile,
      operatorId: userInfo.id,
      operatorName: userInfo.nickName,
    };
    return operator;
  }

  // 来源
  get source() {
    const { ctx } = this;
    const source = {
      clientIp: ctx.firstXff,
      from: appName,
    };
    return source;
  }

  // scOperatorStr json
  get scOperatorStr() {
    const { ctx } = this;
    return JSON.stringify(getOperatorInfo(ctx));
  }

  /**
   * 设置总部的店铺信息
   */
  async setHqShopInfo(ctx) {
    const shopInfo = ctx.getState('shopInfo');
    const rootKdtId = get(shopInfo, 'rootKdtId');

    const hqShopInfo = await new ShopQueryService(ctx).getShopBaseInfoByKdtId(rootKdtId);
    ctx.setGlobal('hqShopInfo', hqShopInfo || {});
  }

  // 白名单服务
  async grayRelease(key, kdtId) {
    return this.callService(
      'wsc-pc-base/common.GrayReleaseService',
      'isInGrayReleaseByKdtId',
      key,
      kdtId,
    );
  }

  /**
   * 接口聚合调用
   * @param {Array<Promise>} promises Promise 对象组成的数组
   * @param {string} logLevel 打印天网日志等级
   * @param {string} logPrefix 打印天网日志的前缀，类似 namespace 方便日志查看
   */
  promiseAll(promises = [], logLevel = 'warn', logPrefix = '') {
    return Promise.all(
      promises.map(promise => {
        return promise.catch(err => {
          this.ctx.logger[logLevel]
            ? this.ctx.logger[logLevel](`${logPrefix}Promise失败:`, err)
            : this.ctx.logger.warn(`${logPrefix}Promise失败:`, err);
        });
      }),
    );
  }

  /**
   * 分销相关业务已从pc-trade迁出至pc-fenxiao
   *
   * @params arguments[0] ctx 上下文数据
   * @params arguments[1] regUrlSinppet 原url(匹配路由)片段
   * @params arguments[2] redirectUrlSnippet 需要替换url片段
   */
  async redirectToNewestUrl(ctx, regUrlSnippet = '/v4/trade', redirectUrlSnippet = '/v4/fenxiao') {
    const { url } = ctx;
    // 分销相关业务已从pc-goods迁出至pc-fenxiao
    const reg = new RegExp(`${regUrlSnippet}(.*)`);
    const redirectUrl = url.replace(reg, (_, route) => `${redirectUrlSnippet}${route}`);
    ctx.redirect(redirectUrl);
  }

  /**
   * 获取当前店铺角色列表
   * @returns {Array}
   */
  async getRetailShopRoles() {
    const { ctx } = this;
    const { kdtId, userId: adminId } = ctx;
    const [staffInfo, roleListInfo] = await Promise.all([
      new NewStaffService(ctx).getStaff({ kdtId, adminId, biz: 'retail', sources: 'retail_node' }),
      new NewRoleService(ctx).getRoleList({
        thirdTenantId: `${kdtId}`,
        thirdUserId: `${adminId}`,
        namespace: 'np_yz_shop',
        rigSource: 'retail_node',
        filter: {
          bizKeyGroup: 'shop_ability',
        },
      }),
    ]);
    const roleId2extProps = reduce(
      roleListInfo,
      (acc, cur) => {
        acc[cur.roleId] = cur.extProperties || null;
        return acc;
      },
      {},
    );
    const result = map(get(staffInfo, 'roleList'), role => ({
      ...role,
      extProperties: roleId2extProps[role.roleId],
    }));

    ctx.setEnv('retailShopRoles', result || []);
  }

  /**
   * 获取铺货/供货模式
   * @param {AstroboyContext} ctx
   */
  queryShopSupplyMode(ctx) {
    const { kdtId } = ctx;
    return new ShopConfigReadService(ctx).queryShopConfig(kdtId, SUPPLY_MODE_CONFIG_KEY);
  }

  /**
   * 判断是否lite网店管理员
   */

  async checkIsLiteAdmin(ctx) {
    const { kdtId, userId: adminId } = ctx;

    const [staffInfo, roleListInfo] = await Promise.all([
      new StaffServiceV2(ctx).getStaff({ kdtId, adminId, biz: 'retail' }),
      new RigRoleService(ctx).getRoleList(kdtId, adminId, {
        filter: {
          bizKeyGroup: 'shop_ability',
        },
      }),
    ]);

    const roleId2extProps = lodash.reduce(
      roleListInfo,
      (acc, cur) => {
        acc[cur.roleId] = cur.extProperties || null;
        return acc;
      },
      {},
    );

    const res = lodash.map(lodash.get(staffInfo, 'roleList'), role => ({
      ...role,
      extProperties: roleId2extProps[role.roleId],
    }));

    return checkLiteOnlineStoreManager(res);
  }

  /**
   * 获取当前lite网店管理员 管理的lite网店的列表
   */

  async getLiteStoreList(ctx) {
    const { kdtId, userId: adminId } = ctx;

    const storeList = await new HQStoreSearchService(ctx).pageOrganization({
      orgType: +orgType,
      kdtId,
      adminId,
      retailSource: 'wsc',
    });

    return storeList;
  }

  /**
   * 获取当前lite网店管理员 管理的lite网店的id
   */

  async getLiteStoreId(ctx) {
    const isLiteAdmin = await this.checkIsLiteAdmin(ctx);

    if (isLiteAdmin) {
      const res = await this.getLiteStoreList(ctx);

      const { items = [] } = res || {};

      const realKdtId = items[0]?.storeKdtId ?? 0;

      return {
        isLite: true,
        liteKdtId: realKdtId,
        items,
      };
    } else {
      return {
        isLite: false,
      };
    }
  }
}

module.exports = BaseController;
