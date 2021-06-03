const BaseController = require('../base/BaseController');
const EnrollmentPosterService = require('../../services/ump/enrollment-poster/EnrollmentPosterService');
// const mock = require('./mock');

class EnrollmentPosterController extends BaseController {
  async getIndexHtml(ctx) {
    await ctx.render('ump/enrollment-poster/index.html');
  }

  async getList(ctx) {
    const { pageSize, pageNumber, query } = ctx.getQueryParse();
    const data = await new EnrollmentPosterService(ctx).findByConditionPage(
      ctx.kdtId,
      {
        pageSize: parseInt(pageSize),
        pageNumber: parseInt(pageNumber),
      },
      query
        ? {
          id: query.id || null,
          title: query.title || null,
        }
        : {},
    );
    ctx.json(0, 'ok', data);
  }

  async createPoster(ctx) {
    const data = ctx.request.body;
    const res = await new EnrollmentPosterService(ctx).create(ctx.kdtId, data);
    ctx.json(0, 'ok', res);
  }

  async editPoster(ctx) {
    const data = ctx.request.body;
    const res = await new EnrollmentPosterService(ctx).edit(ctx.kdtId, data);
    ctx.json(0, 'ok', res);
  }

  async deletePoster(ctx) {
    const data = ctx.request.body;
    const res = await new EnrollmentPosterService(ctx).delete(ctx.kdtId, { id: data.id });
    ctx.json(0, 'ok', res);
  }

  async getById(ctx) {
    const { id } = ctx.getQueryParse();
    const res = await new EnrollmentPosterService(ctx).getById(ctx.kdtId, id);
    ctx.json(0, 'ok', res);
  }
}

module.exports = EnrollmentPosterController;
