import { getDefaultText } from '../../../utils';

const getColumns = ctx => {
  return [
    {
      title: '上课时间',
      name: 'lessonTime',
      bodyRender: ({ lessonTime }) => {
        return getDefaultText(lessonTime);
      },
    },
    {
      title: '课节名称',
      name: 'lessonName',
      bodyRender: ({ lessonName }) => {
        return lessonName;
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
      title: '实到/应到',
      name: 'studentName',
      bodyRender: ({ lessonCase }) => {
        const { hadCheckInNum = 0, shouldSignInNum = 0 } = lessonCase || {};
        return `${hadCheckInNum}/${shouldSignInNum}`;
      },
    },
  ];
};

export { getColumns };
