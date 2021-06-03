const BaseController = require('../base/BaseController');
const OfflineEnrollmentGatherFacade = require('../../services/owl/pc/offlineenrollment/OfflineEnrollmentGatherFacade');
const OfflineReceiptFacade = require('../../services/owl/pc/offlineenrollment/OfflineReceiptFacade');
const PcOfflinePayFacade = require('../../services/owl/pc/offlineenrollment/PcOfflinePayFacade');
const OrderOperateService = require('../../services/trade/core/operate/OrderOperateService');
const OrderInfoService = require('../../services/trade/detail/OrderInfoService');
const SingleStaffService = require('../../services/sam/gateway/staff/SingleStaffService');
const OrderProcessService = require('../../services/trade/order/OrderProcessService');
const OwlCommonService = require('../../services/owl/biz/OwlCommonService');
class EnrollmentController extends BaseController {
  // 首页
  async getIndexHtml(ctx) {
    const kdtId = ctx.kdtId;

    // 店铺生命周期
    const lifecycle = await this.callService(
      'wsc-pc-base/shop.ProdReadService',
      'queryShopProds',
      kdtId,
    );

    ctx.setGlobal('userInfo', ctx.getLocalSession('userInfo'));
    ctx.setGlobal('lifecycle', lifecycle); // 店铺生命周期

    await ctx.render('recruit/enrollment/index.html');
  }

  async getCertificateHtml(ctx) {
    await ctx.render('recruit/enrollment/certificate.html');
  }

  async getPreLinkInfo(ctx) {
    const kdtId = ctx.kdtId;
    const { orderNo } = ctx.query;
    const data = await new OfflineEnrollmentGatherFacade(ctx).getPreLinkInfo(kdtId, orderNo);
    return ctx.json(0, 'ok', data);
  }

  async findStudentAndClueInfoByNameOrPhoneNumber(ctx) {
    const kdtId = ctx.kdtId;
    const studentClueListQueryCommand = ctx.getQueryParse();
    studentClueListQueryCommand.operator = this.formatOperator;
    const data = await new OfflineEnrollmentGatherFacade(ctx)
      .findStudentAndClueInfoByNameOrPhoneNumber(kdtId, studentClueListQueryCommand);
    return ctx.json(0, 'ok', data);
  }

  async findOfflineCourseWithCondition(ctx) {
    const kdtId = ctx.kdtId;
    const { offineCourseQueryCommand = {}, pageRequest = {} } = ctx.getQueryParse();
    offineCourseQueryCommand.operator = this.formatOperator;
    const data = await new OfflineEnrollmentGatherFacade(ctx)
      .findOfflineCourseWithCondition(kdtId, offineCourseQueryCommand, pageRequest);
    return ctx.json(0, 'ok', data);
  }

  async findOfflineCourseWithConditionV2(ctx) {
    const kdtId = ctx.kdtId;
    const { offineCourseQueryCommand = {}, pageRequest = {} } = ctx.getQueryParse();
    offineCourseQueryCommand.operator = this.formatOperator;
    const data = await new OfflineEnrollmentGatherFacade(ctx)
      .findOfflineCourseWithConditionV2(kdtId, offineCourseQueryCommand, pageRequest);
    return ctx.json(0, 'ok', data);
  }

  async submitOfflineEnrollmentOrder(ctx) {
    const kdtId = ctx.kdtId;
    const offlineEnrollmentGatherCommand = ctx.request.body;
    const data = await new OfflineEnrollmentGatherFacade(ctx)
      .submitOfflineEnrollmentOrder(kdtId, offlineEnrollmentGatherCommand);
    return ctx.json(0, 'ok', data);
  }

  async pay(ctx) {
    const kdtId = ctx.kdtId;
    const pcPayCommand = ctx.request.body;
    const data = await new PcOfflinePayFacade(ctx).pay(kdtId, pcPayCommand);
    return ctx.json(0, 'ok', data);
  }

