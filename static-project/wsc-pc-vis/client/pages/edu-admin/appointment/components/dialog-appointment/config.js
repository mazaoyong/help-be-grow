import React from 'react';
import { Radio } from 'zent';
import { getDefaultText } from '../../utils';

const getCourseTableColumns = ctx => {
  return [
    {
      title: '上课时间',
      name: 'lessonTime',
      width: '30%',
      bodyRender: ({ lessonTime, lessonNo }) => {
        return <Radio value={lessonNo}>{getDefaultText(lessonTime)}</Radio>;
      },
    },
    {
      title: '课节名称',
      name: 'eduCourseName',
      width: '20%',
      bodyRender: ({ eduCourseName, lessonName }) => {
        return getDefaultText(lessonName || eduCourseName);
      },
    },
    {
      title: '上课教室',
      name: 'classroomName',
      width: '20%',
      bodyRender: ({ classroomName }) => {
        return getDefaultText(classroomName);
      },
    },
    {
      title: '老师',
      name: 'teacherName',
      bodyRender: ({ teacherName }) => {
        return getDefaultText(teacherName);
      },
    },
    {
      title: '剩余名额',
      name: 'appointNumLeft',
      textAlign: 'right',
      bodyRender: ({ appointNumLeft, appointRule }) => {
        return +appointRule === 0 ? '-' : getDefaultText(appointNumLeft);
      },
    },
  ];
};

export { getCourseTableColumns };
