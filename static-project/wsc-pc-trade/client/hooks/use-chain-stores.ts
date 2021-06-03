import ajax from 'zan-pc-ajax';
import { useEffect, useRef, useState } from 'react';
import { Notify } from 'zent';
import { debounce, unionWith, isEqual } from 'lodash';
import { IStoreSearchResponse } from 'definitions/common/store';

export interface IChainStore {
  shopName: string;
  kdtId: number;
  shopRole?: number;
}

export const getBranchShopList = (keyword?: string, searchParams = {}) => {
  return ajax<IStoreSearchResponse>('/v4/trade/store/search.json', {
    method: 'GET',
    data: {
      keyword,
      ...searchParams,
    },
  });
};

let all: IChainStore[] = [{ shopName: '全部', kdtId: 0, shopRole: 0 }];
/**
 * 获取所有连锁分店的名称和kdtId
 * @param keyword 网店关键字
 */
export default function useChainStores(keyword?: string, searchParams = {}) {
  const [data, setData] = useState<IChainStore[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const debounced = useRef(
    debounce((param?: string) => {
      let isCancel = false;
      setLoading(true);
      getBranchShopList(param || '', searchParams)
        .then(res => {
          if (isCancel) {
            return;
          }
          const items = res?.items ?? [];
          const data = items.map(item => ({
            shopName: item.storeName,
            kdtId: item.storeKdtId,
            shopRole: item.shopRole,
          }));
          setData(data);
          all = unionWith(all, data, isEqual);
        })
        .catch(err => Notify.error(err))
        .finally(() => setLoading(false));
      return () => {
        isCancel = true;
      };
    }, 500),
  );
  useEffect(() => debounced.current(keyword), [keyword]);

  return {
    all,
    data: [{ shopName: '全部', kdtId: 0, shopRole: 0 }, ...data],
    loading,
  };
}
