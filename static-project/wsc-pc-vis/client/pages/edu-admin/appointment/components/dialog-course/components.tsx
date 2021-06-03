import { Pop } from '@zent/compat';
import React, { FC } from 'react';
import {
  styleNamePrefix,
} from './constants';
import { ScheduleNewDialog } from '../../../../new-dialogs';
import { Button, IGridColumn, Radio, Tag } from 'zent';
import { IDialogFooterProps } from './types';
import { isEduChainStore } from '@youzan/utils-shop';
import { AbnormalCodePop } from '@ability-center/appointment/abnormal-util';
import get from 'lodash/get';
import VersionWrapper from 'fns/version';

// 打开日程编辑对话框
const openEditScheduleDialog = (rowData, afterSaveSucceed = () => {}) => {
  const { eduCourseId, lessonNo, teacherName, kdtId, isTrial } = rowData;
  ScheduleNewDialog.open('编辑日程', {
    operateType: 2,
    lessonNo,
    kdtId,
    afterSaveSucceed,
    query: {
      eduCourseId,
      teacherName,
    },
    isTry: isTrial === 1,
  });
};

export const EmptyLabel: FC<{ courseType: number }> = ({ courseType }) => {
  return (
    <div className={`${styleNamePrefix}__table-empty`}>
      <span>暂无排课，可以切换其他日期或</span>
      <a
        href="javascript:;"
        onClick={() => {
          ScheduleNewDialog.open('新建日程', { isTry: courseType === 0 });
        }}
      >
        新建日程
      </a>
    </div>
  );
};

export const wrapperWithPop = fn => {
  return data => {
    const comp = fn(data);
    return (
      <Pop trigger="hover" content={comp}>
        <div className="appointment-grid-text">{comp}</div>
      </Pop>
    );
  };
};

export const Footer: FC<IDialogFooterProps> = ({ onClose, onConfirm }) => {
  return (
    <div>
      <Button onClick={onClose}>取消</Button>
      <Button type="primary" onClick={onConfirm}>
        确定
      </Button>
    </div>
  );
};

export const ColumnLesson: FC<{data: any}> = ({ data }) => {
  return (
    <>
      <VersionWrapper name="appointment-chooselesson-showtry">
        {
          data.isTrial ? (
            <Tag
              style={{
                borderColor: '#ed6a0c',
                backgroundColor: '#fff5ed',
                color: '#ed6a0c',
                marginRight: '4px',
              }}
            >
              试听
            </Tag>
          ) : null
        }
      </VersionWrapper>
      { data.lessonName || '-' }
    </>
  );
};

export const columns:
(studentId: number, refresh: Function, studentLessonNo: string, isEdit: boolean) => Array<IGridColumn> =
(studentId, refresh = () => {}, studentLessonNo, isEdit) => {
  const array: IGridColumn[] = [
    {
      title: '',
      width: '44px',
      fixed: 'left',
      bodyRender: (data) => {
        const checkCode = get(data, 'state.check.checkCode', 0);
        return (
          <Radio
            value={data}
            disabled={
              checkCode !== 0
            }
          />
        );
      },
    },
    {
      title: '上课时间',
      width: '120px',
      bodyRender: (data: any) => {
        return data.lessonTime || '-';
      },
    },
    {
      title: '课节',
      width: '120px',
      bodyRender: wrapperWithPop((data: any) => {
        return (
          <ColumnLesson data={data} />
        );
      }),
    },
    {
      title: '班级',
      width: '120px',
      bodyRender: wrapperWithPop((data: any) => {
        return data.className || '-';
      }),
    },
    {
      title: '课程',
      width: '120px',
      bodyRender: wrapperWithPop((data: any) => {
        return data.eduCourseName || '-';
      }),
    },
    {
      title: isEduChainStore ? '上课校区' : '上课地点',
      width: '120px',
      bodyRender: wrapperWithPop((data: any) => {
        return (isEduChainStore ? data.shopName : data.addressName) || '-';
      }),
    },
    {
      title: '教室',
      width: '120px',
      bodyRender: wrapperWithPop((data: any) => {
        return data.classroomName || '-';
      }),
    },
    {
      title: '消耗课时',
      width: '80px',
      bodyRender: (data: any) => {
        return data.consumeNum ? data.consumeNum / 100 : '-';
      },
    },
    {
      title: '剩余名额',
      width: '80px',
      bodyRender: (data: any) => {
        // 班课不显示0
        return data.appointRule !== 1 ? '-' : data.appointNumLeft;
      },
    },
    VersionWrapper({
      name: 'appointment-chooselesson-list-fixed',
      children: {
        title: '状态',
        width: '120px',
        bodyRender: (data : any) => {
          const { state = {}, kdtId } = data || {};
          return <AbnormalCodePop
            student={{ id: studentId }}
            joinState={state}
            kdtId={kdtId}
            onConfirm={refresh}
            studentLessonNo={studentLessonNo}
            isEdit={isEdit}
            onNumberChange={() => openEditScheduleDialog(data, () => refresh())}/>;
        },
        fixed: 'right',
      },
    }),
  ];
  const VersionColumns = VersionWrapper({
    name: 'appointment-chooselesson-hiddencolumn',
    children: array,
  });
  return VersionColumns;
};
