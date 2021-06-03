import React from 'react';
import qs from 'qs';
import { Notify } from 'zent';
import { format } from 'date-fns';
import formatMoney from '@youzan/utils/money/format';
import { getSummaryDetailAssetInfo } from '../../../domain/apis/detail';
import {
  transAssetInfo2overviewInfo,
  transStudentInfo2overviewInfo,
} from 'pages/edu-admin/course-summary/utils';
import { getStudentInfoByNo } from '@ability-center/student';

import type {
  IUseSummaryDetailCommonModelRes,
  NotNullCommonModelRes,
  UseSummaryDetailCommonModelType,
} from './types';

const FORMAT_DATE_STRING = 'YYYY-MM-DD';
const FORMAT_TIME_STRING = FORMAT_DATE_STRING + ' H:mm:ss';

type SummaryDetailResType = IUseSummaryDetailCommonModelRes;
export const useSummaryDetailCommonModel: UseSummaryDetailCommonModelType = (params) => {
  const { studentId, assetNo, overviewType, queryString } = params;
  const [dumpFilter] = React.useState(safeJSONMarshall(queryString));
  const [loading, setLoading] = React.useState(true);
  const [studentInfo, setStudentInfo] = React.useState<SummaryDetailResType['studentInfo']>(null);
  const [assetInfo, setAssetInfo] = React.useState<SummaryDetailResType['assetInfo']>(null);

  React.useEffect(() => {
    if (studentId || assetNo) {
      if (overviewType === 'student') {
        getStudentInfoByNo({ studentId })
          .then(transStudentInfo2overviewInfo)
          .then((data) => {
            setStudentInfo(data.studentInfo);
            setAssetInfo(data.assetInfo);
          })
          .catch(Notify.error)
          .finally(() => setLoading(false));
      } else if (overviewType === 'course') {
        getSummaryDetailAssetInfo({
          assetNo,
        })
          .then((data) => transAssetInfo2overviewInfo(data))
          .then((data) => {
            setStudentInfo(data.studentInfo);
            setAssetInfo(data.assetInfo);
          })
          .catch(Notify.error)
          .finally(() => setLoading(false));
      }
    } else {
      Notify.error('缺少必要参数，无法获取学员或是资产信息');
      setLoading(false);
    }
  }, [assetNo, overviewType, studentId]);

  /** 顶部的学员/资产信息展示部分的配置 */
  const overviewContentConfig = React.useMemo<SummaryDetailResType['overviewContentConfig']>(() => {
    if (overviewType === 'course') {
      return {
        contentGroup: [
          [
            { label: '线下课', name: 'courseName' },
            { label: '课程有效期', name: 'validity' },
            {
              label: '课程总课时',
              render(data) {
                if (data.totalNum) {
                  return (Number(data.totalNum) / 100).toFixed(2);
                }
                return '-';
              },
            },
          ],
          [
            {
              label: '课程实付金额',
              render(data) {
                return formatMoney(data.totalRealPay);
              },
            },
            { label: '适用课程', name: 'eduCourseName' },
            {
              label: '所在班级',
              render(data) {
                if (data.classesList) {
                  return data.classesList.join('、');
                }
                return '-';
              },
            },
          ],
          [
            {
              label: '课程总学费',
              render(data) {
                return formatMoney(data.totalTuition);
              },
            },
            {
              label: '报名时间',
              render(data) {
                if (data.registerTime) {
                  return format(data.registerTime, FORMAT_TIME_STRING);
                }
                return '-';
              },
            },
          ],
        ],
      };
    }
    return {};
  }, [overviewType]);

  return {
    loading,
    studentInfo,
    assetInfo,
    overviewContentConfig,
    dumpFilter,
  };
};

export function isReadyToDisplay(
  overviewData: SummaryDetailResType,
): overviewData is NotNullCommonModelRes {
  return overviewData.loading !== true;
}

function safeJSONMarshall(jsonString: string) {
  try {
    return qs.parse(jsonString, { ignoreQueryPrefix: true });
  } catch (err) {
  }
  return {};
}
