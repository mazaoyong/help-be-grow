const BaseController = require('../base/BaseController');
const BenefitFacade = require('../../services/owl/pc/benefit/BenefitFacade');
const { checkEduChainStore } = require('@youzan/utils-shop');

/**
 * 会员权益
 */
class BenefitController extends BaseController {
  async getIndexHtml(ctx) {
    ctx.setState('isEduChainStore', checkEduChainStore(ctx.getState('shopInfo')));

    await ctx.render('ump/benefit/index.html');
  }

  // 创建权益包
  async postCreateBenefitPackageJson(ctx) {
    let command = ctx.request.body || {};
    command.kdtId = ctx.kdtId;
    command = await ctx.visXss(command, 'description');
    const result = await new BenefitFacade(ctx).createBenefitPackage(ctx.kdtId, command);
    ctx.json(0, 'ok', result);
  }

  // 编辑权益包
  async postEditBenefitPackageJson(ctx) {
    let command = ctx.request.body || {};
    command.kdtId = ctx.kdtId;
    const operatorKdtId = ctx.kdtId;
    command = await ctx.visXss(command, 'description');
    const result = await new BenefitFacade(ctx).editBenefitPackage(operatorKdtId, command);
    ctx.json(0, 'ok', result);
  }

  // 检查权益包是否存在
  async getCheckBenefitPackageStatusJson(ctx) {
    const operatorKdtId = ctx.kdtId;
    const query = ctx.request.query;
    const command = {
      kdtId: ctx.kdtId,
      alias: query.alias,
    };
    const result = await new BenefitFacade(ctx).checkBenefitPackageStatus(operatorKdtId, command);
    ctx.json(0, 'ok', result);
  }

  // 删除权益包
  async postDeleteBenefitPackageJson(ctx) {
    const command = {
      ...ctx.request.body || {},
      kdtId: ctx.kdtId,
    };
    const operatorKdtId = ctx.kdtId;
    const result = await new BenefitFacade(ctx).deleteBenefitPackage(operatorKdtId, command);
    ctx.json(0, 'ok', result);
  }

  // 获取权益包详情
  async getBenefitPackageDetailJson(ctx) {
    const operatorKdtId = ctx.kdtId;
    const query = ctx.request.query;
    const command = {
      kdtId: ctx.kdtId,
      alias: query.alias,
      options: {
        withCount: true,
      },
    };
    const result = await new BenefitFacade(ctx).getBenefitPackageDetail(operatorKdtId, command);
    ctx.json(0, 'ok', result);
  }

  // 分页查询权益包
  async getFindBenefitPackagePageJson(ctx) {
    const query = ctx.request.query || {};
    const operatorKdtId = ctx.kdtId;
    const pageRequest = {
      pageNumber: query.pageNumber,
      pageSize: query.pageSize || 20,
    };
    const command = {
      aliases: query.aliases || [],
      ids: query.ids || [],
      kdtId: ctx.kdtId,
    };
    const result = await new BenefitFacade(ctx).findBenefitPackagePage(operatorKdtId, pageRequest, command);
    ctx.json(0, 'ok', result);
  }

  // 编辑权益项
  async postEditBenefitItemJson(ctx) {
    const query = ctx.request.body || {};
    const operatorKdtId = ctx.kdtId;
    const command = {
      kdtId: ctx.kdtId,
      packageAlias: query.alias,
      type: query.type,
      serialNo: query.serialNo,
      id: query.id,
    };
    const result = await new BenefitFacade(ctx).editBenefitItem(operatorKdtId, command);
    ctx.json(0, 'ok', result);
  }

  // 分页条件查询权益包项
  async getFindBenefitItemDetailPageJson(ctx) {
    const query = ctx.request.query;
    const operatorKdtId = ctx.kdtId;
    const pageRequest = {
      pageNumber: query.pageNumber,
      pageSize: query.pageSize || 20,
    };
    const command = {
      kdtId: ctx.kdtId,
      packageAlias: query.alias,
      type: query.type,
    };
    const result = await new BenefitFacade(ctx).findBenefitItemDetailPage(operatorKdtId, pageRequest, command);
    ctx.json(0, 'ok', result);
  }

  // 添加权益包项
  async postAddBenefitItemsJson(ctx) {
    const command = ctx.request.body || {};
    command.kdtId = ctx.kdtId;
    const operatorKdtId = ctx.kdtId;
    const result = await new BenefitFacade(ctx).addBenefitItems(operatorKdtId, command);
    ctx.json(0, 'ok', result);
  }

  // 删除权益包项
  async postRemoveBenefitItemsJson(ctx) {
    const command = ctx.request.body || {};
    command.kdtId = ctx.kdtId;
    const operatorKdtId = ctx.kdtId;
    const result = await new BenefitFacade(ctx).removeBenefitItems(operatorKdtId, command);
    ctx.json(0, 'ok', result);
  }

  // 获取可选的权益卡列表
  async getFindSelectableBenefitCardPageJson(ctx) {
    const operatorKdtId = ctx.kdtId;
    const query = ctx.request.query;
    const pageRequest = {
      pageNumber: query.pageNumber,
      pageSize: query.pageSize || 20,
    };
    const command = {
      kdtId: ctx.kdtId,
    };

    const result = await new BenefitFacade(ctx).findSelectableBenefitCardPage(operatorKdtId, pageRequest, command);
    ctx.json(0, 'ok', result);
  }

  // 分页查询可选的权益项列表
  async getFindSelectableBenefitItemPageJson(ctx) {
    const operatorKdtId = ctx.kdtId;
    const query = ctx.request.query;
    const pageRequest = {
      pageNumber: query.pageNumber,
      pageSize: query.pageSize || 20,
    };
    const command = {
      kdtId: ctx.kdtId,
      type: Number(query.type),
      packageAlias: query.alias,
    };

    const result = await new BenefitFacade(ctx).findSelectableBenefitItemPage(operatorKdtId, pageRequest, command);
    ctx.json(0, 'ok', result);
  }

  // 分页查询已关联权益卡的权益包（目前微页面上选择权益弹框中使用）
  async findAvailableBenefitPackagePageJson(ctx) {
    const query = ctx.request.query || {};
    const operatorKdtId = ctx.kdtId;
    const pageRequest = {
      pageNumber: query.pageNumber,
      pageSize: query.pageSize || 20,
    };
    const command = {
      aliases: query.aliases || [],
      ids: query.ids || [],
      kdtId: ctx.kdtId,
    };
    const result = await new BenefitFacade(ctx).findAvailableBenefitPackagePage(operatorKdtId, pageRequest, command);
    ctx.json(0, 'ok', result);
  }
}

module.exports = BenefitController;
