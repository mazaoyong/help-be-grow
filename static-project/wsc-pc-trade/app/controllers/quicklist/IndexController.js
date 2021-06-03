const BaseController = require('../base/BaseController');
const CmsMaterialService = require('../../services/quicklist/CmsMaterialService');
const SearchService = require('../../services/quicklist/SearchService');
const AppSubscribeQueryService = require('../../services/quicklist/AppSubscribeQueryService');
const get = require('lodash/get');

// 推荐应用 对应的频道id与别名固定
const channelAlias = process.env.NODE_ENV === 'qa' ? 'AC9u48r10' : 'ACoidl10'; // eslint-disable-line
const resourceAdvertAlias = process.env.NODE_ENV === 'qa' ? 'AC9u48s10' : 'ACoidn10';
const resourceRecommendAlias = process.env.NODE_ENV === 'qa' ? 'AC9u48t10' : 'ACoidm10';
const categoryId = process.env.NODE_ENV === 'qa' ? 1738401 : 69231; // qa环境的没有打单发货的CategoryId

const bizCode = 10; // 应用中心bizCode
const referenceUrl = 'https://www.youzan.com/v4/trade/quicklist';
const FROM_PLATFORM = {
  APP: 0, // 应用市场的应用
};
class IndexController extends BaseController {
  /**
   * @param {AstroboyContext} ctx
   * @memberof IndexController
   */
  async getIndexHtml(ctx) {
    const { kdtId } = ctx;
    const res = await new AppSubscribeQueryService(ctx).queryAppSubscribeList({
      kdtId,
      categoryId,
    });
    const appSubscribeList = get(res, 'appSubscribeList', []);
    ctx.setGlobal('appSubscribeList', appSubscribeList);
    await ctx.render('quicklist/index.html');
  }

  async getRecommend(ctx) {
    const res = await new CmsMaterialService(ctx).query({
      channelAlias,
      resourceAlias: resourceRecommendAlias,
      bizCode,
      referenceUrl,
    });
    const list = get(res, 'data', []);
    const appIds = list.map(item => item.itemId);
    const appItems =
      appIds && appIds.length > 0
        ? await new SearchService(ctx).query({
            appIds,
            platform: FROM_PLATFORM.APP,
          })
        : [];
    ctx.json(0, 'ok', appItems);
  }

  async getAdvert(ctx) {
    const data = await new CmsMaterialService(ctx).query({
      channelAlias,
      resourceAlias: resourceAdvertAlias,
      bizCode,
      referenceUrl,
    });
    ctx.json(0, 'ok', data);
  }
}

module.exports = IndexController;
