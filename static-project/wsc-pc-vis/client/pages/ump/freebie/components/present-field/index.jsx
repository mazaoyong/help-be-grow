
import { Form } from '@zent/compat';
import React, { useCallback } from 'react';
import { PresentSelector, UmpGoodsBrief } from '@youzan/react-components';

import PaginationTable from '../pagination-table';

import { findPresentGoods } from '../../api';

const { getControlGroup } = Form;

function PresentField({ value, onChange, appendix, disabled }) {
  const handleSelect = useCallback(() => {
    PresentSelector.open({
      searchPlaceholder: '搜索赠品名称',
      datasets: value,
      fetchApi: ({ keyword, pageNo, pageSize }) => findPresentGoods({
        command: {
          channel: 0,
          keyword,
        },
        pageRequest: {
          pageNumber: pageNo,
          pageSize: pageSize,
        },
      })
        .then(({ content, total }) => {
          const { range } = appendix;
          const rangeType = (range && range.rangeType) || 'all';
          const goodsItemList = (range && range.goodsItemList) || [];
          return {
            items: content.map(({ isOwlGoods, isAvailable, unAvailableReason, stock, ...restItem }) => {
              const isOwlContained = goodsItemList.findIndex(({ goodsId }) => goodsId === restItem.goodsId) !== -1;
              const isOwlForbidden = isOwlGoods && (rangeType === 'all' || isOwlContained);
              if (isOwlForbidden) {
                unAvailableReason = '与活动商品相同';
                isAvailable = false;
              }
              return {
                ...restItem,
                isAvailable,
                unAvailableReason,
                channel: 1,
                stock: isOwlGoods ? '不限库存' : stock,
              };
            }),
            paginator: {
              totalCount: total,
            },
          };
        }),
      showStepper: false,
      showStatus: true,
      multiple: true,
      btnLink: '/v4/ump/present',
      onChange: data => {
        onChange(data.map(item => ({
          ...item,
          pieces: item.pieces || 1,
          num: Number(item.pieces) || 1,
        })));
      },
    });
  }, [value, onChange, appendix]);

  const getColumns = useCallback(({ current, toggleCurrent }) => {
    return [
      {
        title: '赠品',
        width: '278px ',
        name: 'title',
        bodyRender: row => {
          const url = 'https://h5.youzan.com/wscgoods/detail/' + row.alias;
          const image = (row.picture && row.picture.url) || row.imageUrl || '';
          return (
            <UmpGoodsBrief
              url={url}
              title={row.title}
              image={image}
              price=""
              deleted=""
            />
          );
        },
      },
      {
        title: '剩余库存',
        width: '160px ',
        bodyRender: row => {
          return row.stock;
        },
      },
      {
        title: '赠品数量',
        width: '160px ',
        bodyRender: row => {
          return row.pieces;
        },
      },
      {
        title: '操作',
        width: '80px ',
        textAlign: 'right',
        bodyRender: ({ id }) => {
          if (disabled) {
            return '-';
          }
          const handleChange = () => {
            const _value = value.filter(item => item.id !== id);

            onChange(_value);

            if (_value.length % 5 === 0 && (current > value.length / 5)) {
              toggleCurrent({ current: current - 1 });
            }
          };
          return (
            <a onClick={handleChange}>删除</a>
          );
        },
      },
    ];
  }, [disabled, value, onChange]);

  return (
    <>
      {disabled ? null : (
        <div className="pct-freebie-link">
          <a href="javascript:void(0)" onClick={handleSelect}>选择赠品</a>
        </div>
      )}
      <PaginationTable
        className="pct-freebie-gift-table"
        getColumns={getColumns}
        value={value}
        rowKey="id"
      />
    </>
  );
}

export default getControlGroup(PresentField);
