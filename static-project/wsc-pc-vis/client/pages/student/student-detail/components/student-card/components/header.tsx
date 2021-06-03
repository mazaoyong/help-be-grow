import React, { FC } from 'react';
import { Icon } from '@youzan/ebiz-components';

import { IStudentHeaderProps, GenderEnums } from '../types';

const Header: FC<IStudentHeaderProps | null> = props => {
  const { studentName, studentPhone, studentGender, studentAvatar } = props;

  return (
    <div className="student-card__header">
      <div className="student-card__header-avatar">
        <img src={studentAvatar} alt="学员头像" />
      </div>
      <div className="student-card__header-content">
        <div className="content-line primary">
          <span>{studentName}</span>
          <span className="gender">
            {Number(studentGender) === GenderEnums.MALE ? (
              <Icon type="boy" color="#57A9FA" size="24px" />
            ) : (
              <Icon type="girl" color="#DF64AC" size="24px" />
            )}
          </span>
        </div>
        <div className="content-line">{studentPhone}</div>
      </div>
    </div>
  );
};

export default Header;
