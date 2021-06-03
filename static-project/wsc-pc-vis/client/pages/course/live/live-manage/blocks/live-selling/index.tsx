import React from 'react';

import Dashboard from './components/dashboard';
import CouponPromotion from './components/coupon-promotion';
import GoodsPromotion from './components/goods-promotion';

import './style.scss';

interface ILiveSellingProps {
  alias: string;
}

const LiveSelling: React.FC<ILiveSellingProps> = ({ alias }) => {
  return (
    <div className="live-manage__liveSelling">
      <Dashboard liveAlias={alias}>
        {(liveRoomId) => (
          <>
            <CouponPromotion liveRoomId={liveRoomId} />
            <GoodsPromotion liveRoomId={liveRoomId} />
          </>
        )}
      </Dashboard>
    </div>
  );
};

export default LiveSelling;
