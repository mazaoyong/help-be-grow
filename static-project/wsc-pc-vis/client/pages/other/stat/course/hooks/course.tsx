/**
 * 初始化线索来源分析数据
 */

import { useEffect, useState, Dispatch } from 'react';
import { Notify } from 'zent';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { getCoursePaidAmount } from '../api';
import { errMsg, hqKdtId } from '../config';
import { getQueryType } from '../helper';

interface IResponseModel {
  courseName: string;
  paidAmount: number;
  courseId: number;
}

interface IUseInitGoodsData {
  loading: boolean;
  data: IResponseModel[];
  setData: Dispatch<IResponseModel[]>;
}

const initData: IResponseModel[] = [];

export const useInitCourseData = (
  dateType: string,
  startDay: string,
  endDay: string,
  courseIdList: number[],
  setCourseIdList: Dispatch<number[]>,
  setShowCourseIdList: Dispatch<number[]>,
  subKdtId: number,
) : IUseInitGoodsData => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(initData);
  const [lastSubKdtId, setSubKdtId] = useState(subKdtId);
  const startDayStr = startDay.replace(/-/g, '');
  const endDayStr = endDay.replace(/-/g, '');

  useEffect(() => {
    if (!startDay || !dateType) {
      return;
    }

    if (subKdtId !== lastSubKdtId) {
      setSubKdtId(subKdtId);
      setCourseIdList([]);
      setShowCourseIdList([]);
      return;
    }

    setLoading(true);
    getCoursePaidAmount(
      {
        dateType,
        startDay: startDayStr,
        endDay: endDayStr,
        subKdtId,
        hqKdtId,
        courseIds: courseIdList.join(','),
        queryType: getQueryType(subKdtId),
      })
      .then(res => {
        const data: IResponseModel[] = get(res, 'paidAmountItems', []);
        const courseIds = data.map(({ courseId }) => courseId);
        setData(data);
        if (!isEqual(courseIds, courseIdList)) {
          setCourseIdList(courseIds);
          setShowCourseIdList(courseIds);
        }
      })
      .catch(msg => {
        Notify.error(msg || errMsg);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [startDay, dateType, courseIdList, subKdtId]);
  return { loading, data, setData };
};
