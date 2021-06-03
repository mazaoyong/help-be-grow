/**
 * 初始化概览数据
 */

import { useEffect, useState } from 'react';
import { Notify } from 'zent';
import get from 'lodash/get';
import { getAttendanceOverview } from '../api';
import { errMsg } from '../config';
import { hqKdtId } from '../../common/config';
import { getQueryType } from '../../common/helper';

export interface IResponseModel {
  absentStuCnt: number | string;
  dayOffStuCnt: number | string;
  scheduledStuCnt: number | string;
  signedStuCnt: number | string;
  unsignedStuCnt: number | string;
  // 日期
  currentDay: string;
}

interface IUseInitGoodsData {
  overviewItemDTO: IResponseModel;
  loading: boolean;
  overviewItemTrendDTO: IResponseModel[];
}

export const initialState: IResponseModel = {
  absentStuCnt: '-',
  dayOffStuCnt: '-',
  scheduledStuCnt: '-',
  signedStuCnt: '-',
  unsignedStuCnt: '-',
  currentDay: '',
};

export const useInitOverviewData = (
  dateType: string,
  startDay: string,
  endDay: string,
  subKdtId: number,
): IUseInitGoodsData => {
  const [loading, setLoading] = useState(true);
  const [overviewItemDTO, setData] = useState(initialState);
  const [overviewItemTrendDTO, setTrend] = useState([]);
  const startDayStr = startDay.replace(/-/g, '');
  const endDayStr = endDay.replace(/-/g, '');

  useEffect(() => {
    if (!startDayStr || !endDayStr || !dateType) {
      return;
    }

    setTrend([]);
    setLoading(true);
    getAttendanceOverview(
      {
        dateType,
        startDay: startDayStr,
        endDay: endDayStr,
        subKdtId,
        hqKdtId,
        queryType: getQueryType(subKdtId),
      })
      .then(res => {
        setData(get(res, 'overviewItemDTO', initialState));
        setTrend(get(res, 'overviewItemTrendDTO', []));
      })
      .catch(msg => {
        Notify.error(msg || errMsg);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [startDayStr, endDayStr, dateType, subKdtId]);
  return { overviewItemDTO, overviewItemTrendDTO, loading };
};
