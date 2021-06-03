const BaseController = require('../base/BaseController');
const UnifiedAttributeItemFacade = require('../../services/owl/pc/attributeItem/UnifiedAttributeItemFacade');

class InfoCollectionsController extends BaseController {
  async getByAliasJSON(ctx) {
    const { kdtId } = ctx;

    const { sceneId } = ctx.getQueryParse();

    const res = await new UnifiedAttributeItemFacade(ctx).findAttributes(kdtId, { sceneId });

    return ctx.json(0, 'ok', res);
  }
}

module.exports = InfoCollectionsController;
