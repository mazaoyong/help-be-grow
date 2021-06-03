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
  // 报名学员数
  paidNewStudentCnt: number | string | null;
  // 线下课销售额
  eduCoursePaidAmount: number | string | null;
  // 正式课销售额
  formalCoursePaidAmount: number | string | null;
  // 体验课销售额
  trialCoursePaidAmount: number | string | null;
  // 日期
  currentDay: string;
}

interface IUseInitGoodsData {
  applyDataOverviewItemDTO: IResponseModel;
  loading: boolean;
  applyDataOverviewTrend: IResponseModel[];
}

export const initialState: IResponseModel = {
  paidNewStudentCnt: '-',
  eduCoursePaidAmount: '-',
  formalCoursePaidAmount: '-',
  trialCoursePaidAmount: '-',
  currentDay: '',
};

export const useInitOverviewData = (
  dateType: string,
  startDay: string,
  endDay: string,
  subKdtId: number
): IUseInitGoodsData => {
  const [loading, setLoading] = useState(true);
  const [applyDataOverviewItemDTO, setData] = useState(initialState);
  const [applyDataOverviewTrend, setTrend] = useState([]);
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
        setData(get(res, 'applyDataOverviewItemDTO', initialState));
        setTrend(get(res, 'applyDataOverviewTrend', []));
      })
      .catch(msg => {
        Notify.error(msg || errMsg);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [startDay, dateType, subKdtId]);
  return { applyDataOverviewItemDTO, applyDataOverviewTrend, loading };
};
