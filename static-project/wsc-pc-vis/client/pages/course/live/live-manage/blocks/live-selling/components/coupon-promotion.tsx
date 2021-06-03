import { Pop } from '@zent/compat';
import React from 'react';
import CommonLink from 'components/common-link';
import CouponSelector from './coupon-selector';

import OrderModify from './order-modify';
import modifySerialNo from '../utils/modify-serial-no';
import { useCouponListData } from '../hooks/use-live-selling-data';
import type { ICouponImpl } from './coupon-selector';

interface ICouponPromotionProps {
  liveRoomId: number;
}

const couponExampleImg =
  'https://img.yzcdn.cn/public_files/c4b4e5c9397a587a058d30e988e541f4.jpg!middle.jpg';
const CouponPromotion: React.FC<ICouponPromotionProps> = (props) => {
  const { couponList, loading, setData, deleteData } = useCouponListData({
    liveRoomId: props.liveRoomId,
  });

  const moveHandleProxy = React.useCallback(
    (direction: 'up' | 'down') => {
      return (target: ICouponImpl) =>
        setData(
          modifySerialNo({
            target,
            direction,
            originList: couponList,
            predicate: { couponId: target.couponId },
          }),
          'modify',
        );
    },
    [couponList, setData],
  );

  const operatorHandler = React.useMemo(
    () => ({
      onMoveUp: moveHandleProxy('up'),
      onMoveDown: moveHandleProxy('down'),
      onDelete: deleteData,
    }),
    [deleteData, moveHandleProxy],
  );

  const handleChange = React.useCallback(
    (passiveCouponList: any) => {
      setData(passiveCouponList, 'add');
    },
    [setData],
  );

  return (
    <section className="content-box coupon-promotion">
      <div className="header">
        <h1>优惠券推广</h1>
      </div>
      <section>
        <CouponSelector
          required
          loading={loading}
          label="选择优惠券："
          helpDesc={
            <div>
              最多添加 6 种优惠券，用户可在直播间领取，每个用户在同个直播间内限领 1 张。
              <Pop
                trigger="click"
                position="right-top"
                content={
                  <div className="img-example-container">
                    <img src={couponExampleImg} alt="优惠券列表.png" />
                  </div>
                }
              >
                <CommonLink>查看示例</CommonLink>
              </Pop>
            </div>
          }
          couponList={couponList}
          onChange={handleChange}
          renderOperators={(couponData, gridPos) => (
            <OrderModify
              couponData={couponData}
              size={couponList.length}
              currentIndex={gridPos.row}
              {...operatorHandler}
            />
          )}
        />
      </section>
    </section>
  );
};

export default CouponPromotion;
