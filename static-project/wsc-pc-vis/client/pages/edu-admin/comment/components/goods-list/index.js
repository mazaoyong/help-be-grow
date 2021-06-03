import { Select } from '@zent/compat';
import React, { useEffect, useState, useContext } from 'react';
import { BlockLoading, MiniPagination } from 'zent';
import Item from './item';
import './style.scss';

import * as api from '../../api';
import { comment } from '../../reducers/comment';
import get from 'lodash/get';

const GoodsSortingOptions = [
  {
    text: '上架时间',
    value: 'product_published_at',
  },
  {
    text: '最新留言',
    value: 'last_commented_at',
  },
];

const initialState = {
  sortBy: 'last_commented_at',
  page: 1,
  pageSize: 20,
  total: 0,
  loading: true,
  list: [],
};

const GoodsList = props => {
  const { context, dispatch } = useContext(comment);
  const [goods, setGoods] = useState(initialState.list);
  const [sortBy, setSortRule] = useState(initialState.sortBy);
  const [loading, setLoadingState] = useState(initialState.loading);
  const [page, setCurrentPage] = useState(initialState.page);
  const [total, setTotalNum] = useState(initialState.total);

  const handleDispatch = (type, payload) => {
    dispatch({
      type,
      payload,
    });
  };

  const readComment = alias => {
    api.readComment({ alias }).then(() => {
      setGoods(
        goods.map(item => {
          if (item.alias === context.productAlias) {
            return {
              ...item,
              newCommentCount: 0,
            };
          }
          return item;
        })
      );
    });
  };

  const getGoodsList = page => {
    setLoadingState(true);
    api.getGoodsList({
      page: page || 1,
      sortBy,
    })
      .then(data => {
        const { content: list } = data || {};
        if (list.length) {
          setTotalNum(data.total);
          setGoods(list);
          handleDispatch('setState', {
            currentGoods: list[0],
            productId: list[0].id,
            productAlias: list[0].alias,
          });
        }
      })
      .finally(_ => setLoadingState(false));
  };

  // page number changed would invoke good-list refetching
  const pageChange = page => {
    setCurrentPage(page);
    getGoodsList(page);
  };

  // EFFECTS
  // invoke when didMounted
  // invoke when sortBy change
  useEffect(
    () => {
      setCurrentPage(1);
      getGoodsList(1);
    },
    [sortBy],
  );
  useEffect(() => {
    if (context.productAlias !== '' && get(context, 'currentGoods.newCommentCount', 0) > 0) {
      readComment(context.productAlias);
    }
  }, [context, context.productAlias]);

  return (
    <div className="paid-content-container">
      <div className="paid-content-container__title">
        全部内容
        <Select
          className="comment-content-filter__typeselect"
          autoWidth
          width={90}
          placeholder="最新留言"
          value={sortBy}
          onChange={(_, selected) => setSortRule(selected.value)}
          data={GoodsSortingOptions}
        />
      </div>
      <BlockLoading loading={loading}>
        <div className="paid-content-list">
          {goods.map(goodsItem => {
            const { id, alias } = goodsItem;
            return (
              <Item
                key={id}
                data={goodsItem}
                active={context.productId === id}
                onClick={() => {
                  handleDispatch('setState', {
                    currentGoods: goodsItem,
                    productId: id,
                    productAlias: alias,
                    chosenSticky: -1,
                  });
                }}
              />
            );
          })}
        </div>
      </BlockLoading>
      <MiniPagination
        current={page}
        total={total}
        pageSize={initialState.pageSize}
        onChange={({ current }) => pageChange(current)}
      />
    </div>
  );
};

export default GoodsList;
