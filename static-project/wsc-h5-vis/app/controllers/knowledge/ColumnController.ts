import { Context } from 'astroboy';

import KnowledgeBaseController from './KnowledgeBaseController';
import ColumnService from '../../services/owl/api/ColumnService';
import ClientContentFacade from '../../services/api/owl/api/ClientContentFacade.js';
import ClientColumnService from '../../services/owl/client/onlinecourse/ClientColumnFacade';
import DirectoryFacade from '../../services/api/owl/api/DirectoryFacade';
import OwlCommonService from '../../services/api/owl/biz/OwlCommonService'

const SIZE = 10;

class ColumnController extends KnowledgeBaseController {
  /**
   * 所有专栏
   */
  async getColumnsJson(ctx: Context) {
    const { page, pageSize } = ctx.query;
    const { buyerId } = ctx.visBuyer;
    const columns = await new ClientColumnService(ctx).findPageByKdtIdAndUserId(ctx.kdtId, {
      userId: buyerId,
    }, {
      pageNumber: page,
      pageSize: pageSize || SIZE,
      sort: {
        orders: [
          {
            property: 'serial_no',
            direction: 'DESC',
            nullHandling: null,
          },
          {
            property: 'publish_at',
            direction: 'DESC',
            nullHandling: null,
          },
        ],
      },
    });
    ctx.json(0, 'ok', columns);
  }

  /**
   * 专栏详情
   */
  async getColumnJson(ctx: Context) {
    const { alias = '' } = ctx.query;
    const { buyerId } = ctx.visBuyer;
    const query = {
      alias,
      userId: buyerId,
    };
    const column = await new ClientColumnService(ctx).getColumnDetail(ctx.kdtId, query);
    ctx.json(0, 'ok', column);
  }

  /**
   * 购买的专栏
   */
  async getPaidColumnsJson(ctx: Context) {
    const { page, pageSize } = ctx.query;
    const { buyerId } = ctx.visBuyer;
    const columns = await new ClientColumnService(ctx)
      .findPageColumnsByKdtIdAndUserIdSub(ctx.kdtId, {
        userId: buyerId,
      }, {
        pageSize: pageSize || SIZE,
        pageNumber: page,
      });
    ctx.json(0, 'ok', columns);
  }

  /**
   * 获取知识付费在专栏列表的下一篇
   */
  async getNextOwlInfoJson(ctx: Context) {
    const { kdtId, buyerId } = ctx;
    const { owlType, alias, sortType = 'desc' } = ctx.query;
    const owlOperateDTO = {
      kdtId,
      buyerId,
      owlType,
      alias,
      sortType,
    };
    const result = await new OwlCommonService(ctx).getNextOwlInfo(owlOperateDTO as any);
    ctx.json(0, 'ok', result);
  }

  // 获取内容详情页->（专栏）目录状态
  async getIsPaidJson(ctx: Context) {
    const {
      columnAlias,
    } = ctx.getQueryData();

    const result = await new ColumnService(ctx).getIsPaid(ctx.kdtId, columnAlias, ctx.buyerId);
    ctx.json(0, 'ok', result);
  }

  // 获取专栏详情页->免费内容列表
  async getFreeContentAndLiveJson(ctx: Context) {
    const {
      columnAlias,
      sortType,
    } = ctx.getQueryData();

    const result = await new ColumnService(ctx).findFreeContentAndLiveV2(ctx.kdtId, columnAlias, sortType);
    ctx.json(0, 'ok', result);
  }

  async getColumnChaptersJson(ctx: Context) {
    const { kdtId, query } = ctx;
    const { columnAlias, pid } = query;
    
    this.validator.required(columnAlias, "缺少必要参数 columnAlias");

    // 写死啦。
    const pageRequest  = {
      pageNumber: 1,
      pageSize: 100,
    }

    const queryDTO = {
      pid,
      columnAlias,
    }
    
    const result = await new DirectoryFacade(ctx).queryDirectoryList(kdtId, pageRequest, queryDTO)
    ctx.json(0, 'ok', result);
  }

  // 获取专栏详情页->内容列表
  async getContentAndLiveJson(ctx: Context) {
    interface IPageRequest {
      pageNumber: number,
      pageSize: number,
      sort: {
        orders: {
          direction: string,
          property: string,
        }[]
      }
    }
    const { kdtId, buyerId } = ctx;
    const { pageNumber, pageSize = 10, columnAlias, sortType = '', chapterId: directoryId = null } = ctx.query;
    const direction: string = sortType.toUpperCase();
    const query = {
      buyerId,
      kdtId,
      columnAlias,
      directoryId,
    };
    const pageRequest = {
      pageNumber,
      pageSize,
      sort: direction? {
        orders: [
          {
            direction,
            property: 'columnSerialNo',
          },
          {
            direction,
            property: 'publishAt',
          },
        ],
      } :{},      
    };

    const result = await new ClientContentFacade(ctx).findPageContentWithLive(kdtId, query, pageRequest);
    ctx.json(0, 'ok', result);
  }
}

// module.exports = ColumnController;
export = ColumnController;
