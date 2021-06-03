const BaseController = require('../base/BaseController');
const CustomerDetailService = require('../../services/scrm/CustomerDetailService');
const PluginQueryService = require('../../services/scrm/PluginQueryService');
const CardTemplateQueryService = require('../../services/scrm/CardTemplateQueryService');
const BenefitVerificationSearchService = require('../../services/scrm/BenefitVerificationSearchService');
const BenefitVerificateExportService = require('../../services/scrm/BenefitVerificateExportService');
const CocVerificationQueryService = require('../../services/scrm/verification/CocVerificationQueryService');
const CocVerificateService = require('../../services/scrm/verification/CocVerificateService');
const { appName } = require('../../constants');
const omitBy = require('lodash/omitBy');
const isNaN = require('lodash/isNaN');
const isNil = require('lodash/isNil');

class VerifycardController extends BaseController {
  /**
   * 格式化query数据
   * @param rawData
   */
  formatQuery(rawData = {}) {
    const { operatorId, pluginId, page, pageSize, carrierTplId, ...rest } = rawData;
    const data = {
      operatorId: +operatorId,
      pluginId: +pluginId,
      page: +page,
      pageSize: +pageSize,
      carrierTplInfo: carrierTplId && {
        carrierTplId: +carrierTplId,
        carrierType: 1,
      },
      ...rest,
    };
    return omitBy(data, item => isNaN(item) || isNil(item) || item === false || item === '');
  }

  /**
   * 根据客户id获取可使用的权益
   * @param {Context} ctx
   */
  async getCustomerVerificationBenefit(ctx) {
    const { userId } = ctx.getQueryData();
    const { kdtId } = ctx;
    const data = await new CocVerificationQueryService(ctx).getCustomerVerificationBenefit({
      userId: +userId,
      kdtId: +kdtId,
    });
    ctx.successRes(data);
  }

  /**
   * 获取店铺权益名称列表
   * @param {Context} ctx
   */
  async getBenefitNameList(ctx) {
    const { pageSize, page } = ctx.getQueryData();
    const { kdtId } = ctx;

    const data = await new PluginQueryService(ctx).list({
      kdtId: +kdtId,
      pageSize,
      page,
    });
    ctx.successRes(data);
  }

  /**
   * 获取店铺权益来源列表
   * @param {Context} ctx
   */
  async getBenefitSourceList(ctx) {
    const { pageSize, page } = ctx.getQueryData();
    const { kdtId } = ctx;

    const data = await new CardTemplateQueryService(ctx).getSummaryList({
      kdtId: +kdtId,
      pageSize,
      page,
    });
    ctx.successRes(data);
  }

  /**
   * 核销权益
   * @param {Context} ctx
   */
  async verifyBenefit(ctx) {
    const { kdtId } = ctx;
    const { benefitId, userId, verificateNum, stockNum } = ctx.request.body;
    const data = await new CocVerificateService(ctx).verificate([
      {
        appName,
        benefitId: +benefitId,
        userId: +userId,
        verificateNum: +verificateNum,
        currentNum: +stockNum,
        kdtId: +kdtId,
        verificateWay: 1,
        operator: {
          operatorMobile: this.operator.operatorPhone,
          operatorName: this.operator.operatorName,
          operatorId: this.operator.operatorId,
        },
      },
    ]);
    ctx.successRes(data);
  }

  /**
   * 筛选权益核销记录
   * @param {Context} ctx
   */
  async getBenefitVerifyRecord(ctx) {
    const { kdtId } = ctx;

    const query = { ...this.formatQuery(ctx.getQueryData()), kdtId: +kdtId, appName };
    const data = await new BenefitVerificationSearchService(ctx).searchVerificateRecord(query);
    ctx.successRes(data);
  }

  /**
   * 导出权益核销记录
   * @param {Context} ctx
   */
  async exportBenefitVerifyRecord(ctx) {
    const {
      kdtId,
      request: { body },
    } = ctx;

    const query = { ...this.formatQuery(body), kdtId: +kdtId, appName };
    const data = await new BenefitVerificateExportService(ctx).export(query);
    ctx.successRes(data);
  }

  /**
   * 根据手机号获取客户基本信息
   * @param {Context} ctx
   */
  async getCustomerBasicInfo(ctx) {
    const query = ctx.getQueryData();
    const { kdtId } = ctx;
    const accountInfoDTO = {
      accountId: query.mobile,
      accountType: 3,
    };
    const params = {
      appName,
      accountInfoDTO,
      kdtId: +kdtId,
    };
    const data = await new CustomerDetailService(ctx).getCustomerBasicInfo(params);
    ctx.successRes(data);
  }
}

module.exports = VerifycardController;
