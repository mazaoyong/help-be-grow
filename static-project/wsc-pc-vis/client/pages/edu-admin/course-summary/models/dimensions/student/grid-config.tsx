import React from 'react';
import formatMoney from '@youzan/utils/money/format';
import { Operations } from '@youzan/react-components';
import CommonLink from 'components/common-link';
import { formatConsumeNumber } from '@ability-center/edu-admin/signin';

import type { IEasyGridColumn } from '@youzan/ebiz-components/es/types/easy-list';
import { IStudentSignSummaryDTO } from 'definitions/api/owl/pc/SignSummaryFacade/findStudentSignSummaryInfo';

type GridColumnsAlias = IEasyGridColumn<IStudentSignSummaryDTO>[];
interface IGetGridConfigParam {
  redirectToDetail(studentId: number): void;
}
export const getGridConfig = (params: IGetGridConfigParam): GridColumnsAlias => {
  const { redirectToDetail } = params;
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
      title: '上课消耗课时',
      width: '160px',
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
      width: '192px',
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
      width: '160px',
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
      width: '240px',
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
      title: '学员总课时',
      name: 'totalNum',
      width: '160px',
      headerHelp: '当前筛选结果下，学员报名的按课时销售的课程的总购买课时',
      formatter: formatConsumeNumber,
    },
    {
      title: '学员总学费（元）',
      width: '192px',
      textAlign: 'right',
      headerHelp: '学员报名的课程的总学费合计，表头显示字段解释',
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
      title: '操作',
      width: '128px',
      textAlign: 'right',
      forbidCustom: true,
      bodyRender(data) {
        return (
          <Operations
            items={[
              <CommonLink
                key="view-detail"
                onClick={() => redirectToDetail(data.studentId)}
              >
                查看明细
              </CommonLink>,
            ]}
          />
        );
      },
    },
  ];
};
