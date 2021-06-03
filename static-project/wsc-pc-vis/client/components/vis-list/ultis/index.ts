import { Location, Query } from 'history';
import qs from 'qs';
import request from './request';
import { IFilterConf, IPageRequest, IVislistTableState, Methods } from './type';

/**
 * 获取数据
 *
 * @param {string} url 请求接口url
 * @param {Object} payload filter参数
 */
export function fetchingData(url: string, payload: object, method: Methods): Promise<any> {
  return request(method, url, payload);
}

/**
 * 用于格式化查询参数
 *
 * @export
 * @param {Object} filterConditions
 * @param {object} pageConditions 分页参数
 * @returns {{ filterConditions: any, pageConditions: IPageRequest}}
 */
export function formatQueries(
  filterConditions: any,
  pageSize?: number,
  pageConditions?: IPageRequest,
): { filterConditions: any; pageConditions: IPageRequest } {
  const tran2RightSortByString = {
    created_time: 'created_time',
    num: 'num',
    totalSoldNum: 'sold_num',
    totalStock: 'stock_num',
  };
  const { pageNumber } = (filterConditions || {}) as any;
  const defaultPageConditions: IPageRequest = {
    pageNumber: pageNumber || 1,
    pageSize: pageSize || 20,
    sort: {
      orders: [
        {
          direction: 'DESC',
          property: 'created_time',
        },
      ],
    },
  };
  // 如果有filter选项，对filter选项进行格式化
  if (filterConditions) {
    const { sortBy, sortType = 'desc' } = filterConditions;
    // 如果没有默认的格式化配置，就用created_time
    const reflect = tran2RightSortByString[sortBy];
    if (defaultPageConditions.sort) {
      if (reflect) {
        defaultPageConditions.sort.orders[0].property = reflect;
      } else {
        if (sortBy) {
          defaultPageConditions.sort.orders[0].property = sortBy;
        }
        // tslint:disable-next-line:no-console
        console.warn('[component vis-list]', `reflect ${sortBy} failed`);
      }
      defaultPageConditions.sort.orders[0].direction = sortType.toUpperCase();
    }
    delete filterConditions.sortBy;
    delete filterConditions.sortType;
    delete filterConditions.pageNumber;
    delete filterConditions.pageSize;
  }

  return {
    filterConditions,
    pageConditions: {
      ...defaultPageConditions,
      ...pageConditions,
    },
  };
}

/**
 * 这是一个方法用于格式化filterOptions，如果是没有关键字的object，就
 *
 * @export
 * @param {Object} waitFormat
 * @returns {IFilterConf}
 */
export function formatFilterOpts(waitFormat: any): IFilterConf {
  const opts: IFilterConf = {
    options: null,
  };
  const filterOptsProps = ['options', 'value', 'hides'];
  const hasProps = has(filterOptsProps, waitFormat);
  if (hasProps.noMatch) {
    opts.options = waitFormat;
    if (Array.isArray(waitFormat)) {
      waitFormat.forEach((i: any) => {
        if (!opts.defaultValue) {
          opts.defaultValue = {};
        }
        if (i.data && i.data.length > 0) {
          opts.defaultValue[i.name] = i.data[0].value;
        }
      });
    }
  } else {
    const keys = Object.keys(hasProps);
    keys.forEach((k: string) => {
      if (k) {
        // 如果存在该属性
        opts[k] = waitFormat[k];
      }
    });
  }
  return opts;
}

// 判断某个对象中是否含有匹配队列中的属性（最浅层中）
function has(matchQueue: string[], tar: object): any {
  const res: object = Object.create(null);
  let unavailable: number = 0;
  matchQueue.forEach((i: any) => {
    res[i] = false;
    if (tar[i]) {
      res[i] = true;
    } else {
      unavailable += 1;
    }
  });
  if (unavailable === matchQueue.length) {
    return {
      noMatch: true,
    };
  }
  return res;
}

export function getQueries(
  location: Location | undefined,
  state: IVislistTableState,
): IVislistTableState | null {
  if (location) {
    const queries = fillQueries(location);
    return {
      ...(state as IVislistTableState),
      queries,
    };
  }
  return null;
}

export function fillQueries(location: Location): Query {
  const { query } = location;
  if (!query) {
    const { search } = location;
    return qs.parse(search) as Query;
  }
  return query;
}
