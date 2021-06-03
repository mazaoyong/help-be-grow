const BaseController = require('../../base/BaseController');
const ChainStaffService = require('../../../services/owl/edu/refundRecord/ChainStaffService');
const SignleStaffService = require('../../../services/owl/edu/refundRecord/SingleStaffService');
const RefundRecordService = require('../../../services/owl/edu/refundRecord/RefundRecordService');

class RefundRecordController extends BaseController {
  async getIndexHtml(ctx) {
    await ctx.render('recruit/refund/record.html');
  }

  async getRefundRecordList(ctx) {
    const {
      pageSize,
      pageNumber,
      sort = {
        orders: [
          {
            direction: 'DESC',
            property: 'createdTime',
          },
        ],
      },
      params,
    } = ctx.getQueryParse();
    !params.sellerId && (params.sellerId = null);
    !params.operatorId && (params.operatorId = null);
    !params.startTime && (params.startTime = null);
    !params.endTime && (params.endTime = null);
    const listData = await new RefundRecordService(ctx).findPageRefundRecordByConditionV2(ctx.kdtId, params, {
      pageSize,
      pageNumber,
      sort,
    });
    return ctx.json(0, 'ok', listData);
  }

  async getRefundRecordByRefundNo(ctx) {
    const { refundNo, kdtId = ctx.kdtId } = ctx.getQueryParse();
    const data = await new RefundRecordService(ctx).findRefundRecordByRefundNo(kdtId, refundNo, '');
    ctx.json(0, 'ok', data);
  }

  async getRefundRecordByQuery(ctx) {
    const { query } = ctx.getQueryParse();
    const data = await new RefundRecordService(ctx).findRefundRecordByQueryV2(ctx.kdtId, query);
    ctx.json(0, 'ok', data);
  }

  async getStaffList(ctx) {
    const { kdtId, query } = ctx;
    const queryChainStaffRequest = Object.assign({}, query, { kdtId });
    const data = await new ChainStaffService(ctx).search(queryChainStaffRequest);

    ctx.json(0, 'ok', data);
  }

  async getSingleShopStaffList(ctx) {
    const { kdtId, query } = ctx;
    const querySingleStaffRequest = Object.assign({}, query, { kdtId });
    const data = await new SignleStaffService(ctx).find(querySingleStaffRequest);

    ctx.json(0, 'ok', data);
  }
}

module.exports = RefundRecordController;
