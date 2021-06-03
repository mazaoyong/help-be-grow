import React from 'react';
import { Tag } from 'zent';

export const courseStatus = ['已学完', '未开始', '进行中', '已退课'];
// [fontColor, borderColor, bgColor];

export const courseColors = [
  'grey', 'yellow', 'green', 'red',
];

export const selfCourseColors = [
  '#f2f3f5', '#fff5ed', '#f0faf2', '#ffebeb',
];

const StudentStatus = props => {
  const { type, style } = props;
  // 无状态不展示
  // if (type === 4) return null;
  const description = courseStatus[type - 1];
  const theme = courseColors[type - 1];
  const backgroundColor = selfCourseColors[type - 1];

  return (
    <Tag
      theme={theme}
      outline={true}
      style={{ lineHeight: '20px', padding: '0 6px', fontSize: '12px', backgroundColor, ...style }}
    >
      {description}
    </Tag>
  );
};

export default StudentStatus;
