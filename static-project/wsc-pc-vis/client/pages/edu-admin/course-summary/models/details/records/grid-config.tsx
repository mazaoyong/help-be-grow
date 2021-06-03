import React from 'react';
import { format } from 'date-fns';
import formatMoney from '@youzan/utils/money/format';
import { PopEllipsisText } from '@youzan/ebiz-components';
import { isInStoreCondition } from 'fns/chain';
import CommonLink from 'components/common-link';
import {
  SignInTag,
  formatConsumeNumber,
  openSignInHistoryDialog,
} from '@ability-center/edu-admin/signin';

import type { IUseRecordsDetailModelRes } from './types';
import type { IEasyGridColumn } from '@youzan/ebiz-components/es/types/easy-list/types/grid';

const formatDateString = 'YYYY-MM-DD HH:mm';
const formatSecDateString = formatDateString + ':ss';
const formatTimeString = 'HH:mm';
type PartGridConfig = IUseRecordsDetailModelRes['gridConfig'];
export const getGridColumnsConfig = (): IUseRecordsDetailModelRes['gridConfig'] => {
  // always display in front of columns config
  const frontAODColumns: PartGridConfig = [
    {
      title: '上课时间',
      width: '242px',
      forbidCustom: true,
      fixed: true,
      formatter: (data: any) =>
        `${format(data.lessonStartTime, formatDateString)}-${format(
          data.lessonEndTime,
          formatTimeString,
        )}`,
    },
  ];

  const endAODColumns: PartGridConfig = [
    {
      title: '签到状态',
      width: '100px',
      forbidCustom: true,
      bodyRender(data) {
        return (
          <div className="signin-state__container">
            <SignInTag state={data.signInStatus} />
            {data.withHistorySignIn && (
              <CommonLink
                justButton
                onClick={() =>
                  openSignInHistoryDialog({
                    targetKdtId: data.kdtId,
                    studentLessonNo: data.studentLessonNo,
                    studentName: data.studentName || '-',
                  })
                }
              >
                签到历史
              </CommonLink>
            )}
          </div>
        );
      },
    },
    {
      title: '消耗课时',
      width: '100px',
      forbidCustom: true,
      bodyRender(data) {
        const { consumeSlaveNum, consumeNum } = data;
        const formattedConsumeNum = formatConsumeNumber(consumeNum);
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
      title: '消耗金额（元）',
      width: '148px',
      forbidCustom: true,
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
      title: '签到人',
      width: '120px',
      forbidCustom: true,
      bodyRender(data) {
        const operator = data.operator || '-';
        return (
          <div className="signin-list__duoLine-cell">
            <p className="ellipsis" title={operator}>
              {operator}
            </p>
            {
              /** 如果是商家操作，则额外展示商家操作人信息 */ data.operatorType === 1 && (
                <p>{data.shopOperatorMobile || '-'}</p>
              )
            }
          </div>
        );
      },
    },
    {
      title: '签到时间',
      width: '224px',
      forbidCustom: true,
      formatter: (data) => format(data.signInTime, formatSecDateString),
    },
  ];

  // 连锁逻辑
  const chainSupportOnlyHq = isInStoreCondition({
    supportHqStore: true,
  });
  // 单店逻辑
  const chainSupportOnlySingle = isInStoreCondition({
    supportSingleStore: true,
  });
  // 消耗课时地点的key
  // prettier-ignore
  const courseConsumePosName = /** 如果是教育单店 */ chainSupportOnlySingle
    ? 'addressName'
    : /** 如果是连锁总部 */ chainSupportOnlyHq
      ? 'shopName'
      : null;
  // 单店或者是总部显示内容，否则不显示
  const courseConsumeDisplay = chainSupportOnlyHq || chainSupportOnlySingle;
  const courseConsumeItem: IEasyGridColumn | null = courseConsumeDisplay
    ? {
      title: chainSupportOnlyHq ? '上课校区' : '上课地点',
      width: '224px',
      forbidCustom: true,
      bodyRender(data) {
        if (courseConsumePosName) {
          const shopName = data[courseConsumePosName];
          return <PopEllipsisText text={shopName} width={224} defaultText="-" />;
        }
        return '-';
      },
    }
    : null;
  // 可以控制显示隐藏的列
  const controllableColumns = ([
    {
      title: '课程名称',
      width: '128px',
      bodyRender(data) {
        return <div className="ellipsis-2">{data.courseName || '-'}</div>;
      },
    },
    {
      title: '课节名称',
      width: '128px',
      bodyRender(data) {
        return data.categoryName || '-';
      },
    },
    {
      title: '上课班级',
      width: '224px',
      bodyRender(data) {
        return data.className || '-';
      },
    },
    courseConsumeItem,
    {
      name: 'teacherName',
      title: '上课老师',
      width: '128px',
    },
    {
      title: '助教',
      width: '128px',
      bodyRender(data) {
        const assistants = data.assistantNames;
        if (Array.isArray(assistants)) {
          return <PopEllipsisText text={assistants.join('、') || '-'} count={6} defaultText="-" />;
        } else if (assistants) {
          return assistants;
        } else {
          return '-';
        }
      },
    },
  ] as (IEasyGridColumn | null)[]).filter((item) => item !== null) as PartGridConfig;

  return frontAODColumns.concat(controllableColumns, endAODColumns);
};
