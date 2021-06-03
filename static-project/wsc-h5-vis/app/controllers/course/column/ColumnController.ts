import { Context } from 'astroboy';
import BaseController from '../../base/BaseNewController';
import ClientEduProductFacade from '../../../services/api/owl/api/ClientEduProductFacade';

export = class ColumnController extends BaseController {
  async getNextEduProductInfo(ctx: Context) {
    const { query, visBuyer } = ctx;
    const eduProductQuery = {
      alias: query.alias,
      columnAlias: query.columnAlias,
      sortType: query.sortType,
      buyerId: visBuyer.buyerId,
    };
    const res = await new ClientEduProductFacade(ctx).getNextEduProductInfo(ctx.kdtId, eduProductQuery);
    ctx.json(0, 'ok', res);
  };
}
