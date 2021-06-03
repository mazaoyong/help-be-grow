import React, { FC, useMemo } from 'react';
import { Tag } from 'zent';
import { IStudentStatusProps } from './types';

const STUDENT_STATUS = ['在读', '结业', '试听', ''];
// [fontColor, borderColor, bgColor];
const STUDENT_STATUS_COLORS = [
  ['#66BE74', '#66BE74', '#F0FAF2'],
  ['#333333', '#C8C9CC', '#F2F3F5'],
  ['#F1924E', '#F1924E', '#FFF5ED'],
  ['#ffffff', '#FF6500', '#F0FAF2'],
];

const StudentStatus: FC<IStudentStatusProps> = props => {
  const { type, customerStatus, customerColors, style } = props;

  const description = (customerStatus || STUDENT_STATUS)[type - 1];

  const [color, borderColor, backgroundColor] = (customerColors || STUDENT_STATUS_COLORS)[type - 1] || [];

  const STYLES = useMemo(() => (Object.assign({}, {
    lineHeight: '20px',
    padding: '0 6px',
    fontSize: '12px',
    border: `1px solid ${borderColor}`,
    backgroundColor,
    color,
  }, style)), [backgroundColor, borderColor, color, style]);

  if (!description) {
    return null;
  }

  return <Tag style={STYLES}>{description}</Tag>;
};

export default StudentStatus;
