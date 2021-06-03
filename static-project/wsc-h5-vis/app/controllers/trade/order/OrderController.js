const BaseController = require('../../edu/EduBaseController');
const TradeOrderService = require('../../../services/owl/trade/TradeOrderService');
const PaySuccessAggrFacade = require('../../../services/owl/trade/PaySuccessAggrFacade');
const SubscriptionService = require('../../../services/owl/api/SubscriptionService');

class TradeOrderController extends BaseController {
  getPreOrderParams(ctx) {
    let {
      bizTracePoint = '',
      callbackUrl = '',
      productInfoList = [],
      channelType = 0,
      umpInfo = '{}',
      kdt_id: queryKdtId,
      pointsPrice = 0,
    } = ctx.request.body;

    const {
      kdtId,
      ip: clientIp = 0,
      platform,
      userAgent,
    } = ctx;

    const source = {
      kdtId: kdtId || queryKdtId,
      clientIp,
      platform,
      isReceiveMsg: '1',
      userAgent,
    };

    // 拼装用户信息
    const {
      fans_id: fansId = 0,
      fans_type: fansType = 0,
      fans_nickname: fansNickname = '',
      youzan_fans_id: youzanFansId = 0,
    } = ctx.getLocalSession();
    const userInfo = {
      buyerPhone: ctx.visBuyer.buyerPhone,
      fansId,
      fansNickname,
      fansType,
      userId: ctx.buyerId,
      youzanFansId,
    };

    // umpInfo字段兼容处理
    const umpInfoTmp = typeof umpInfo === 'string' ? JSON.parse(umpInfo) : umpInfo;

    // 使用积分兑换
    umpInfoTmp.pointsExchange = {
      usePoints: false,
      pointsPrice: 0,
    };

    if (pointsPrice) {
      umpInfoTmp.pointsExchange.pointsPrice = +pointsPrice || 0;
      umpInfoTmp.pointsExchange.usePoints = umpInfoTmp.pointsExchange.pointsPrice > 0;
    }

    return {
      bizTracePoint,
      callbackUrl,
      kdtId: kdtId || queryKdtId,
      fromThirdApp: false,
      channelType,
      productInfoList,
      source: JSON.stringify(source),
      userInfo,
      umpInfo: umpInfoTmp,
    };
  };

  async confirm(ctx) {
    const dto = this.getPreOrderParams(ctx);

    const list = await new TradeOrderService(ctx).confirm(dto);
    ctx.json(0, 'ok', list);
  }

  async create(ctx) {
    let {
      studentInfo = null,
      payAsset = '{}',
      infoCollect = {},
      lessonAppointmentDTO = '{}',
      orderMark,
      fromType = '',
      fromId = '',
    } = ctx.request.body;

    const dto = {
      ...this.getPreOrderParams(ctx),
      studentInfo: JSON.parse(studentInfo),
      payAsset: JSON.parse(payAsset),
      infoCollect,
      lessonAppointmentDTO: JSON.parse(lessonAppointmentDTO),
      orderMark,
    };
    if (fromType) {
      dto.from = {
        fromType,
        fromId,
      };
    }

    console.log('dto create-------------------', dto);

    const list = await new TradeOrderService(ctx).create(dto);
    ctx.json(0, 'ok', list);
  }

  async hasPay(ctx) {
    const {
      orderNo,
    } = ctx.query;
    const {
      userId,
      kdtId,
    } = ctx;
    const result = await new TradeOrderService(ctx).hasPay({
      orderNo,
      userId,
      kdtId,
    });
    ctx.json(0, 'ok', result);
  }

  async buyerInfo(ctx) {
    const {
      fans_id: fansId = 0,
    } = ctx.getLocalSession();
    const {
      userId,
      kdtId,
      buyerId,
    } = ctx;
    const result = await new SubscriptionService(ctx).getBuyerInfoFromUserCenter({
      fansId,
      kdtId,
      adminId: buyerId,
      userId,
    });
    ctx.json(0, 'ok', result);
  }

  async getPaySuccessInfo(ctx) {
    const { kdtId, userId } = ctx;
    const { orderNo } = ctx.query;
    const result = await new PaySuccessAggrFacade(ctx).getPaySuccessInfo(kdtId, orderNo, userId);
    ctx.json(0, 'ok', result);
  }
}

module.exports = TradeOrderController;
