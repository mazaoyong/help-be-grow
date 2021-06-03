import React, { FC } from 'react';
import CommonLink, { IBaseCommonLinkProps } from 'components/common-link';
import getStudentDetailUrl from '../../../pages/student/student-detail/utils/get-student-detail-url';

interface IStudentDetailLink extends IBaseCommonLinkProps {
  studentId: number | string;
  params?: Record<string, any>;
}

const StudentDetailLink: FC<IStudentDetailLink> = (props) => {
  const { studentId, params = {}, ...passiveProps } = props;

  return (
    <CommonLink
      {...passiveProps}
      url={getStudentDetailUrl({ studentId, params })}
      target={String(studentId)}
    >
      {props.children}
    </CommonLink>
  );
};

export default StudentDetailLink;
export { getStudentDetailUrl };
