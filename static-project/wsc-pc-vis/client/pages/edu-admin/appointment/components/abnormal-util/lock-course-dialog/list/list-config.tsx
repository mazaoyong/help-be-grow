import React, { ReactNode } from 'react';
import { format } from 'date-fns';
import { IEasyGridColumn } from '@youzan/ebiz-components/es/types/easy-list';

const wrapText : (text: string) => ReactNode = (text = '') => {
  if (text.length <= 10) {
    return <p>{text}</p>;
  } else {
    const firstP = text.slice(0, 10);
    const secondP = text.slice(10);
    return <>
      <p>{firstP}</p>
      <p>{secondP.length > 10 ? `${secondP.slice(0, 8)}..` : secondP}</p>
    </>;
  }
};

export const columns: (studentLessonNo: string) => IEasyGridColumn[] = (studentLessonNoOut) => {
  return [
    {
      title: '上课日期',
      name: 'start_time',
      width: '115px',
      bodyRender({ startTime, endTime }) {
        return (<>
          <p>{startTime ? format(startTime, 'YYYY-MM-DD') : '-'}</p>
          <p>{`${startTime ? format(startTime, 'HH:mm') : ''} - ${endTime ? format(endTime, 'HH:mm') : ''}`}</p>
        </>);
      },
      needSort: true,
    },
    {
      title: '课节名称',
      nowrap: true,
      bodyRender({ lessonName = '', lessonNo = '', kdtId }) {
        return <a href={`${_global.url.v4}/vis/edu/page/schedule#/detail?lessonNo=${lessonNo}&kdtId=${kdtId}`} target="_blank" rel="noopener noreferrer">{wrapText(lessonName)}</a>;
      },
    },
    {
      title: '教室',
      nowrap: true,
      bodyRender({ classroomName }) {
        return wrapText(classroomName || '-');
      },
    },
    {
      title: '老师',
      nowrap: true,
      bodyRender({ teacherName }) {
        return teacherName || '-';
      },
    },
    {
      title: '冻结课时',
      nowrap: true,
      textAlign: 'left',
      bodyRender({ lockNum = 0 }) {
        return !lockNum ? '-' : lockNum / 100;
      },
    },
    {
      title: '状态',
      textAlign: 'right',
      bodyRender({ studentLessonNo }) {
        return studentLessonNoOut === studentLessonNo ? '原预约日程无需移除' : '-';
      },
    },
  ];
};