  async linkCourse(ctx) {
    const kdtId = ctx.kdtId;
    const command = ctx.request.body;
    const data = await new OfflineEnrollmentGatherFacade(ctx).linkCourse(kdtId, command);
    return ctx.json(0, 'ok', data);
  }

  async getPayToolsByEduKdtId(ctx) {
    const kdtId = ctx.kdtId;
    const data = await new PcOfflinePayFacade(ctx).getPayToolsByEduKdtId(kdtId);
    return ctx.json(0, 'ok', data);
  }

  async getOrderInfo(ctx) {
    const kdtId = ctx.kdtId;
    const { orderNo } = ctx.getQueryParse();
    const param = {
      bizGroup: 'ebiz',
      app: 'wsc-pc-vis',
      kdtId,
      orderNo,
    };
    const data = await new OrderInfoService(ctx).get(param);
    return ctx.json(0, 'ok', data);
  }

  async invisibleOrderById(ctx) {
    const invisibleOrderRequestDTO = ctx.request.body;
    const data = await new OrderOperateService(ctx).invisibleOrderById(invisibleOrderRequestDTO);
    ctx.localLog('log', JSON.stringify({
      type: 'invisible order by id',
      request: invisibleOrderRequestDTO,
      response: data,
    }));
    return ctx.json(0, 'ok', data);
  }

  async cancelOrderByNo(ctx) {
    const cancelOrderRequestDTO = ctx.request.body;
    cancelOrderRequestDTO.kdtId = ctx.kdtId;
    cancelOrderRequestDTO.operator = this.operator;
    cancelOrderRequestDTO.cancelReason = '教育店铺关闭PC收银台';
    const data = await new OrderProcessService(ctx).cancelOrder(cancelOrderRequestDTO);
    ctx.localLog('log', JSON.stringify({
      type: 'cancel order by id',
      request: cancelOrderRequestDTO,
      response: data,
    }));
    return ctx.json(0, 'ok', data);
  }

  async findStaff(ctx) {
    const pageSize = 100;
    const querySingleStaffRequest = {
      kdtId: ctx.kdtId,
      status: 'ON',
      pageSize,
    };
    let pageNo = 1;
    let data = [];
    while (true) {
      querySingleStaffRequest.pageNo = pageNo;
      const { paginator, items } = await new SingleStaffService(ctx).find(querySingleStaffRequest);
      data = data.concat(items);
      if (paginator.totalCount < pageSize * pageNo) {
        break;
      }
      pageNo += 1;
    }
    return ctx.json(0, 'ok', data);
  }

  async getStaff(ctx) {
    const querySingleStaffRequest = ctx.getQueryParse();
    querySingleStaffRequest.kdtId = ctx.kdtId;
    const data = await new SingleStaffService(ctx).get(querySingleStaffRequest);
    return ctx.json(0, 'ok', data);
  }

  async getStudentByNameAndMobile(ctx) {
    const studentQueryCommand = ctx.getQueryParse();
    const data = await new OfflineEnrollmentGatherFacade(ctx).getStudentByNameAndMobile(ctx.kdtId, studentQueryCommand);
    return ctx.json(0, 'ok', data);
  }

  async getStaffList(ctx) {
    const query = ctx.query;
    query.kdtId = ctx.kdtId;
    const data = await new SingleStaffService(ctx).find(query);
    return ctx.json(0, 'ok', data);
  }

  // 获取二维码
  async getQrcode(ctx) {
    const {
      url,
      width = 80,
      height = 80,
      isShortenUrl = false,
      errorCorrectionLevel = 3,
      deleteWhite = true,
    } = ctx.query;

    const data = await new OwlCommonService(ctx).createQrCode({
      url,
      width,
      height,
      isShortenUrl,
      errorCorrectionLevel,
      deleteWhite,
    });
    ctx.json(0, 'ok', data);
  }

  async getReceiptV2(ctx) {
    const { kdtId, query } = ctx;
    const { orderNo } = query;
    const data = await new OfflineReceiptFacade(ctx).getReceiptV2(kdtId, orderNo);
    ctx.json(0, 'ok', data);
  }
}

module.exports = EnrollmentController;
