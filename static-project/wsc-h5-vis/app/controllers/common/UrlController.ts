import { Context } from 'astroboy';
const BaseController = require('../../controllers/base/BaseNewController');
const ShortenUrlService = require('../../services/owl/common/ShortenUrlFacade');

class UrlController extends BaseController {
  async getShortenUrl(ctx: Context) {
    const { url = '' } = ctx.query;
    const result = await new ShortenUrlService(ctx).getShortenUrl(url);
    ctx.json(0, 'ok', result);
  }
}

module.exports = UrlController;
