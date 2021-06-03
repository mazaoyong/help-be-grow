const OrderBaseController = require('./OrderBaseController');
const PrinterService = require('../../services/order/PrinterService');
const PrintUpgradeApi = require('../../services/iot/PrintUpgradeApi');
const CloudPrinterApi = require('../../services/iot/CloudPrinterApi');
const { appName } = require('../../constants');

class PrintController extends OrderBaseController {
  async listPrinters(ctx) {
    const { kdtId } = ctx;
    const { storeId = 0, linkStatus, deviceStatus, page = 1, size = 100 } = ctx.query;
    const result = await new PrinterService(ctx).listPrinters({
      kdtId: +kdtId,
      storeId,
      linkStatus,
      deviceStatus,
      page,
      size,
    });
    ctx.json(0, 'ok', result);
  }

  async printCateringTicket(ctx) {
    const { kdtId } = ctx;
    const { orderId, storeId = 0, printerId } = ctx.request.body;
    const result = await new PrinterService(ctx).printCateringTicket({
      orderId,
      kdtId: +kdtId,
      storeId: +storeId,
      printerId: +printerId,
    });
    ctx.json(0, 'ok', result);
  }

  // 查询打印机列表(多网点)
  async listAllLinkedPrinters(ctx) {
    const { kdtId } = ctx;
    const { storeId = 0 } = ctx.query;
    const result = await new PrinterService(ctx).listAllLinkedPrinters(kdtId, storeId);
    ctx.json(0, 'ok', result);
  }

  // 打印订单（开启多网点）
  async printOrderAfterMultiStore(ctx) {
    const { kdtId, userId: adminId } = ctx;
    const { printerId, storeId = 0, orderNo } = ctx.request.body;
    const params = {
      kdtId,
      printerId,
      orderNo,
      storeId,
      adminId,
    };
    const result = await new PrinterService(ctx).printOrderAfterMultiStore(params);
    ctx.json(0, 'ok', result);
  }

  // 打印订单（未开启多网点）
  async printOrder(ctx) {
    const { kdtId, userId: adminId } = ctx;
    const { printerId, orderNo } = ctx.request.body;
    const params = {
      kdtId,
      printerId,
      orderNo,
      adminId,
    };
    const result = await new PrinterService(ctx).printOrder(params);
    ctx.json(0, 'ok', result);
  }

  // 小票打印升级状态
  async getUpgradeStatus(ctx) {
    const { kdtId, userId: adminId } = ctx;
    const result = await new PrintUpgradeApi(ctx).queryUpgradeStatus({
      adminId,
      kdtId,
      retailSource: appName,
    });

    ctx.json(0, 'ok', result);
  }

  // 升级零售小票后使用的打印接口
  async printByOrderNo(ctx) {
    const { kdtId, userId: adminId } = ctx;
    const { orderNo } = ctx.request.body;
    const params = {
      adminId,
      biz: 'shopping-receipt-v1', // 购物小票：shopping-receipt-v1，当前微商城仅购物小票
      kdtId,
      orderNo,
      retailSource: appName,
    };
    const result = await new CloudPrinterApi(ctx).printByOrderNo(params);
    ctx.json(0, 'ok', result);
  }

  // 升级零售小票后使用的打印接口
  async printPendOrder(ctx) {
    const { kdtId, userId: adminId } = ctx;
    const { orderId, storeId = 0 } = ctx.request.body;
    const params = {
      adminId,
      kdtId,
      pendOrderId: orderId,
      secondaryUnitId: storeId,
      retailSource: appName,
    };
    const result = await new CloudPrinterApi(ctx).printPendOrder(params);
    ctx.json(0, 'ok', result);
  }
}

module.exports = PrintController;
