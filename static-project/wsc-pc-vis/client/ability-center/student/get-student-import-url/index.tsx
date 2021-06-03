import React, { CSSProperties, FC } from 'react';
import getStudentImportUrl from '../../../pages/student/student-import/utils/get-student-import-url';

interface IStudentImportProps {
  className?: string;
  style?: CSSProperties;
  target?: HTMLLinkElement['target'];
}

const StudentImportLink: FC<IStudentImportProps> = props => {
  const { className, style, target = '_blank' } = props;

  return (
    <a
      href={getStudentImportUrl()}
      className={className + ' cursor-link'}
      style={style}
      rel="noopener noreferrer"
      target={target}
    >
      {props.children}
    </a>
  );
};

export default StudentImportLink;
export { getStudentImportUrl };
