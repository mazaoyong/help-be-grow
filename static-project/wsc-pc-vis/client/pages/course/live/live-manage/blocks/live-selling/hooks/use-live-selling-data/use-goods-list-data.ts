import React from 'react';
import { Notify } from 'zent';
import { get, groupBy, reduce } from 'lodash';

import { getGoodsList, createGoodsList, deleteGoods } from '../../../../../api/live-manage';
import type { IBaseAPIProps, SetDataType, IUseLiveSellingDataParams } from './types';
import type { IGoodsImpl } from '../../components/goods-selector-v2';
import type { ILiveItemDTO } from 'definitions/api/owl/pc/LiveItemFacade/findPage';

export interface IUseGoodsListRes extends IBaseAPIProps<IGoodsImpl> {
  goodsList: IGoodsImpl[];
}

const defaultGoodsList: IUseGoodsListRes['goodsList'] = [];
const useGoodsListData = (params: IUseLiveSellingDataParams): IUseGoodsListRes => {
  const { liveRoomId } = params;
  const [loadingState, setLoading] = React.useState(false);
  const [goodsList, setGoodsList] = React.useState(defaultGoodsList);

  const fetch = React.useCallback(
    (pageNumber?: number) => {
      setLoading(true);
      getGoodsList({
        query: {
          liveFlowId: liveRoomId,
        },
        pageRequest: {
          pageNumber: pageNumber || 1,
          pageSize: 100,
        },
      })
        .then(({ content }) => filterGoodsList(content))
        .then(content => {
          setGoodsList(
            content.map((item) => {
              const isEduGoods = item.owlType !== 0;
              return {
                isEduGoods,
                goodsId: item.itemId,
                goodsName: item.title,
                goodsPrice: item.price,
                goodsAlias: item.alias,
                goodsImage: get(item, 'images[0].url', ''),
              };
            }),
          );
        })
        .catch(Notify.error)
        .finally(() => {
          setLoading(false);
        });
    },
    [liveRoomId],
  );

  const handleChange = React.useCallback(
    (data: IGoodsImpl[], type: SetDataType) => {
      setLoading(true);
      createGoodsList({
        liveFlowId: liveRoomId,
        targetKdtId: _global.kdtId,
        itemList: data.map((goods, serialNo) => ({
          id: goods.goodsId,
          serialNo,
        })),
      })
        .then((success) => {
          if (success) {
            Notify.success(`${type === 'add' ? '添加' : '修改'}商品成功`);
          }
        })
        .then(fetch as any)
        .catch(Notify.error)
        .finally(() => setLoading(false));
    },
    [fetch, liveRoomId],
  );

  const handleDelete = React.useCallback(
    (data: IGoodsImpl) => {
      setLoading(true);
      deleteGoods({
        liveFlowId: liveRoomId,
        itemIds: [data.goodsId],
        kdtId: _global.kdtId,
      })
        .then((success) => {
          if (success) {
            Notify.success('删除商品成功');
          }
        })
        .then(fetch as any)
        .catch(Notify.error)
        .finally(() => setLoading(false));
    },
    [fetch, liveRoomId],
  );

  React.useEffect(fetch, [fetch]);

  return {
    goodsList,
    loading: loadingState,
    setLoading,
    setData: handleChange,
    deleteData: handleDelete,
    refresh: fetch,
  };
};

export default useGoodsListData;

const illegalKeys: Record<any, true> = {
  '0': true,
};
// 商品列表在获取到的时候可能会存在商品被删除的情况，需要过滤这些商品
function filterGoodsList(goodsList: ILiveItemDTO[]): ILiveItemDTO[] {
  const groupedGoods = groupBy(goodsList, 'state');
  const keys = Object.keys(groupedGoods);
  if (keys.length) {
    const legalKeys = keys.filter(key => !illegalKeys[key]);
    return reduce(
      legalKeys,
      (prevGoodsList, curKey) => prevGoodsList.concat(groupedGoods[curKey]),
      [] as ILiveItemDTO[],
    );
  }
  return [];
}
