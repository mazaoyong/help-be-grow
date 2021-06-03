import { Pop } from '@zent/compat';
import React from 'react';
import { IGridColumn } from 'zent';
import get from 'lodash/get';
import { PopEllipsisText, Dialog } from '@youzan/ebiz-components';
import { Operations } from '@youzan/react-components';
import { ICombinedFilterConf, IEasyGridColumn } from '@youzan/ebiz-components/es/types/easy-list';
import date from '@youzan/utils/date';
import CommonLink from 'components/common-link';
import CustomDateRangePicker from './components/custom-time-range-picker';
import { RecordDetail } from '@ability-center/clue/record-detail';

const { formatDate, makeDateTimeStr, travel } = date;
const { openDialog } = Dialog;

export const curDateTime = makeDateTimeStr(new Date(), 'YYYY年MM月DD日 HH:mm:ss');

export const participantRankingColumns: IGridColumn[] = [
  {
    title: '名次',
    name: 'rankNo',
  },
  {
    title: '参与人',
    width: 140,
    bodyRender: ({ userId, userName, mobile }) => (
      <div className="participant">
        <CommonLink
          url={`${window._global.url.v4}/scrm/customer/manage#/detail?yzUid=${userId}`}
          target="_blank"
        >
          {userName}
        </CommonLink>
        <span>{mobile}</span>
      </div>
    ),
  },
  {
    title: '带来的浏览量',
    name: 'pv',
  },
  {
    title: '带来的浏览人数',
    name: 'uv',
  },
  {
    title: '带来参与活动人数',
    name: 'joinCnt',
  },
  {
    title: '获得的助力人数',
    name: 'helpCnt',
    textAlign: 'right',
  },
];

export const detailFilterConfig: ICombinedFilterConf[] = [
  {
    name: 'userKeyword',
    label: '参与人：',
    type: 'Input',
    inheritProps: {
      placeholder: '名称或手机号',
    },
  },
  {
    name: 'existOrder',
    label: '是否有订单：',
    type: 'Select',
    options: [
      { text: '全部', value: 'ALL_ORDER_TYPE' },
      { text: '是', value: '1' },
      { text: '否', value: '0' },
    ],
    inheritProps: {
      width: 96,
    },
    defaultValue: 'ALL_ORDER_TYPE',
  },
  {
    name: 'orderNo',
    label: '订单号：',
    type: 'Input',
    watch: {
      existOrder(existOrder, currentCtx, values) {
        currentCtx.set({
          value: existOrder === '0' ? '' : get(values, 'orderNo', ''),
          disabled: existOrder === '0',
          hidden: existOrder === '0', // todo: 组件有小问题，设置了hidden的话disabled会生效
        });
      },
    },
  },
  {
    name: 'joinTime',
    label: '活动参与时间：',
    type: 'Custom',
    renderField: CustomDateRangePicker,
    defaultValue: [
      formatDate(travel(-29), 'YYYY-MM-DD'),
      makeDateTimeStr(new Date(), 'YYYY-MM-DD'),
    ],
  },
];

const openViewInfoCollectDialog = (infoCollect: any[]) =>
  openDialog(RecordDetail, {
    title: '信息采集记录详情',
    mask: true,
    data: {
      attributes: infoCollect,
      scene: 'tuition-rewards',
    },
  });

interface IColumnsControl {
  enableInfoCollect?: boolean;
}
export const getDetailColumns = (columnsControl: IColumnsControl): IEasyGridColumn[] => {
  const { enableInfoCollect = false } = columnsControl;
  const infoCollectColumn: IEasyGridColumn = {
    title: '操作',
    textAlign: 'right',
    bodyRender(data) {
      const infoCollectData: any[] = data.collectInfo || [];
      const noInfoCollectData = infoCollectData.length === 0;
      return (
        <Operations
          items={[
            <Pop
              key="viewInfoCollection"
              className={noInfoCollectData ? '' : 'hide'}
              trigger="hover"
              content="未收集到学员信息采集数据"
            >
              <CommonLink
                justButton
                className="bg-transparent"
                disabled={noInfoCollectData}
                onClick={() => openViewInfoCollectDialog(infoCollectData)}
              >
                查看采集记录
              </CommonLink>
            </Pop>,
          ]}
        />
      );
    },
  };
  const baseColumns: IEasyGridColumn[] = [
    {
      title: '参与人',
      name: 'participant',
      width: 200,
      bodyRender({ userId, userName, mobile }) {
        if (userId === 9999999999999) {
          return '其他客户';
        }
        return (
          <CommonLink
            url={`${_global.url.v4}/scrm/customer/manage#/detail?yzUid=${userId}`}
            target="_blank"
          >
            <PopEllipsisText width={160} text={userName} />
            <span>{mobile || '-'}</span>
          </CommonLink>
        );
      },
    },
    {
      title: '攒到的学费(元)',
      name: 'amount',
      formatter(amount: number) {
        return (amount / 100.0).toFixed(2);
      },
    },
    {
      title: '订单号',
      width: 218,
      bodyRender({ orderNo }) {
        return orderNo ? (
          <CommonLink
            url={`${_global.url.v4}/trade/order/detail?orderNo=${orderNo}`}
            target="_blank"
          >
            {orderNo}
          </CommonLink>
        ) : (
          '-'
        );
      },
    },
    {
      title: '活动参与时间',
      textAlign: 'right',
      bodyRender: ({ joinTime }) => formatDate(joinTime, 'YYYY-MM-DD HH:mm:ss'),
    },
  ];

  return baseColumns.concat(enableInfoCollect ? infoCollectColumn : []);
};
