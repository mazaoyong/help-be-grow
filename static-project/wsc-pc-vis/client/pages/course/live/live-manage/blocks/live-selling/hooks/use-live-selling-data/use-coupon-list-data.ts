import React from 'react';
import { Notify } from 'zent';

import { getCouponList, createCouponList, deleteCoupon } from '../../../../../api/live-manage';
import type { ICouponImpl } from '../../components/coupon-selector';
import type { IBaseAPIProps, IUseLiveSellingDataParams, SetDataType } from './types';

export interface IUseCouponListRes extends IBaseAPIProps<ICouponImpl> {
  couponList: ICouponImpl[];
}
const defaultCouponList: IUseCouponListRes['couponList'] = [];
const useCouponListData = (params: IUseLiveSellingDataParams): IUseCouponListRes => {
  const { liveRoomId } = params;
  const [loadingState, setLoading] = React.useState(false);
  const [couponList, setCouponList] = React.useState(defaultCouponList);

  const fetch = React.useCallback(() => {
    setLoading(true);
    getCouponList({ liveFlowId: liveRoomId, kdtId: _global.kdtId })
      .then((data) => {
        setCouponList(
          data.map((item) => ({
            couponAlias: item.alias,
            couponId: item.couponId,
            couponName: item.title,
            couponContent: item.preferentialCopywriting || '',
            available: item.status === 0,
          })),
        );
      })
      .catch(Notify.error)
      .finally(() => {
        setLoading(false);
      });
  }, [liveRoomId]);
  const handleChange = React.useCallback(
    (data: ICouponImpl[], type: SetDataType) => {
      setLoading(true);
      createCouponList({
        kdtId: _global.kdtId,
        liveFlowId: liveRoomId,
        couponList: data.map((item, serialNo) => ({
          id: item.couponId,
          serialNo,
        })),
      })
        .then((success) => {
          if (success) {
            Notify.success(`${type === 'add' ? '添加' : '修改'}优惠券成功`);
            fetch();
          }
        })
        .catch(Notify.error)
        .finally(() => setLoading(false));
    },
    [fetch, liveRoomId],
  );

  const handleDelete = React.useCallback((data: ICouponImpl) => {
    setLoading(true);
    deleteCoupon({
      liveFlowId: liveRoomId,
      idList: [data.couponId],
      kdtId: _global.kdtId,
    })
      .then((success) => {
        if (success) {
          Notify.success('删除优惠券成功');
        }
      })
      .then(fetch as any)
      .catch(Notify.error)
      .finally(() => setLoading(false));
  }, [fetch, liveRoomId]);

  React.useEffect(fetch, [fetch]);

  return {
    couponList,
    loading: loadingState,
    setLoading,
    setData: handleChange,
    deleteData: handleDelete,
    refresh: fetch,
  };
};

export default useCouponListData;
