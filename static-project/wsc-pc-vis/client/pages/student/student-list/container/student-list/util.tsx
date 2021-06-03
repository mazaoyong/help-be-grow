import { Pop } from '@zent/compat';
import React, { ReactNode } from 'react';
import { isInStoreCondition } from 'fns/chain';
import { Icon, Avatar } from 'zent';
import { Operations } from '@youzan/react-components';
import { number } from '@youzan/utils';
import { Link as SamLink } from '@youzan/sam-components';
import { PopEllipsisText } from '@youzan/ebiz-components';
import VersionWrapper from 'fns/version';

// ability-center
import { StudentDetailLink, defaultAvatar } from '@ability-center/student';
import { navigateToEnrollment, EnrollmentSource } from '@ability-center/assets';
import AppointmentDialog from '@ability-center/appointment/make-appointment';

import StudentStatus from '@ability-center/student/student-status';
import { IStudentListItem, StudentListCategory } from './types';

interface IGetStudentColsParams {
  category: StudentListCategory;
}

interface IStudentBodyRender extends Record<string, any> {
  bodyRender?(rowData: IStudentListItem): ReactNode;
  title: ReactNode;
}

const { open: openAppointmentDialog } = AppointmentDialog;

function getStudentColumns(params: IGetStudentColsParams): IStudentBodyRender[] {
  const { category } = params;
  return [
    {
      title: '学员姓名',
      fixed: true,
      width: '280px',
      bodyRender: ({ student = {}, studentState }) => {
        const { avatar, name = '', mobile = '', id = 0, studentNo, gender } = student;
        const { type = 1 } = studentState;
        const studentGender = gender || 0;
        return (
          <div className="student-detail">
            <Avatar src={avatar || defaultAvatar[studentGender]} className="avatar" size={48} />
            <div className="student-detail__info">
              <StudentDetailLink studentId={id} params={{ studentNo: studentNo }}>
                <PopEllipsisText text={name} count={8} />
              </StudentDetailLink>
              <div style={{ display: 'flex' }}>
                <span className="student-detail__mobile">
                  手机尾号{String(mobile).substr(-4) || '-'}
                </span>
                <StudentStatus style={{ marginTop: '.5rem', marginLeft: '.5rem' }} type={type} />
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: '家庭帐号',
      width: '200px',
      bodyRender: ({ familyMemberNames = [] }) => {
        const membersStr = familyMemberNames.join('、');
        return (
          <Pop trigger="hover" position="top-center" content={membersStr}>
            <div className="member-list">
              {familyMemberNames.map((curName, index) => {
                return (
                  <span key={`member-${index}`} className="member-item">
                    {curName}
                  </span>
                );
              })}
            </div>
          </Pop>
        );
      },
    },
    {
      title: (
        <div>
          <label>关注公众号</label>
          <Pop trigger="hover" content="学员绑定的家长中，已关注公众号人数和联系人总人数">
            <Icon type="help-circle" className="help-icon" />
          </Pop>
        </div>
      ),
      width: '116px',
      bodyRender: ({ hasSubMpCount = 0, familyMemberCount = 0, familyMpFansNames = [] }) => {
        const membersStr = familyMpFansNames.join('、');
        if (membersStr) {
          return (
            <Pop trigger="hover" position="top-center" content={membersStr}>
              <div className="member-count">{`${hasSubMpCount}/${familyMemberCount}`}</div>
            </Pop>
          );
        }
        return <div className="member-count">{`${hasSubMpCount}/${familyMemberCount}`}</div>;
      },
    },
    {
      title: (
        <div>
          <label>课时</label>
          <Pop trigger="hover" content="剩余课时/总课时">
            <Icon type="help-circle" className="help-icon" />
          </Pop>
        </div>
      ),
      width: '96px',
      bodyRender: ({ courseTime }) => {
        const { total = 0, remaining = 0 } = courseTime;
        // 如果总课时和剩余课时有一个为null说明数据有误，就直接返回没有数据的情况
        if (total === null || remaining === null) {
          return '-';
        }
        return (
          <div className="course-list">
            {number.accDiv(remaining, 100)}/{number.accDiv(total, 100)}
          </div>
        );
      },
    },
    {
      title: (
        <div>
          <label>有效期</label>
          <Pop trigger="hover" content="购买的所有线下课的有效期的最后一天">
            <Icon type="help-circle" className="help-icon" />
          </Pop>
        </div>
      ),
      width: '110px',
      name: 'eduCourseValidDescription',
    },
    {
      title: '最近上课时间',
      name: 'lastClassTime',
      needSort: !category,
      width: '200px',
      bodyRender: ({ student = {} }) => {
        const { lastClassTime } = student;
        return lastClassTime || '-';
      },
    },
    {
      title: '操作',
      fixed: 'right',
      textAlign: 'right',
      width: '165px',
      bodyRender: ({ student = {} }) => {
        const { id, name } = student;
        const operatorItems = [
          <SamLink
            key="appointment"
            className="student-grid-operate_item cursor-link-hover"
            onClick={() => openAppointmentDialog({
              defaultData: {
                studentId: id,
                studentName: name,
                fromStudent: true,
              },
            })}
          >
            预约上课
          </SamLink>,
        ];
        if (isInStoreCondition({ supportEduBranchStore: true, supportEduSingleStore: true })) {
          operatorItems.push(
            <SamLink
              key="enrollment"
              className="student-grid-operate_item cursor-link-hover"
              href={navigateToEnrollment({ studentId: id, source: EnrollmentSource.offline })}
              target="_blank"
            >
              办理报名
            </SamLink>,
          );
        }
        return (
          <VersionWrapper name="student-list-operators">
            <Operations items={operatorItems} />
          </VersionWrapper>
        );
      },
    },
  ];
}

export default getStudentColumns;
