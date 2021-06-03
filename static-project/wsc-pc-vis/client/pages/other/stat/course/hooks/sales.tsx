/**
 * 初始化课时销售表数据
 */

import { useEffect, useState } from 'react';
import { Notify } from 'zent';
import get from 'lodash/get';
import toSnakeCase from 'zan-utils/string/toSnakeCase';
import { findCourseAssetPaidByPage, findCourseAssetPaidTotal } from '../api';
import { errMsg, hqKdtId } from '../config';
import { getQueryType } from '../helper';

interface IResponseListModel {
  name: string;
  assetNum: number;
  paidAmount: number;
  assetPriceAvg: number;
  assetGivenNum: number;
  assetUnusedNum: number;
}

interface IUseInitGoodsData {
  loading: boolean;
  list: IResponseListModel[];
  total: number;
}

interface IRequestModel {
  dateType: string;
  startDay: string;
  endDay: string;
  hqKdtId: number;
  subKdtId: number;
  queryType: number;
  name: string;
  page?: number;
  sortBy?: string;
  sortType?: string;
}

export const useInitSalesData = (
  dateType: string,
  startDay: string,
  endDay: string,
  keyword: string,
  page: number = 1,
  sortBy: string = '',
  sortType: string = '',
  subKdtId: number,
): IUseInitGoodsData => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const startDayStr = startDay.replace(/-/g, '');
  const endDayStr = endDay.replace(/-/g, '');

  useEffect(() => {
    if (!startDay || !endDay) {
      return;
    }

    const totalparams: IRequestModel = {
      dateType,
      startDay: startDayStr,
      endDay: endDayStr,
      subKdtId,
      hqKdtId,
      queryType: getQueryType(subKdtId),
      name: keyword,
    };
    const pageparams: IRequestModel = Object.assign({
      page,
      sortBy: toSnakeCase(sortBy).toUpperCase(),
      sortType: sortType.toUpperCase(),
    }, totalparams);

    setLoading(true);
    Promise.all([
      findCourseAssetPaidTotal(totalparams),
      findCourseAssetPaidByPage(pageparams),
    ])
      .then(([total = {}, res]) => {
        const list = get(res, 'content', []);
        const totalItems = get(res, 'total', 0);
        total && list.splice(0, 0, { name: '总计', ...total });
        setList(list);
        setTotal(totalItems);
      })
      .catch(msg => {
        Notify.error(msg || errMsg);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dateType, startDay, endDay, keyword, page, sortBy, sortType, subKdtId]);

  return { list, total, loading };
};
