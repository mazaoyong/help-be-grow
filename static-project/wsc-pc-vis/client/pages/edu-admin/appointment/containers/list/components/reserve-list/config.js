import { Pop } from '@zent/compat';
import React from 'react';
import { ClampLines } from 'zent';
import { Link as SamLink } from '@youzan/sam-components';
// import ReserveAction from './ReserveAction';
// import formatDate from 'zan-utils/date/formatDate';
import {
  APPOINTMENT_STATUS_TYPE,
  COURSE_TYPE,
  RESERVE_SOURCE,
  PAGE_URL_MAP,
} from '../../../../constants';
import { isEduSingleStore, isEduBranchStore } from '@youzan/utils-shop';
// import ReserveLinkItem from './ReserveLinkItem';
// import ReservePopItem from './ReservePopItem';
import ReserveStatusItem from './ReserveStatusItem';
import RemarkItem from './RemarkItem';
import CourseTypeTag from '../../../../components/tag-course-type';
import { getDefaultText } from '../../../../utils';
import formatDate from 'zan-utils/date/formatDate';
import { arrayColumnWrapper, ShowWrapper } from 'fns/chain';
import { chainSupportHq, chainSupportSingle } from '../../../../chain';
import { clipOverflowPart } from 'fns/text/caculate';
import { navigateToEnrollment, EnrollmentSource } from '@ability-center/assets';
import VersionWrapper from 'fns/version';

