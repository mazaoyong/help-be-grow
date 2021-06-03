import { Pop } from '@zent/compat';
import React from 'react';
import { getDefaultText } from '../../../utils';
import { PAGE_URL } from '../../../constants';
import { number } from '@youzan/utils';
import { Link as SamLink } from '@youzan/sam-components';
import { has } from 'lodash';
import { Icon } from 'zent';
import { navigateToAdjustCourse } from '@ability-center/assets/adjustcourse';

const getColumns = (ctx, showAdjustCourse) => {
  const columns = [
    {
      title: '学员',
      name: 'studentName',
      bodyRender: ({ student = {} }) => {
        return (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`${PAGE_URL.STUDENT_DETAIL}${student.id}`}
          >
            {getDefaultText(student.name)}
          </a>
        );
      }
    },
    {
      title: '手机号',
      name: 'mobile',
      bodyRender: ({ student = {}, customer = {} }) => {
        return getDefaultText(student.mobile || customer.mobile);
      }
    },
    {
      title: '已用课时',
      name: 'used',
      width: '12%',
      bodyRender: ({ courseTime = {} }) => {
        const used = getDefaultText((courseTime || {}).used);
        return used === '-' ? '-' : number.accDiv(used, 100);
      }
    },
    {
      title: <span>剩余课时<Pop trigger='hover' content={<>
        <p>剩余课时=购买课时+赠送课时-已用课时=可用课时+冻结课时</p>
        <p>如果有预约日程，则剩余课时包含预约冻结的课时。</p>
      </>}><Icon type='help-circle' style={{ color: '#A0A0A0' }} /></Pop></span>,
      name: 'remaining',
      width: '15%',
      bodyRender: ({ courseTime = {} }) => {
        const remaining = getDefaultText((courseTime || {}).remaining);

        return remaining === '-' ? '-' : number.accDiv(remaining, 100);
      }
    },
    {
      title: '课程有效期',
      name: 'eduCourseValidDescription',
      bodyRender: ({ eduCourseValidDescription }) => {
        return getDefaultText(eduCourseValidDescription);
      }
    }
  ];
  if (has(ctx.state, 'eduClassInfo.eduClass')) {
    columns.push({
      title: '操作',
      // name: 'operate',
      width: '18%',
      fixed: 'right',
      textAlign: 'right',
      bodyRender: (record = {}) => {
        const showAdjust = record.transferCourse;
        return (
          <>
            <SamLink
              className="ui-link--split detail-student-operate__link"
              onClick={() => ctx.changeEduClass(record)}
            >
              调班
            </SamLink>
            {showAdjust && showAdjustCourse &&
              <SamLink
                className="ui-link--split detail-student-operate__link"
                href={navigateToAdjustCourse({
                  studentIds: '' + record.student.id,
                  kdtId: record.eduClass.kdtId,
                  assetNos: '' + record.userAssert.assetNo
                })}
                hide={true}
                name='转课'
                target="_blank"
              >
                转课
              </SamLink>
            }
            <span
              className="ui-link--split detail-student-operate__link"
              onClick={() => {
                ctx.removeClassStu(record);
              }}
            >
              移除
            </span>
          </>
        );
      }
    });
  }
  return columns;
};

export { getColumns };
