import React, { FC } from 'react';
import { Link as SamLink, checkAccess } from '@youzan/sam-components';
import style from './style.m.scss';
import { isEduBranchStore } from '@youzan/utils-shop';
import { Notify } from 'zent';

interface IInfoTipProps {
  onRefresh?: () => void;
  children?: (data: { openAddPage: () => void }) => React.ReactElement;
}

const InfoTip: FC<IInfoTipProps> = ({ onRefresh, children }) => {
  const openAddPage = () => {
    if (checkAccess('添加资料项')) {
      window.open(`${_global.url.v4}/vis/edu/settings/student-profile#/list`);
    } else {
      Notify.error('没有权限，请联系管理员');
    }
  };
  if (isEduBranchStore) {
    return null;
  }

  if (children) {
    return children({ openAddPage });
  }

  return (
    <div className={'infoTip ' + style.infoTip}>
      <div className={style.infoLeft}>没有想要的资料项？</div>
      <div className={style.infoRight}>
        <SamLink className={style.infoAddLink + ' cursor-link'} onClick={openAddPage}>
          去添加
        </SamLink>
        {onRefresh && (
          <SamLink onClick={onRefresh} className="cursor-link">
            刷新
          </SamLink>
        )}
      </div>
    </div>
  );
};

export default InfoTip;
