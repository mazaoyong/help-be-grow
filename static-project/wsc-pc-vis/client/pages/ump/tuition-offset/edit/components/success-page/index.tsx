import React, { FC, useState, useEffect, useContext } from 'react';
import { Button, Icon, Notify } from 'zent';
import CommonLink from 'components/common-link';
import EventPromition from '../../../components/event-promotion';
import { Context } from '../../context';
import { getTuitionOffsetBaseStats } from '../../../api/edit';

import './styles.scss';

interface SuccessPageProps {
  alias?: string;
  action?: string;
}

const SuccessPage: FC<SuccessPageProps> = ({ alias, action = '新建' }) => {
  const { state } = useContext(Context);
  const [eventAlias, setEventAlias] = useState(alias);

  useEffect(() => {
    if (!alias || state.editType === 'copy') {
      getTuitionOffsetBaseStats({ query: { activityId: Number(state.id) } })
        .then(res => {
          setEventAlias(res.alias);
        })
        .catch(e => {
          Notify.error(e || '获取活动基本信息失败，请关闭重试');
        });
    }
  }, [alias, state.id, state.editType]);

  return (
    <div className="success-page">
      <img className="success-icon" src="//b.yzcdn.cn/public_files/3c0e888971ca7544148d143d129ac8bf.svg" alt="success" />
      <h1 className="success-info">攒学费活动{action}成功</h1>
      <p className="promotion-desc">立即推广活动，获得更多客户与订单</p>
      <div className="promotion-option">
        <EventPromition id={Number(state.id)} alias={eventAlias}>
          <Button type="primary">
            <Icon type="share" className="share" />
            <span>立即推广</span>
          </Button>
        </EventPromition>
      </div>
      <div className="activity-option">
        <CommonLink
          // 同页面的跳转，用query来确保重新加载而不是route跳转，保证表单状态重置
          url={`${_global.url.v4}/vis/ump/tuition-offset?t=${Date.now()}#/add`}
          target="_self"
        >
          继续新建活动
        </CommonLink>
        <CommonLink
          url={`${window._global.url.v4}/vis/ump/tuition-offset#/list`}
          target="_self"
        >
          返回活动列表
        </CommonLink>
      </div>
    </div>
  );
};

export default SuccessPage;
