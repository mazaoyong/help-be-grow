import React, { FC } from 'react';
import fullfillImage from '@youzan/utils/fullfillImage';
import './styles.scss';

interface IStudentInfoProps {
  avatar: string;
  name: string;
  time: string | undefined;
}

const StudentInfo: FC<IStudentInfoProps> = ({
  avatar,
  name,
  time,
}) => {
  return <div className="student-info-container">
    <img
      className="student-info-avatar"
      src={fullfillImage(avatar || 'https://b.yzcdn.cn/public_files/11970a8ab7d8d5955ce1d4c334ab462c.png', '!96x100.jpg')}
      alt={`${name}的头像`}
    />
    <span className="student-info-name"><b>{name}</b></span>
    <span className="student-info-submit-time">{time}</span>
  </div>;
};

export default StudentInfo;
