import React from 'react';
import { format } from 'date-fns';
import formatMoney from '@youzan/utils/money/format';
import { Operations } from '@youzan/react-components';
import CommonLink from 'components/common-link';
import { COURSE_STATUS_LIST } from 'pages/edu-admin/course-summary/domain/constants';
import { formatConsumeNumber } from '@ability-center/edu-admin/signin';

import type { IEasyGridColumn } from '@youzan/ebiz-components/es/types/easy-list';
import { IAssetSignSummaryDTO } from 'definitions/api/owl/pc/SignSummaryFacade/findAssetSignSummaryInfo';

type GridColumnsAlias = IEasyGridColumn<IAssetSignSummaryDTO>[];
interface IGetGridConfigParams {
  redirectToDetail(assetNo: string): void;
}
export const getGridConfig = (
  params: IGetGridConfigParams,
): GridColumnsAlias => {
  const { redirectToDetail } = params;
  const formatDateString = 'YYYY-MM-DD';
  const formatTimeString = 'HH:mm:ss';
  return [
    {
      title: '学员',
      width: '165px',
      fixed: 'left',
      forbidCustom: true,
      bodyRender(data) {
        return (
          <div className="course-summary__duoLine-cell">
            <p className="ellipsis">{data.studentName || '-'}</p>
            <p>
              {data.studentMobile
                ? String(data.studentMobile).replace(/(\d{3})(\d+)(\d{4})$/, '$1****$2')
                : '-'}
            </p>
          </div>
        );
      },
    },
    {
      name: 'courseName',
      title: '线下课',
      width: '160px',
      forbidCustom: true,
    },
    {
      name: 'eduCourseName',
      title: '适用课程',
      width: '160px',
      forbidCustom: true,
    },
    {
      title: '课程状态',
      width: '96px',
      bodyRender(data) {
        const courseStatus = Number(data.assetStatus);
        const curStateDesc = COURSE_STATUS_LIST.filter(
          (item) => Number(item.value) === courseStatus,
        );
        if (curStateDesc.length) {
          return curStateDesc[0].text;
        }
        return '-';
      },
    },
    {
      title: '班级',
      width: '160px',
      bodyRender(data) {
        const { classesList } = data;
        return (
          <div className="ellipsis-2">{classesList.length ? classesList.join('、') : '-'}</div>
        );
      },
    },
    {
      title: '上课消耗课时',
      width: '112px',
      bodyRender(data) {
        const { consumeSlaveNum, consumeNum } = data;
        const formattedConsumeNum = formatConsumeNumber(consumeNum + consumeSlaveNum);
        return (
          <div className="signin-list__duoLine-cell">
            <p className="ellipsis">{formattedConsumeNum}</p>
            {consumeSlaveNum !== 0 && (
              <p className="ellipsis description">(含赠送{formatConsumeNumber(consumeSlaveNum)})</p>
            )}
          </div>
        );
      },
    },
    {
      title: '上课消耗金额（元）',
      width: '160px',
      textAlign: 'right',
      bodyRender(data) {
        const { consumeTuition, consumeNum } = data;
        let isCourseAssets = consumeTuition !== undefined;
        if (consumeNum === -1) {
          // 如果是非课时资产
          isCourseAssets = consumeTuition > 0;
        }
        return isCourseAssets ? formatMoney(consumeTuition) : '-';
      },
    },
    {
      title: '手动扣减课时',
      width: '128px',
      bodyRender(data) {
        const { subSlaveNum, subNum } = data;
        const formattedSubNum = formatConsumeNumber(subNum + subSlaveNum);
        return (
          <div className="signin-list__duoLine-cell">
            <p className="ellipsis">{formattedSubNum}</p>
            {subSlaveNum !== 0 && (
              <p className="ellipsis description">(含赠送{formatConsumeNumber(subSlaveNum)})</p>
            )}
          </div>
        );
      },
    },
    {
      title: '手动扣减消耗金额（元）',
      width: '192px',
      textAlign: 'right',
      bodyRender(data) {
        const { subTuition, consumeNum } = data;
        let isCourseAssets = subTuition !== undefined;
        if (consumeNum === -1) {
          // 如果是非课时资产
          isCourseAssets = subTuition > 0;
        }
        return isCourseAssets ? formatMoney(subTuition) : '-';
      },
    },
    {
      title: '合计消耗课时',
      width: '160px',
      bodyRender(data) {
        const { consumeSlaveNum, consumeNum, subNum, subSlaveNum } = data;
        const summaryCourseConsumeNum = consumeNum + consumeSlaveNum + subNum + subSlaveNum;
        const hasSlaveNum = consumeSlaveNum !== 0 || subSlaveNum !== 0;
        return (
          <div className="signin-list__duoLine-cell">
            <p className="ellipsis">{formatConsumeNumber(summaryCourseConsumeNum)}</p>
            {hasSlaveNum && (
              <p className="ellipsis description">
                (含赠送{formatConsumeNumber(consumeSlaveNum + subSlaveNum)})
              </p>
            )}
          </div>
        );
      },
    },
    {
      title: '合计消耗金额（元）',
      width: '192px',
      textAlign: 'right',
      bodyRender(data) {
        const { consumeTuition, subTuition, consumeNum } = data;
        const totalTuition = consumeTuition + subTuition;
        if (consumeNum === -1) {
          // 如果是非课时资产
          return totalTuition || '-';
        }
        return formatMoney(totalTuition);
      },
    },
    {
      title: '课时总课时',
      name: 'totalNum',
      width: '112px',
      formatter: formatConsumeNumber,
    },
    {
      title: '课程总学费（元）',
      width: '176px',
      textAlign: 'right',
      bodyRender(data) {
        const { totalTuition, consumeNum } = data;
        let isCourseAssets = totalTuition !== undefined;
        if (consumeNum === -1) {
          // 如果是非课时资产
          isCourseAssets = totalTuition > 0;
        }
        return isCourseAssets ? formatMoney(totalTuition) : '-';
      },
    },
    {
      title: '课程实付金额（元）',
      width: '176px',
      textAlign: 'right',
      bodyRender(data) {
        const { totalRealPay, consumeNum } = data;
        let isCourseAssets = totalRealPay !== undefined;
        if (consumeNum === -1) {
          // 如果是非课时资产
          isCourseAssets = totalRealPay > 0;
        }
        return isCourseAssets ? formatMoney(totalRealPay) : '-';
      },
    },
    {
      title: '课程有效期',
      name: 'validity',
      width: '242px',
    },
    {
      title: '报名时间',
      width: '192px',
      bodyRender(data) {
        const { registerTime } = data;
        if (!registerTime) return '-';
        const date = format(registerTime, formatDateString);
        const time = format(registerTime, formatTimeString);
        return (
          <div>
            <div>{date}</div>
            <div>{time}</div>
          </div>
        );
      },
    },
    {
      title: '操作',
      width: '128px',
      textAlign: 'right',
      forbidCustom: true,
      bodyRender(data) {
        return (
          <Operations
            items={[
              <CommonLink key="view-detail" onClick={() => redirectToDetail(data.assetNo)}>
                查看明细
              </CommonLink>,
            ]}
          />
        );
      },
    },
  ];
};
