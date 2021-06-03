/**
 * 用于格式化出符合格式的列表请求，这个函数不会对需要传递的参数进行降级
 * 只会对参数的字段进行字段名校验以及字段的聚合
 * @author chenzihao
 */
import isEqual from 'lodash/isEqual';

interface IPageRequest {
  pageNumber: number;
  pageSize: number;
  sort?: {
    orders: [{
      direction: 'DESC' | 'ASC';
      property: string;
    }];
  };
}

interface IFormatedRes {
  zanQuery?: object;
  pageRequest: IPageRequest;
}

function formatPageRequest(params: {[key: string]: any} & IPageRequest): IFormatedRes {
  if (typeof params !== 'object' || !(params instanceof Object)) {
    throw new Error('[format page-request]格式化带分页的请求参数要求参类型为对象');
  }

  const { pageSize, pageNumber, sort, ...zanQuery } = params;
  if (!pageSize || !pageNumber) {
    throw new Error('[format page-request]需要格式化的参数中不存在pageNumber或pageSize属性');
  }
  const res: IFormatedRes = {
    pageRequest: {
      pageNumber,
      pageSize,
    },
    zanQuery,
  };

  if (sort) {
    if (Array.isArray(sort.orders)) {
      const keysOfSort = Object.keys(sort.orders[0]);
      const isPropertyEqual = isEqual(['direction', 'property', 'nullHandling'], keysOfSort);
      if (!isPropertyEqual) {
        throw new Error('[format page-request]orders属性格式错误！');
      } else {
        res.pageRequest.sort = sort;
      }
    } else {
      throw new Error('[format page-request]orders应该是一个数组');
    }
  }

  return res;
}

export default formatPageRequest;