export const getColumns = ctx => {
  return arrayColumnWrapper(VersionWrapper({
    name: 'appointment-list-show',
    children: [
      {
        title: '学员姓名',
        name: 'studentName',
        bodyRender: ({ studentId, studentName }) => {
          if (studentId) {
            return (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`${PAGE_URL_MAP.studentDetail}${studentId}`}
              >
                {getDefaultText(studentName)}
              </a>
            );
          }
        },
      },
      {
        title: '学员家长',
        name: 'customerName',
        bodyRender: ({ customerName }) => {
          return getDefaultText(customerName);
        },
      },
      {
        title: '手机号码',
        name: 'phoneNum',
        bodyRender: ({ phoneNo }) => {
          return getDefaultText(phoneNo);
        },
      },
      {
        title: '预约上课时间',
        name: 'start_time',
        needSort: true,
        bodyRender: ({ startTime }) => {
          return startTime > 0 ? formatDate(startTime, 'YYYY-MM-DD HH:mm:ss') : '-';
        },
      },
      {
        title: '状态',
        name: 'status',
        width: '80px',
        bodyRender: ({ studentLessonStatus }) => {
          return <ReserveStatusItem status={studentLessonStatus} />;
        },
      },
      {
        title: '线下课',
        name: 'courseName',
        nowrap: true,
        width: '160px',
        bodyRender: ({ courseName, courseType, courseAlias, kdtId }) => {
          const type = +courseType === 0 ? 'trial' : 'success';

          return (
            <div>
              <CourseTypeTag type={type} component={COURSE_TYPE[courseType]} />
              {!!courseAlias && (
                <Pop trigger="hover" className="reserve-pop-item" position="top-left" content={courseName}>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${PAGE_URL_MAP.serviceDetail}?alias=${courseAlias}&kdt_id=${kdtId}`}
                    className="ellipsis-line inline-block-vertical-middle"
                    style={{ marginLeft: '10px' }}
                  >
                    {courseName}
                  </a>
                </Pop>
              )}
            </div>
          );
        },
      },
      {
        title: '规格',
        width: '100px',
        bodyRender({ sku }) {
          if (sku) {
            const [isOverflow, clippedText] = clipOverflowPart(sku, 10);
            if (isOverflow) {
              return (
                <Pop trigger="hover" content={sku}>
                  {clippedText}
                </Pop>
              );
            }
            return clippedText;
          }
          return '-';
        },
      },
      {
        title: '课节内容',
        name: 'eduCourseName',
        bodyRender: ({ lessonContent }) => {
          return getDefaultText(lessonContent);
        },
      },
      {
        title: '上课地点',
        name: 'address',
        width: 180,
        bodyRender: ({ addressName }) => {
          return getDefaultText(addressName);
        },
        chainState: chainSupportSingle,
      },
      {
        title: '上课校区',
        name: 'shopName',
        width: 180,
        bodyRender: ({ shopName }) => {
          return getDefaultText(shopName);
        },
        chainState: chainSupportHq,
      },
      {
        title: '老师',
        name: 'teacherName',
        bodyRender: ({ teacherName }) => {
          return getDefaultText(teacherName);
        },
      },
      {
        title: '助教',
        name: 'assistantNames',
        bodyRender: ({ assistantNames }) => {
          return assistantNames && assistantNames.length !== 0 ? (
            <ClampLines
              className="reserve-grid-assistants"
              lines={1}
              text={assistantNames.join('、')}
            />
          ) : '-';
        },
      },
      {
        title: '来源',
        name: 'source',
        width: '80px',
        bodyRender: ({ origin }) => {
          return getDefaultText(RESERVE_SOURCE[origin]);
        },
      },
      {
        title: '预约人',
        name: 'originData',
        bodyRender: ({ originData, origin }) => {
          return (origin === 3 ? `${originData}（机构员工）` : originData) || '-';
        },
      },
      {
        title: '提交时间',
        name: 'createTime',
        bodyRender: ({ createTime }) => {
          return createTime ? formatDate(createTime, 'YYYY-MM-DD HH:mm:ss') : getDefaultText(createTime);
        },
      },
      {
        title: '备注',
        name: 'remark',
        bodyRender: ({ remark }) => {
          return <RemarkItem content={remark} />;
        },
      },
      {
        title: '操作',
        name: 'actions',
        width: 100,
        fixed: 'right',
        textAlign: 'right',
        nowrap: true,
        bodyRender: appointment => {
          const { studentLessonStatus } = appointment;
          if (studentLessonStatus === APPOINTMENT_STATUS_TYPE.TO_BE_CONFIRMED) {
            return (
              <div className="reserve-grid-operate">
                <SamLink
                  name="新建、修改、确认预约"
                  className="reserve-grid-operate__item"
                  onClick={() => ctx.confirmAppointment(appointment)}
                >
                  确认
                </SamLink>
                <SamLink
                  name="取消预约"
                  className="reserve-grid-operate__item"
                  onClick={() => ctx.cancelAppointment(appointment)}
                >
                  取消
                </SamLink>
                <ShowWrapper isInStoreCondition={isEduBranchStore || isEduSingleStore}>
                  <VersionWrapper name="appointment-list-action">
                    <SamLink
                      name="预约管理/办理报名"
                      className="reserve-grid-operate__item"
                      href={
                        navigateToEnrollment({
                          studentId: appointment.studentId,
                          source: EnrollmentSource.offline
                        })
                      }
                      target="_blank"
                    >
                      办理报名
                    </SamLink>
                  </VersionWrapper>
                </ShowWrapper>
              </div>
            );
          } else if (studentLessonStatus === APPOINTMENT_STATUS_TYPE.TO_BE_PERFORMED) {
            return (
              <div className="reserve-grid-operate">
                <VersionWrapper name="appointment-list-action" downgrade={{ from: appointment.courseType === 0 }}>
                  <SamLink className="reserve-grid-operate__item" onClick={() => ctx.signin(appointment)}>
                    签到
                  </SamLink>
                </VersionWrapper>
                <VersionWrapper name="appointment-list-action" downgrade={{ from: appointment.courseType === 0 }}>
                  <SamLink
                    name="新建、修改、确认预约"
                    className="reserve-grid-operate__item"
                    onClick={() => ctx.editAppointment(appointment)}
                  >
                    修改
                  </SamLink>
                </VersionWrapper>
                <SamLink
                  className="reserve-grid-operate__item"
                  onClick={() => ctx.cancelAppointment(appointment)}
                >
                  取消
                </SamLink>
                <ShowWrapper isInStoreCondition={isEduBranchStore || isEduSingleStore}>
                  <VersionWrapper name="appointment-list-action">
                    <SamLink
                      name="预约管理/办理报名"
                      className="reserve-grid-operate__item"
                      href={
                        navigateToEnrollment({
                          studentId: appointment.studentId,
                          source: EnrollmentSource.offline
                        })
                      }
                      target="_blank"
                    >
                      办理报名
                    </SamLink>
                  </VersionWrapper>
                </ShowWrapper>
              </div>
            );
          }
        },
      },
    ],
  }));
};
