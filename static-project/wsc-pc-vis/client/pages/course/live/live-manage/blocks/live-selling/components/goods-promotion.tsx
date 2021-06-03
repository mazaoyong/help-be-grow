import { Pop } from '@zent/compat';
import React from 'react';
import CommonLink from 'components/common-link';
import GoodsSelectorV2 from './goods-selector-v2';

import OrderModify from './order-modify';
import modifySerialNo from '../utils/modify-serial-no';
import { useGoodsListData } from '../hooks/use-live-selling-data';
import type { IGoodsImpl } from './goods-selector-v2';

interface IGoodsPromotionProps {
  liveRoomId: number;
}

const goodsExampleImg =
  'https://img.yzcdn.cn/public_files/0d34844f2069ccc540f7d88ed9b13320.png!middle.png';
const GoodsPromotion: React.FC<IGoodsPromotionProps> = (props) => {
  const { goodsList, loading, setData, deleteData } = useGoodsListData({
    liveRoomId: props.liveRoomId,
  });

  const moveHandleProxy = React.useCallback(
    (direction: 'up' | 'down') => {
      return (target: IGoodsImpl) =>
        setData(
          modifySerialNo({
            target,
            direction,
            originList: goodsList,
            predicate: { goodsId: target.goodsId },
          }),
          'modify'
        );
    },
    [goodsList, setData],
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
    (passiveGoodsList: any) => {
      setData(passiveGoodsList, 'add');
    },
    [setData],
  );

  return (
    <section className="content-box goods-promotion no-gap">
      <div className="header">
        <h1>商品推广</h1>
      </div>
      <section>
        <GoodsSelectorV2
          required
          loading={loading}
          goodsList={goodsList}
          label="选择商品："
          umpConfig={{ activityType: 10100 }}
          helpDesc={
            <div>
              用户可在直播间购买商品、报名课程。
              <Pop
                trigger="click"
                position="right-bottom"
                content={
                  <div className="img-example-container">
                    <img src={goodsExampleImg} alt="商品列表.png" />
                  </div>
                }
              >
                <CommonLink>查看示例</CommonLink>
              </Pop>
            </div>
          }
          onChange={handleChange}
          renderOperators={(couponData, gridPos) => (
            <OrderModify
              couponData={couponData}
              size={goodsList.length}
              currentIndex={gridPos.row}
              {...operatorHandler}
            />
          )}
        />
      </section>
    </section>
  );
};

export default GoodsPromotion;
