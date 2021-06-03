import { Pop } from '@zent/compat';
import React, { ReactNode } from 'react';
import { COURSE_STATUS, COURSE_COLORS } from './card-config';
import { ICardRenderProps } from '@youzan/ebiz-components/es/types/card-item';
import StudentStatus from '@ability-center/student/student-status';
import formatDate from '@youzan/utils/date/formatDate';
import Big from 'big.js';
import { IFormatedSignedCourseItem } from './types';

// 分转成元
const cent2yuan = (num: number): string => {
  return Big(Number(num))
    .div(100)
    .toFixed();
};

const renderConfig: ICardRenderProps<IFormatedSignedCourseItem> = {
  title: '',
  // 卡片标题 - 课程名称以及状态
  renderTitle: ({ eduCourseStudentDTO = {} }) => {
    const { course: { title }, eduCourseState } = eduCourseStudentDTO;
    return (<>
      <span style={{ marginRight: '8px' }}>{title}</span>
      <StudentStatus
        type={eduCourseState}
        customerStatus={COURSE_STATUS}
        customerColors={COURSE_COLORS}
      />
    </>);
  },
  // 卡片副标题 - 适用课程
  renderSubtitle: ({ eduCourseStudentDTO = {} }) => {
    const { eduCourse: { name } } = eduCourseStudentDTO;
    return `适用课程：${name || '-'}`;
  },
  // 内容区域
  contentGroup: [
    [
      {
        label: '课时',
        name: 'courseTimeDisplay',
        render: ({ eduCourseStudentDTO = {} }): ReactNode => {
          const { courseTime } = eduCourseStudentDTO;
          if (!courseTime) {
            return '-';
          }
          const { total, remaining, reward } = courseTime;
          const time = total ? [remaining, total].map(cent2yuan).join('/') : '';
          const present = reward ? '（含赠送' + cent2yuan(reward) + '课时）' : '';
          return `${time}${present}` || '-';
        }
      },
      {
        label: '有效期',
        name: 'eduCourseValidDescription',
        render: ({ eduCourseStudentDTO = {} }) => {
          const { eduCourseValidDescription } = eduCourseStudentDTO;
          return eduCourseValidDescription || '-';
        },
      },
      {
        label: '班级',
        name: 'classesDisplay',
        render: ({ eduCourseStudentDTO = {} }) => {
          const { relatedClassNames } = eduCourseStudentDTO;
          if (relatedClassNames.length) {
            const classes = relatedClassNames.join(',');
            // 如果只有一个课程的时候
            if (relatedClassNames.length === 1) {
              return classes;
            }
            return (
              <Pop trigger="hover" content={classes}>
                <span className="ellipsis-2">{classes}</span>
              </Pop>
            );
          }
          return '-';
        }
      }
    ],
    [
      {
        label: '报名时间',
        name: 'entrollmentTimeDisplay',
        render: ({ eduCourseOrderDTO = {} }) => {
          const { orderCreatedAt } = eduCourseOrderDTO;
          return orderCreatedAt ? '-' : formatDate(orderCreatedAt, 'YYYY-MM-DD HH:mm:ss');
        },
      },
      {
        label: '课程实付金额',
        name: 'actuallyPaidDisplay',
        render: ({ eduCourseOrderDTO = {} }) => {
          const { realPay } = eduCourseOrderDTO;
          if (realPay === undefined) {
            return '-';
          }
          return (
            <div>¥{cent2yuan(realPay)}</div>
          );
        }
      },
      {
        label: '已退',
        name: 'alredayRefundDisplay',
        render: ({ eduCourseOrderDTO = {}, eduCourseStudentDTO = {} }) => {
          const { itemSurplusRefundAmt, realPay } = eduCourseOrderDTO;
          const { assetNo, kdtId } = eduCourseStudentDTO;
          if (realPay === undefined) {
            return '-';
          }
          const haveRefund = Big(realPay).minus(itemSurplusRefundAmt).div(100).toFixed(2);

          if (!(realPay && Number(haveRefund))) {
            return '-';
          }
          return (
            <a
              href={'/v4/vis/edu/page/refund-record#/list?assetNo=' + assetNo + '&kdtId=' + kdtId}
              target="_blank"
              rel="noopener noreferrer"
            >
              ¥{haveRefund}
            </a>
          );
        }
      }
    ]
  ],
  // 操作区域
  operators: []
};

export default renderConfig;
