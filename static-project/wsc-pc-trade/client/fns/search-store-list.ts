import ajax from 'zan-pc-ajax';
import { Notify } from 'zent';
import { IStoreSearchResponse } from 'definitions/common/store';

export interface ISelectItem {
  text: string;
  value: number;
}

const formatStoreSearchResponse = (res?: IStoreSearchResponse): ISelectItem[] => {
  const items = res?.items ?? [];
  const selectData = items.map(item => ({ text: item.storeName, value: item.storeKdtId }));
  return [
    {
      text: '全部',
      value: 0,
    },
    ...selectData,
  ];
};

const searchStoreList = (keyword?: string, searchParams = {}) => {
  return ajax<IStoreSearchResponse>('/v4/trade/store/search.json', {
    method: 'GET',
    data: {
      keyword,
      ...searchParams,
    },
  })
    .then(res => formatStoreSearchResponse(res))
    .catch(err => {
      Notify.error(err);
      return formatStoreSearchResponse();
    });
};

export default searchStoreList;
