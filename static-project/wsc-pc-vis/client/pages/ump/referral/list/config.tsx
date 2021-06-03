import { Pop } from '@zent/compat';
import React from 'react';
import { Link } from 'react-router';
import { Operations } from '@youzan/react-components';
import { IEasyGridColumn, ICombinedFilterConf } from '@youzan/ebiz-components/es/types/easy-list';
import buildUrl from '@youzan/utils/url/buildUrl';
import { isBranchStore, isHqStore, isUnifiedPartnerStore } from '@youzan/utils-shop';
import formatDate from 'zan-utils/date/formatDate';
import fen2yuan from 'fns/fen2yuan';
import { arrayColumnWrapper } from 'fns/chain/index';
import { BRANCH_STORE_NAME } from 'constants/chain';
import HelpTitle from '../components/help-title';
import SchoolTD from '../components/field/SchoolTD';
import EventPromotion from '../components/event-promotion';
import { EventStatus } from '../types';
import { eventStatusMap, editPageTypeMap, DateFormat } from '../constants';

interface IEasyGridColumnForChain extends IEasyGridColumn {
  chainState?: boolean;
}

export const columnConfig: (obj: any) => IEasyGridColumn<any>[] = ({
  endReferralActive,
  onDeleteClick,
}) =>
  arrayColumnWrapper<IEasyGridColumnForChain>([
    {
      title: '活动名称',
      width: '208px',
      fixed: 'left',
      bodyRender: (item) => {
        const rawHref = `${window._global.url.wap}/goods/${item.itemAlias}`;
        return (
          <div className="ellipsis-2">
            <a
              href={buildUrl(rawHref, '', window._global.kdtId)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.name}
            </a>
          </div>
        );
      },
    },
    {
      title: `适用${BRANCH_STORE_NAME}`,
      name: 'campus',
      chainState: isHqStore,
      width: '160px',
      bodyRender: ({ name, designateType, designatedKdtIds }) => {
        return (
          <SchoolTD name={name} designateType={designateType} designatedKdtIds={designatedKdtIds} />
        );
      },
    },
    {
      title: '活动时间',
      bodyRender: (item) => {
        return (
          <span>
            {formatDate(item.startAt, DateFormat)}至 <br />
            {formatDate(item.endAt, DateFormat)}
          </span>
        );
      },
    },
    {
      title: '活动状态',
      width: '120px',
      bodyRender: ({ status }) => {
        return eventStatusMap[status] || '-';
      },
    },
    {
      title: '支付订单数',
      width: '120px',
      bodyRender: ({ orderNum }) => {
        return orderNum || 0;
      },
    },
    {
      title: '订单实付金额(元)',
      textAlign: 'right',
      width: '160px',
      bodyRender: ({ orderAmount }) => {
        return fen2yuan(orderAmount);
      },
    },
    {
      title: (
        <HelpTitle title="推广累计金额(元)" desc="推广累计金额=被推荐人折扣金额+推荐人分佣金额。" />
      ),
      textAlign: 'right',
      width: '180px',
      bodyRender: ({ referralAmount }) => {
        return fen2yuan(referralAmount);
      },
    },
    {
      title: <HelpTitle title="活动浏览次数" desc="推荐者分享的活动页面被浏览次数。" />,
      name: 'activityPv',
    },
    {
      title: <HelpTitle title="活动浏览人数" desc="浏览过推荐者分享的活动页面的人数。" />,
      name: 'activityUv',
    },
    {
      title: '操作',
      fixed: 'right',
      textAlign: 'right',
      bodyRender: (item) => {
        const { id, status, name, itemAlias } = item;
        const isDetail =
          isBranchStore || status === EventStatus.ENDED || status === EventStatus.INVALID;
        const url = `${window._global.url.wap}/goods/${itemAlias}`;

        const items = [
          {
            component: <Link to={`/stats/${id}`}>数据</Link>,
            show: status > EventStatus.NOT_STARTED && !isUnifiedPartnerStore,
          },
          {
            component: <EventPromotion url={url} id={id} name={name} />,
            show: status === EventStatus.PROCESS && !isUnifiedPartnerStore,
          },
          {
            component: <Link to={`/edit/${id}/${status}`}>{editPageTypeMap.edit}</Link>,
            show: !isDetail,
          },
          {
            component: <Link to={`/detail/${id}/${status}`}>{editPageTypeMap.detail}</Link>,
            show: isDetail,
          },
          {
            component: <Link to={`/copy/${id}/${status}`}>{editPageTypeMap.copy}</Link>,
            show: !isBranchStore && !isUnifiedPartnerStore,
          },
          {
            component: (
              <Pop
                trigger="click"
                position="left-center"
                content="确定删除此活动？"
                onConfirm={() => {
                  onDeleteClick(item.id);
                }}
                confirmText="删除"
              >
                <a>删除</a>
              </Pop>
            ),
            show: status !== EventStatus.PROCESS && !isBranchStore && !isUnifiedPartnerStore,
          },
          {
            component: (
              <Pop
                trigger="click"
                className="referral__invalidate-pop"
                position="top-right"
                content={(
                  <div className="content">
                    活动失效后，用户无法参与此活动，且将不会发放新的奖励，同时已发放的奖励也不会收回。确认失效此活动？
                  </div>
                )}
                onConfirm={() => {
                  endReferralActive(item.id);
                }}
                confirmText="确定"
              >
                <a>失效</a>
              </Pop>
            ),
            show: status === EventStatus.PROCESS && !isBranchStore && !isUnifiedPartnerStore,
          },
        ];

        return (
          <Operations items={items.filter((item) => item.show).map((item) => item.component)} />
        );
      },
    },
  ]);

export const filterConfig: ICombinedFilterConf[] = [
  {
    name: 'type',
    type: 'Select',
    options: [
      { text: '全部状态', value: '0' },
      { text: '未开始', value: '1' },
      { text: '进行中', value: '2' },
      { text: '已结束', value: '3' },
    ],
    defaultValue: '0',
  },
];
