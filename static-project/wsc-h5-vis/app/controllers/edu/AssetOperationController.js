const EduAssetOperationFacade = require('../../services/owl/client/edu/eduoperation/EduAssetOperationFacade');
const EduBaseController = require('./EduBaseController');

class AssetOperatioController extends EduBaseController {
  // 线下课课程资产变更明细
  async queryAssetOperationPageJson(ctx) {
    const kdtId = ctx.kdtId;
    const {
      page,
      pageSize,
      assetNo,
      studentId,
      operationOriginType,
    } = ctx.query;

    const query = {
      assetNo,
      kdtId,
      studentId,
      operationOriginType,
    };
    const pageParams = {
      pageNumber: page,
      pageSize,
      sort: {
        orders: [
          {
            direction: 'DESC',
            property: 'event_time',
          },
        ],
      },
    };
    const res = await new EduAssetOperationFacade(ctx)
      .queryAssetOperationPage(kdtId, query, pageParams);
    ctx.json(0, 'ok', res);
  }
}

module.exports = AssetOperatioController;
