import React from 'react';
import { BlockLoading, Notify } from 'zent';
import CommonLink from 'components/common-link';

import { useDashboardData } from '../hooks/use-live-selling-data';
import { toggleLiveSelling } from '../../../../api/live-manage';

interface ICouponPromotionProps {
  liveAlias: string;
  children(liveRoomId: number): React.ReactNode;
}
const openStateTextList = ['停用', '启用'];
const NoteSuccess = (curState: number) =>
  Notify.success(`${openStateTextList[curState]}直播卖货成功`);
const CouponPromotion: React.FC<ICouponPromotionProps> = (props) => {
  const { liveAlias, children } = props;
  const { dashboardData, loading, setLoading, liveRoomId, refresh } = useDashboardData(liveAlias);
  const { isOpen, dashboardValues } = dashboardData;

  const handleToggleSetting = React.useCallback(
    (evt: React.MouseEvent<HTMLAnchorElement>) => {
      evt.stopPropagation();
      evt.preventDefault();
      const curState = Number(!isOpen);
      setLoading(true);
      toggleLiveSelling({ liveFlowId: liveRoomId, switchStatus: curState })
        .then(NoteSuccess.bind(null, curState))
        .then(refresh)
        .catch(Notify.error)
        .finally(setLoading.bind(null, false));
    },
    [isOpen, liveRoomId, refresh, setLoading],
  );

  const openStateIdx = React.useMemo(() => Number(isOpen), [isOpen]);

  return (
    <>
      <section className="content-box dashboard">
        <div className="header">
          <div className="partial">
            <h1 className="subtitle">直播卖货</h1>
            <div className="action-box description">
              <span>已{openStateTextList[openStateIdx]}</span>
              <CommonLink onClick={handleToggleSetting} className="action">
                {openStateTextList[1 ^ openStateIdx]}
              </CommonLink>
            </div>
          </div>
          <div className="partial description">
            {liveRoomId > 0 && (
              <CommonLink
                className="order-link"
                url={`/v4/trade/order/index#/?live_room_id=${liveRoomId}`}
              >
                查看订单列表
              </CommonLink>
            )}
          </div>
        </div>
        <section>
          <BlockLoading loading={loading}>
            <div className="dashboard__cell-box">
              {dashboardValues.map((item, index) => (
                <div className="dashboard__cell-box__cell" key={index}>
                  <div className="title">{item.title}</div>
                  <div className="value">{item.value}</div>
                </div>
              ))}
            </div>
          </BlockLoading>
        </section>
      </section>
      <BlockLoading className="content-box suspense" loading={liveRoomId === -1}>
        {liveRoomId > 0 && children(liveRoomId)}
      </BlockLoading>
    </>
  );
};

export default CouponPromotion;
