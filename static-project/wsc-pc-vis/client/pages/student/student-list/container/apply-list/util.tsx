import React, { ReactNode } from 'react';
import { Avatar } from 'zent';
import { StudentDetailLink, defaultAvatar } from '@ability-center/student';
import { Link as SamLink } from '@youzan/sam-components';
import { PopEllipsisText } from '@youzan/ebiz-components';
import { navigateToAdjustCourse } from '@ability-center/assets/adjustcourse';
import cent2yuan from 'fns/currency/cent2yuan';
import formatDate from '@youzan/utils/date/formatDate';
import { isInStoreCondition } from 'fns/chain';

import { IStudentListItem } from './types';

interface IStudentBodyRender extends Record<string, any> {
  bodyRender?(rowData: IStudentListItem): ReactNode;
  title: ReactNode;
}

const courseSellTypeLabel = {
  '0': '自定义',
  '1': '按课时',
  '2': '按时段',
  '3': '按期',
};

const courseStatusLabel = {
  '1': '已学完',
  '2': '未开始',
  '3': '进行中',
  '4': '已退课',
};

const enrollmentTypeLabel = {
  '1': '新报',
  '2': '转课',
  // '3': '续费'
};

function PresentLabel({ value }) {
  if (!value) return null;
  return <p className="present-label">(含赠送{value})</p>;
}

function getStudentColumns(changeEduClass, showOperate): IStudentBodyRender[] {
  const studentColumns: IStudentBodyRender[] = [
    {
      title: '学员姓名',
      width: '280px',
      fixed: 'left',
      bodyRender: ({ name, mobile, userId, studentNo, gender, avatar }) => {
        const studentGender = gender || 0;
        return (
          <div className="student-detail">
            <Avatar src={avatar || defaultAvatar[studentGender]} className="avatar" size={48} />
            <div className="student-detail__info">
              <StudentDetailLink studentId={userId} params={{ studentNo: studentNo }}>
                <PopEllipsisText text={name} count={8} />
              </StudentDetailLink>
              <div style={{ display: 'flex' }}>
                <span className="student-detail__mobile">
                  手机尾号{String(mobile).substr(-4) || '-'}
                </span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: '线下课',
      width: 150,
      bodyRender: ({ courseName }) => {
        return courseName;
      },
    },
    {
      title: '适用课程',
      width: 150,
      bodyRender: ({ applyCourseName }) => {
        return applyCourseName;
      },
    },
    {
      title: '收费方式',
      width: 150,
      bodyRender: ({ courseSellType }) => {
        return courseSellTypeLabel['' + courseSellType] || '';
      },
    },
    {
      title: '课程状态',
      width: 120,
      bodyRender: ({ courseStatus }) => {
        return courseStatusLabel['' + courseStatus] || '';
      },
    },
    {
      title: '报名类型',
      width: 120,
      bodyRender: ({ enrollmentType }) => {
        return enrollmentTypeLabel['' + enrollmentType] || '';
      },
    },
    {
      title: '剩余数量',
      width: 120,
      bodyRender: ({ remainingValue, remainingPresentValue }) => {
        return (
          <div>
            <span>{remainingValue}</span>
            <PresentLabel value={remainingPresentValue}></PresentLabel>
          </div>
        );
      },
    },
    {
      title: '总数量',
      width: 120,
      bodyRender: ({ totalValue, totalPresentValue }) => {
        return (
          <div>
            <span>{totalValue}</span>
            <PresentLabel value={totalPresentValue}></PresentLabel>
          </div>
        );
      },
    },
    {
      title: '剩余学费(元)',
      width: 120,
      bodyRender: ({ remainingFee }) => {
        return '￥' + cent2yuan(remainingFee);
      },
    },
    {
      title: '总学费(元)',
      width: 120,
      bodyRender: ({ totalTuition }) => {
        return '￥' + cent2yuan(totalTuition);
      },
    },
    {
      title: '实付金额(元)',
      width: 120,
      bodyRender: ({ totalFee }) => {
        return '￥' + cent2yuan(totalFee);
      },
    },
    {
      title: '有效期',
      width: 100,
      bodyRender: ({ validity }) => {
        return validity;
      },
    },
    {
      title: '班级',
      width: 120,
      bodyRender: ({ classesList = [] }) => {
        return classesList.length > 0 ? classesList.join('、') : '-';
      },
    },
    {
      title: '报名时间',
      width: 120,
      bodyRender: ({ registerTime }) => {
        return formatDate(registerTime, 'YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: '最近上课时间',
      width: 120,
      bodyRender: ({ recentStudyTime }) => {
        return recentStudyTime ? formatDate(recentStudyTime, 'YYYY-MM-DD HH:mm:ss') : '-';
      },
    },
    {
      title: '课程顾问',
      width: 120,
      bodyRender: ({ sellerName }) => {
        return sellerName || '-';
      },
    },
    {
      title: '所属校区',
      hidden: !isInStoreCondition({ supportHqStore: true }),
      width: 200,
      bodyRender: ({ campusName }) => {
        return campusName || '-';
      },
    },
    {
      title: '操作',
      hidden: !showOperate,
      fixed: 'right',
      textAlign: 'right',
      width: 120,
      bodyRender: record => {
        const showAdjust = record.isTransferCourse;
        const showChangeClass = record.shiftClass;
        return (
          <>
            {showChangeClass && (
              <SamLink
                className="ui-link--split detail-student-operate__link"
                onClick={() => changeEduClass(record)}
              >
                调班
              </SamLink>
            )}
            {showAdjust && (
              <SamLink
                name="转课"
                className="ui-link--split detail-student-operate__link"
                href={navigateToAdjustCourse({
                  studentIds: '' + record.userId,
                  kdtId: _global.kdtId,
                  assetNos: '' + record.id,
                })}
                hide={true}
                target="_blank"
              >
                转课
              </SamLink>
            )}
          </>
        );
      },
    },
  ];
  return studentColumns.filter(item => !(item.hidden === true));
}

export default getStudentColumns;
