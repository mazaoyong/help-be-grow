/**
 * 初始化概览数据
 */

import { useEffect, useState } from 'react';
import { Notify } from 'zent';
import get from 'lodash/get';
import { getOverview } from '../api';
import { errMsg, hqKdtId } from '../config';
import { getQueryType } from '../helper';

interface IResponseModel {
  // 新增线索数
  newCnt: number | string | null;
  // 试听线索数
  auditionCnt: number | string | null;
  // 成交线索数
  dealCnt: number | string | null;
  // 成交金额数
  dealAmount: number | string | null;
  // 日期
  currentDay: string;
}

interface IUseInitGoodsData {
  clueDataOverviewItemDTO: IResponseModel;
  loading: boolean;
  clueDataOverviewTrend: IResponseModel[];
}

export const initialState: IResponseModel = {
  newCnt: '—',
  auditionCnt: '—',
  dealCnt: '—',
  dealAmount: '—',
  currentDay: '',
};

export const useInitOverviewData = (
  dateType: string,
  startDay: string,
  endDay: string,
  subKdtId: number
): IUseInitGoodsData => {
  const [loading, setLoading] = useState(true);
  const [clueDataOverviewItemDTO, setData] = useState(initialState);
  const [clueDataOverviewTrend, setTrend] = useState([]);
  const startDayStr = startDay.replace(/-/g, '');
  const endDayStr = endDay.replace(/-/g, '');

  useEffect(() => {
    if (!startDay || !dateType) {
      return;
    }

    setTrend([]);
    setLoading(true);
    getOverview(
      {
        dateType,
        startDay: startDayStr,
        endDay: endDayStr,
        subKdtId,
        hqKdtId,
        queryType: getQueryType(subKdtId),
      })
      .then(res => {
        setData(get(res, 'clueDataOverviewItemDTO', initialState));
        setTrend(get(res, 'clueDataOverviewTrend', []));
      })
      .catch(msg => {
        Notify.error(msg || errMsg);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [startDay, dateType, subKdtId]);
  return { clueDataOverviewItemDTO, clueDataOverviewTrend, loading };
};
