/**
 * 非独立页面的一些直播相关接口聚合
 */
import { Context } from 'astroboy';
import LiveBaseController from './LiveBaseController';
import ClientLiveFacade from '../../../services/owl/client/onlinecourse/ClientLiveFacade';

class LiveApiController extends LiveBaseController {
  public async findPageForWym(ctx: Context) {
    const { kdtId, userId } = ctx;
    const { query = {}, pageRequest = {} } = ctx.getQueryParse('');
    const { ids = [], source = 0 } = query;
    const { pageNumber = 1, pageSize = 10, sort = null, countEnabled } = pageRequest;
    const result = await new ClientLiveFacade(ctx).findPageForWym(kdtId,
      { ids, source, userId },
      {
        pageNumber,
        pageSize,
        countEnabled,
        sort: sort || {
          orders: [
            {
              direction: 'DESC',
              property: 'serial_no',
            },
            {
              direction: 'DESC',
              property: 'publish_at',
            },
          ],
        },
      });
    ctx.json(0, 'ok', result);
  }
}

export = LiveApiController;
