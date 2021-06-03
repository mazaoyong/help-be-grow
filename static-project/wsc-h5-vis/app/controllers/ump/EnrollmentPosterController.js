const BaseController = require('../base/BaseController');
const EnrollmentPosterService = require('../../services/ump/enrollment-poster/EnrollmentPosterService');

class EnrollmentPosterController extends BaseController {
  async getIndexHtml(ctx) {
    this.setSpm('eduposter', ctx.kdtId);
    // await this.baseAcl();
    await this.initGlobalTheme();
    await ctx.render('ump/enrollment-poster.html');
  }

  async getById(ctx) {
    const { id } = ctx.query;
    const res = await new EnrollmentPosterService(ctx).getById(ctx.kdtId, id);
    ctx.json(0, 'ok', res);
  }
};

module.exports = EnrollmentPosterController;
