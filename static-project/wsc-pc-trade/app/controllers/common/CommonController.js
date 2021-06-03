const BaseController = require('../base/BaseController');
const HQStoreSearchService = require('../../services/retail/HQStoreSearchService');
const StaffServiceV2 = require('../../services/sam/StaffServiceV2');
const RoleService = require('../../services/sam/RoleService');

class CommonController extends BaseController {
  async getQrcode(ctx) {
    const { url, margin = 10 } = ctx.query;
    const shortenUrl = await this.ctx.shortUrl.toShort(url);
    const opts = {
      margin,
      case: 1,
    };
    const img = await this.ctx.qrcode.create(shortenUrl, opts);
    ctx.type = 'image/png';
    ctx.body = img;
  }

  /**
   * 搜索连锁网店
   * @param {*} ctx
   */
  async searchStores(ctx) {
    const { kdtId, query } = ctx;
    const { rootKdtId: headKdtId } = ctx.getState('shopInfo');
    const { keyword, searchHeadStore = 0, includePartner = 0 } = query;
    const userInfo = ctx.getLocalSession('userInfo');
    const param = {
      adminId: userInfo.id,
      kdtId: +searchHeadStore && +headKdtId ? +headKdtId : kdtId,
      hqKdtId: +headKdtId,
      storeName: keyword,
      // 2-网店角色值 4-合伙人角色值
      shopRoleList: +includePartner ? [2, 4] : [2],
      retailSource: 'wsc',
      pageSize: 50,
      appendShopLifecycleEndTime: false,
      appendOfflineBusinessHours: false,
      appendPosPointNum: false,
    };
    const result = await new HQStoreSearchService(ctx).searchWithDataPermission(param);
    ctx.json(0, 'ok', result);
  }

  // 获取员工列表
  async getStaffList(ctx) {
    const {
      kdtId,
      isSuperStore,
      query: { keyWord = '', pageNo = 1, pageSize = 8, roleId = '' },
    } = ctx;

    const params = {
      kdtId,
      pageNo,
      pageSize,
      keyWord,
      biz: isSuperStore ? 'retail' : 'wsc',
    };

    roleId !== '' && (params.roleId = roleId);

    const result = await new StaffServiceV2(ctx).findStaffsPages(params);

    ctx.json(0, 'ok', result);
  }

  // 获取角色种类信息
  async getStaffRoles(ctx) {
    const { kdtId, isSuperStore } = ctx;

    const result = await new RoleService(ctx).find({
      biz: isSuperStore ? 'retail' : 'wsc',
      kdtId,
      pageNo: 1,
      pageSize: 300,
    });
    ctx.json(0, 'ok', result);
  }

  // 判断是否lite网店
  async detectLiteAdmin(ctx) {
    const isLiteAdmin = await this.checkIsLiteAdmin(ctx);
    ctx.json(0, 'ok', isLiteAdmin);
  }
  // 返回lite网店列表

  async getAllLiteStoreList(ctx) {
    const res = await this.getLiteStoreId(ctx);
    ctx.json(0, 'ok', res);
  }
}

module.exports = CommonController;
