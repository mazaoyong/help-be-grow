const CertificateCustomFacade = require('../../services/owl/client/ump/certificate/CertificateCustomFacade');
const CertificateTemplateCustomFacade = require('../../services/owl/client/ump/certificate/CertificateTemplateCustomFacade');
const EduBaseController = require('./EduBaseController');

class CertificateCustomFacadeController extends EduBaseController {
  // 证书列表
  async findCertificateJson(ctx) {
    const kdtId = ctx.kdtId;
    const userId = ctx.buyerId;
    // const kdtId = 52006553;
    // const userId = 8000056713;

    const {
      pageNumber,
      pageSize,
      findType,
      sourceId,
      sourceType,
      status,
      popStatus,
    } = ctx.query;

    let query = {};
    // 个人中心-全部证书列表
    if (Number(findType) === 1) {
      query = {
        userId,
      };
    }
    // 个人中心-未查看
    if (Number(findType) === 2) {
      query = {
        userId,
        status,
      };
    }
    // 个人中心-未弹窗
    if (Number(findType) === 3) {
      query = {
        userId,
        popStatus,
      };
    }
    // 线下课-未查看
    if (Number(findType) === 4) {
      query = {
        userId,
        sourceId,
        sourceType,
        status,
      };
    }
    // 线下课-未弹窗
    if (Number(findType) === 5) {
      query = {
        userId,
        sourceId,
        sourceType,
        popStatus,
      };
    }
    const pageRequest = {
      pageNumber,
      pageSize,
      sort: {
        orders: [
          {
            direction: 'DESC',
            property: 'created_at',
          },
        ],
      },
    };
    const res = await new CertificateCustomFacade(ctx).find(kdtId, pageRequest, query);
    ctx.json(0, 'ok', res);
  }
  // 更改弹窗状态
  async batchUpdatePopStatusJson(ctx) {
    const kdtId = ctx.kdtId;
    const { certificateIds, popStatus } = ctx.getPostData();
    const res = await new CertificateCustomFacade(ctx).batchUpdatePopStatus(kdtId, certificateIds, popStatus);
    ctx.json(0, 'ok', res);
  }
  // 更改证书状态
  async batchUpdateStatusJson(ctx) {
    const kdtId = ctx.kdtId;
    const { id, status } = ctx.getPostData();
    const res = await new CertificateCustomFacade(ctx).batchUpdateStatus(kdtId, id, status);
    ctx.json(0, 'ok', res);
  }
  // 模版调用记录
  async increaseQrScanNumJson(ctx) {
    const kdtId = ctx.kdtId;
    const { templateId } = ctx.getPostData();
    const res = await new CertificateTemplateCustomFacade(ctx).increaseQrScanNum(kdtId, templateId);
    ctx.json(0, 'ok', res);
  }
}

module.exports = CertificateCustomFacadeController;
