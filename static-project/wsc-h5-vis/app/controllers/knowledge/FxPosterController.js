const KnowledgeBaseController = require('./KnowledgeBaseController');
const FxPosterService = require('../../services/knowledge/FxPosterService');
const RelatedImageService = require('../../services/owl/ump/relatedimage/RelatedImageCustomFacade');
const { posterType } = require('../../constants/knowledge');

class FxPosterController extends KnowledgeBaseController {
  async getFindRelatedImgJson(ctx) {
    const params = {
      kdtId: ctx.kdtId || 0,
      channel: posterType.FX_POSTER,
      targetAlias: ctx.query.alias,
    };

    const result = await new FxPosterService(ctx).findRelatedImg(params);

    ctx.json(0, 'ok', result);
  }

  async getPosterImgListJson(ctx) {
    const kdtId = ctx.kdtId || 0;
    const params = {
      kdtId: ctx.kdtId || 0,
      channel: posterType.FX_POSTER,
      targetAlias: ctx.query.alias,
    };

    const result = await new RelatedImageService(ctx).findRelatedImg([kdtId, params]);

    ctx.json(0, 'ok', result);
  }
}

module.exports = FxPosterController;
