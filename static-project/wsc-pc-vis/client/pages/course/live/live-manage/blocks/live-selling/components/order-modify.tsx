import React from 'react';
import { Operations } from '@youzan/react-components';
import CommonLink from 'components/common-link';
import { EasyList } from '@youzan/ebiz-components';

interface IOrderModifyProps<CouponData = any> {
  size: number;
  currentIndex: number;
  couponData: CouponData;
  onMoveUp(data: CouponData): void;
  onMoveDown(data: CouponData): void;
  onDelete(data: CouponData): void;
}
type ActionType = 'moveUp' | 'moveDown' | 'delete';
type FuncType = () => void;

const { GridPop } = EasyList;
const OrderModify: React.FC<IOrderModifyProps> = (props) => {
  const { size, currentIndex, couponData, onMoveDown, onMoveUp, onDelete } = props;
  const forbidMoveUp = React.useMemo(() => currentIndex === 0, [currentIndex]);
  const forbidMoveDown = React.useMemo(() => currentIndex === size - 1, [currentIndex, size]);

  const bindDataOperators = React.useMemo<Record<ActionType, FuncType>>(
    () => ({
      moveUp() {
        onMoveUp(couponData);
      },
      moveDown() {
        onMoveDown(couponData);
      },
      delete() {
        onDelete(couponData);
      },
    }),
    [couponData, onDelete, onMoveDown, onMoveUp],
  );

  return (
    <Operations
      items={[
        <CommonLink key="moveup" disabled={forbidMoveUp} onClick={bindDataOperators.moveUp}>
          上移
        </CommonLink>,
        <CommonLink key="movedown" disabled={forbidMoveDown} onClick={bindDataOperators.moveDown}>
          下移
        </CommonLink>,
        <GridPop
          key="delete"
          text="删除"
          trigger="click"
          content="是否删除？"
          position="top-right"
          onConfirm={bindDataOperators.delete}
        />,
      ]}
    />
  );
};

export default OrderModify;
