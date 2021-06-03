import { React, FC } from '@youzan/tany-react';
import { Tag } from 'zent';
import CommonLink from 'components/common-link';
import './styles.scss';

interface IWorkbookStudentInfo {
  name: string;
  link: string;
  mobile: string;
  avatar: string;
  hasLeft: boolean;
}

const defaultAvatar = '//b.yzcdn.cn/public_files/c9583a445901bd9971ecc6c229fcc8a7.svg';

const WorkbookStudentInfo: FC<IWorkbookStudentInfo> = (props) => {
  const { name, link, mobile, avatar, hasLeft = false } = props;

  return (
    <div className="workbook-student__info">
      <img className="avatar" src={avatar || defaultAvatar} alt="" />
      <div className="detail">
        {link
          ? <CommonLink target="_blank" href={link}>
            <span title={name || '匿名用户'} className="ellipsis-2">{name || '匿名用户'}</span>
          </CommonLink>
          : <span>匿名用户</span>
        }
        <p className="mobile">{mobile || ''}</p>
        {hasLeft ? (
          <Tag
            style={{
              borderColor: '#C8C9CC',
              backgroundColor: '#D8D8D8',
            }}
          >
            已退出作业本
          </Tag>
        ) : null}
      </div>
    </div>
  );
};

export default WorkbookStudentInfo;
