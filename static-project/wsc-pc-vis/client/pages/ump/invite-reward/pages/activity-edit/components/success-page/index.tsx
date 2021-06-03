import React, { FC } from 'react';
import { Link } from 'react-router';
import { Button, Icon } from 'zent';
import { ActivityPromotion } from '../../../../components/activity-promotion';

import './style.scss';

interface SuccessPageProps {
  alias: string;
  action?: string;
  title: string;
}

export const SuccessPage: FC<SuccessPageProps> = ({ title, alias, action = '新建' }) => {
  return (
    <div className="activity-success-page">
      <img className="success-icon" src="https://b.yzcdn.cn/public_files/5e45d9271c1e796411253a896e3c82b8.png" />
      <h1 className="success-info">转介绍活动{action}成功</h1>
      <p className="promotion-desc">立即推广活动，获得更多新学员</p>
      <div className="promotion-option">
        <ActivityPromotion title={title} alias={alias}>
          <Icon style={{ color: '#f5a623', fontSize: 20, position: 'relative', top: 2 }} type="qrcode" />活动推广
        </ActivityPromotion>
      </div>
      <div className="activity-option">
        <Link to="list"><Button type="primary">返回活动列表</Button></Link>
      </div>
    </div>
  );
};
