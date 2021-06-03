/**
 * 初始化线索转化分析数据
 */

import { useEffect, useState } from 'react';
import { Notify } from 'zent';
import { getCVRAnalyse } from '../api';
import { errMsg, hqKdtId } from '../config';
import { getQueryType } from '../helper';

interface IResponseDataModel {
  newToInviteRate: string;
  newToDealRate: string;
  inviteToAuditionRate: string;
  auditionToDealRate: string;
  newCnt: string;
  inviteCnt: string;
  auditionCnt: string;
  dealCnt: string;
}

interface IResponseListModel {
  period: string;
  num: string;
  rate: string;
}

interface IUseInitGoodsData {
  loading: boolean;
  list: IResponseListModel[];
  data: IResponseDataModel;
}

const getColumnsList = (data) => {
  const {
    dealCntSeven = '0',
    dealCntSevenRate = '--',
    dealCntFifteen = '0',
    dealCntFifteenRate = '--',
    dealCntThirty = '0',
    dealCntThirtyRate = '--',
    dealCntOverThirty = '0',
    dealCntOverThirtyRate = '--',
  } = data;
  return [{
    period: '7天',
    num: dealCntSeven,
    rate: dealCntSevenRate,
  }, {
    period: '15天',
    num: dealCntFifteen,
    rate: dealCntFifteenRate,
  }, {
    period: '30天',
    num: dealCntThirty,
    rate: dealCntThirtyRate,
  }, {
    period: '全部',
    num: dealCntOverThirty,
    rate: dealCntOverThirtyRate,
  }];
};

export const initialState: IResponseDataModel = {
  newToInviteRate: '',
  newToDealRate: '',
  inviteToAuditionRate: '',
  auditionToDealRate: '',
  newCnt: '',
  inviteCnt: '',
  auditionCnt: '',
  dealCnt: '',
};

interface IRequestModel {
  dateType: number;
  startDay: string;
  endDay: string;
  hqKdtId: number;
  subKdtId: number;
  queryType: number;
  srcId?: number;
  srcGroupId?: number;
}

export const useInitConversionData = (
  startDay: string,
  endDay: string,
  srcId: number | null,
  srcGroupId: number | null,
  trigger: boolean,
  subKdtId: number,
): IUseInitGoodsData => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState(getColumnsList({}));
  const [data, setData] = useState(initialState);
  const startDayStr = startDay.replace(/-/g, '');
  const endDayStr = endDay.replace(/-/g, '');

  useEffect(() => {
    if (!startDay || !endDay) {
      return;
    }

    const params: IRequestModel = {
      dateType: 1,
      startDay: startDayStr,
      endDay: endDayStr,
      subKdtId,
      hqKdtId,
      queryType: getQueryType(subKdtId),
    };

    if (srcId) {
      params.srcId = srcId;
    }

    if (srcGroupId) {
      params.srcGroupId = srcGroupId;
    }

    setLoading(true);
    getCVRAnalyse(params)
      .then(res => {
        setList(getColumnsList(res));
        setData(res);
      })
      .catch(msg => {
        Notify.error(msg || errMsg);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [trigger, subKdtId]);

  return { list, loading, data };
};
