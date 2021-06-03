import { Pop } from '@zent/compat';
import React from 'react';
import { Notify, Icon } from 'zent';
import format from '@youzan/utils/money/format';

import { getDashboardData } from '../../../../../api/live-manage';

interface IDashboardValue {
  title: React.ReactNode;
  value: number | string;
}

export interface IUseDashboardRes {
  loading: boolean;
  liveRoomId: number;
  dashboardData: {
    isOpen: boolean;
    dashboardValues: IDashboardValue[];
  };
  setLoading: React.Dispatch<boolean>;
  refresh(): void;
}
const DASHBOARD_VALUES: IDashboardValue[] = [
  {
    title: (
      <div>
        <span>支付金额(元)</span>
        <Pop
          trigger="hover"
          content={
            <div style={{ width: '320px' }}>
              用户通过直播间购买商品的支付金额，若用户访问商品后，跳转其他商品并下单支付，也会一并计入
            </div>
          }
        >
          <Icon style={{ marginLeft: '8px', color: '#c8c9cc' }} type="help-circle" />
        </Pop>
      </div>
    ),
    value: 0,
  },
  { title: '支付订单数', value: 0 },
  { title: '商品浏览量', value: 0 },
  { title: '退款金额(元)', value: 0 },
  { title: '退款订单数', value: 0 },
];
const defaultDashboardData: IUseDashboardRes['dashboardData'] = {
  isOpen: false,
  dashboardValues: DASHBOARD_VALUES,
};
const useDashboardData = (liveAlias: string): IUseDashboardRes => {
  const [liveRoomId, setLiveRoomId] = React.useState(-1);
  const [loadingState, setLoading] = React.useState(false);
  const [dashboardData, setDashboardData] = React.useState(defaultDashboardData);

  const fetch = React.useCallback(() => {
    setLoading(true);
    getDashboardData(liveAlias)
      .then((data) => {
        const { switchStatus, statData, liveFlowId } = data;
        setDashboardData({
          isOpen: Boolean(switchStatus),
          dashboardValues: [
            { title: DASHBOARD_VALUES[0].title, value: formatMoney(statData.payAmount) },
            { title: DASHBOARD_VALUES[1].title, value: statData.payNum },
            { title: DASHBOARD_VALUES[2].title, value: statData.pageView },
            { title: DASHBOARD_VALUES[3].title, value: formatMoney(statData.refundAmount) },
            { title: DASHBOARD_VALUES[4].title, value: statData.refundNum },
          ],
        });
        setLiveRoomId(liveFlowId);
      })
      .catch((err) => {
        console.error(err);
        // 设置一个找不到直播间id的标志
        Notify.error('获取直播间信息出错');
        setLiveRoomId(-404);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [liveAlias]);

  React.useEffect(fetch, [fetch]);

  return { dashboardData, loading: loadingState, setLoading, liveRoomId, refresh: fetch };
};

export default useDashboardData;

function formatMoney(value: any) {
  return format(value, true, false);
}
