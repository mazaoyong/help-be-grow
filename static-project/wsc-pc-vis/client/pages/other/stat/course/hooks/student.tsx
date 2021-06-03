/**
 * 初始化线索来源分析数据
 */

import { useEffect, useState } from 'react';
import { Notify } from 'zent';
import get from 'lodash/get';
import { getStudentPaidAmount } from '../api';
import { errMsg, hqKdtId } from '../config';
import { getQueryType } from '../helper';

interface IResponseModel {
  name: string;
  amount: number;
  amountLastRate: string;
  count: number;
  countLastRate: string;
  amountLastTrend: number;
  countLastTrend: number;
}

interface IUseInitGoodsData {
  loading: boolean;
  list: IResponseModel[];
  data: object;
}

const initList: IResponseModel[] = [];

export const useInitStudentData = (
  dateType: string,
  startDay: string,
  endDay: string,
  subKdtId: number
) : IUseInitGoodsData => {
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState(initList);
  const [data, setData] = useState({});
  const startDayStr = startDay.replace(/-/g, '');
  const endDayStr = endDay.replace(/-/g, '');

  useEffect(() => {
    if (!startDay || !dateType) {
      return;
    }

    setLoading(true);
    getStudentPaidAmount(
      {
        dateType,
        startDay: startDayStr,
        endDay: endDayStr,
        subKdtId,
        hqKdtId,
        queryType: getQueryType(subKdtId),
      })
      .then(res => {
        const list: IResponseModel[] = [];
        const parsedPieData = {};
        const newPaid = get(res, 'newApplyDataStudentPaid', {});
        const oldPaid = get(res, 'oldApplyDataStudentPaid', {});
        [
          {
            val: newPaid,
            name: '新学员',
          }, {
            val: oldPaid,
            name: '老学员',
          },
        ].map(({ val: paid, name }) => {
          if (paid) {
            const {
              paidAmount,
              paidNum,
              paidAmountCompareToLastRate,
              paidAmountCompareToLastTrend,
              paidNumCompareToLastRate,
              paidNumCompareToLastTrend,
            } = paid;
            list.push({
              name,
              amount: paidAmount,
              amountLastRate: paidAmountCompareToLastRate,
              amountLastTrend: paidAmountCompareToLastTrend,
              count: paidNum,
              countLastRate: paidNumCompareToLastRate,
              countLastTrend: paidNumCompareToLastTrend,
            });
            parsedPieData[name] = paidAmount || 0;
          }
        });
        setList(list);
        setData(parsedPieData);
      })
      .catch(msg => {
        Notify.error(msg || errMsg);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [startDay, dateType, subKdtId]);
  return { list, loading, data };
};
