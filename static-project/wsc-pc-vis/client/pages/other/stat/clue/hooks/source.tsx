/**
 * 初始化线索来源分析数据
 */

import { useEffect, useState, Dispatch } from 'react';
import { Notify } from 'zent';
import get from 'lodash/get';
import { getSourceAnalyse } from '../api';
import { errMsg, hqKdtId } from '../config';
import { getQueryType } from '../helper';

interface IResponseListModel {
  currentDay: string;
  sourceName: string;
  statType: string;
  statValue: string | number;
  lastRate: string;
  proporation: string;
  trend: number;
}

interface IResponseTrendModel {
  currentDay: string;
}

interface IUseInitGoodsData {
  loading: boolean;
  list: IResponseListModel[];
  trend: IResponseTrendModel[];
  data: object;
  name: object;
  setTrend: Dispatch<IResponseTrendModel[]>;
  setName: Dispatch<object>;
}

export const useInitSourceData = (
  dateType: string,
  startDay: string,
  endDay: string,
  dataType: number,
  statType: string,
  sourceIdList: number[],
  setSourceIdList: Dispatch<number[]>,
  setShowSourceIdList: Dispatch<number[]>,
  subKdtId: number
) : IUseInitGoodsData => {
  const initTrend: IResponseTrendModel[] = [];
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [data, setData] = useState({});
  const [trend, setTrend] = useState(initTrend);
  const [name, setName] = useState({});
  const startDayStr = startDay.replace(/-/g, '');
  const endDayStr = endDay.replace(/-/g, '');

  useEffect(() => {
    if (!startDay || !dateType) {
      return;
    }

    setLoading(true);
    getSourceAnalyse(
      {
        dateType,
        startDay: startDayStr,
        endDay: endDayStr,
        subKdtId,
        hqKdtId,
        dataType,
        statType,
        sourceIdList: sourceIdList.join(','),
        queryType: getQueryType(subKdtId),
      })
      .then(res => {
        const data: IResponseTrendModel[] = get(res, 'clueDataSourceTrend.data', []);
        const name = get(res, 'clueDataSourceTrend.name', {});
        const list = get(res, 'clueDataSourceItemDTOList', []);
        const parsedPieData = {};
        setList(list);
        setTrend(data);
        setName(name);
        if (list) {
          list.map(item => {
            const value = +item.statValue || 0;
            parsedPieData[item.sourceName] = statType === 'clue_deal_amount' ? value / 100 : value;
          });
          setData(parsedPieData);
        }
        if (data && data[0] && !sourceIdList.length) {
          let selectedIds: number[] = [];
          Object.keys(data[0]).map(key => {
            const splitIdArr = key.split('_');
            if (key !== 'currentDay' && splitIdArr.length === 2) {
              selectedIds.push(+splitIdArr[1]);
            }
          });
          setSourceIdList(selectedIds);
          setShowSourceIdList(selectedIds);
        }
      })
      .catch(msg => {
        Notify.error(msg || errMsg);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [startDay, dateType, statType, dataType, sourceIdList, subKdtId]);
  return { list, trend, loading, data, name, setTrend, setName };
};
