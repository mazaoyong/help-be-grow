const BaseController = require('../base/BaseController');
const CertificateTemplateService = require('../../services/owl/pc/certificate/CertificateTemplateService');
const CertificateService = require('../../services/owl/pc/certificate/CertificateService');

/**
 * 证书
 */
class CertificateController extends BaseController {
  init() {
    super.init();
  }

  async getIndexHtml(ctx) {
    const kdtId = ctx.kdtId;

    // 店铺生命周期
    const lifecycle = await this.callService(
      'wsc-pc-base/shop.ProdReadService',
      'queryShopProds',
      kdtId,
    );

    ctx.setGlobal('lifecycle', lifecycle);

    await ctx.render('ump/certificate/index.html');
  }

  async findCertificateTemplate(ctx) {
    const { pageRequest, query } = ctx.getQueryParse();
    const data = await new CertificateTemplateService(ctx).find(ctx.kdtId, pageRequest, query);
    return ctx.json(0, 'ok', data);
  }

  async getCertificateTemplate(ctx) {
    const { kdtId } = ctx;
    const { id } = ctx.getQueryParse();
    const data = await new CertificateTemplateService(ctx).get(kdtId, id);
    return ctx.json(0, 'ok', data);
  }

  async createCertificateTemplate(ctx) {
    const { body } = ctx.request;
    const data = await new CertificateTemplateService(ctx).create(ctx.kdtId, body);
    return ctx.json(0, 'ok', data);
  }

  async updateCertificateTemplate(ctx) {
    const { body } = ctx.request;
    const data = await new CertificateTemplateService(ctx).update(ctx.kdtId, body);
    return ctx.json(0, 'ok', data);
  }

  async deleteCertificateTemplate(ctx) {
    const { kdtId } = ctx;
    const { body } = ctx.request || {};
    const { id } = body;
    const data = await new CertificateTemplateService(ctx).delete(kdtId, id);
    return ctx.json(0, 'ok', data);
  }

  async invalidCertificateTemplate(ctx) {
    const { kdtId } = ctx;
    const { body } = ctx.request || {};
    const { id } = body;
    const data = await new CertificateTemplateService(ctx).invalid(kdtId, id);
    return ctx.json(0, 'ok', data);
  }

  async findCertificate(ctx) {
    const { pageRequest, query } = ctx.getQueryParse();
    const data = await new CertificateService(ctx).find(ctx.kdtId, pageRequest, query);
    return ctx.json(0, 'ok', data);
  }
}

module.exports = CertificateController;
