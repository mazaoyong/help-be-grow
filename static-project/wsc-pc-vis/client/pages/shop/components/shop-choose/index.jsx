
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { ValuntaryAsyncSelect } from 'components/valuntary-async-select/ValuntaryAsyncSelect';
import { findPageAllCampus, getStoreListApi } from './api';
import { isInStoreCondition } from 'fns/chain';

const isEduChainStore = isInStoreCondition({ supportEduChainStore: true });

const { getControlGroup } = Form;

const getPageAllCampus = (query, pageRequest) => {
  return findPageAllCampus({
    pageRequest,
    shopCampusQuery: {
      name: typeof query === 'object' ? '' : query,
    },
  });
};

// 多校区搜索上课校区
const getShopList = ({
  query,
  pageRequest,
  cb,
  addAll = true,
  fetchApi = getPageAllCampus,
}) => {
  return fetchApi(query, pageRequest).then(
    ({ content = [], total, pageable }) => {
      const options = content.map(item => {
        return {
          text: item.shopName,
          value: item.kdtId,
        };
      });

      if (addAll) {
        if (pageRequest.pageNumber === 1) {
          options.unshift({ text: '全部', value: _global.kdtId });
        }
      }

      cb && cb(options, total);

      return options;
    },
  );
};

// 单校区搜索上课地点
const getStoreList = ({ query }) => {
  return getStoreListApi({ keyword: query || null }).then((res = []) => {
    const options = res.map(item => {
      return {
        text: item.name,
        value: item.id,
      };
    });

    options.unshift({
      text: '全部',
      value: -1,
    });
    return options;
  });
};

class ShopChoose extends Component {
  render() {
    const {
      getShopListCallback,
      addAll,
      fetchApi,
      values,
    } = this.props;

    return (
      <ValuntaryAsyncSelect
        create = { false }
        refresh = { false }
        placeholder = '全部'
        useDebounce = { true }
        getOptions={ (query, pageRequest) => {
          if (isEduChainStore) {
            return getShopList({
              query,
              pageRequest,
              cb: getShopListCallback,
              addAll: addAll,
              fetchApi,
            });
          } else {
            return getStoreList({ query });
          }
        } }
        isPageable = {isEduChainStore}
        value = {values && values.kdtId}
        fetchOnLoad={true}
        hideClose={true}
        onAdd={_ => window.open('https://www.youzan.com/v4/shop/online-store#/create')}
        { ...this.props }
      />
    );
  }
};

const ShopChooseControll = getControlGroup(ShopChoose);
export { ShopChooseControll, ShopChoose, getShopList };
