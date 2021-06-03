
import { Form } from '@zent/compat';
import React, { useCallback, useEffect, useState } from 'react';
import { PopSku } from '@youzan/react-components';
import { Notify, Radio, ClampLines } from 'zent';
import { isEduShop, isRetailSingleStore, isWscSingleStore, isPureWscSingleStore, isEduSingleStore } from '@youzan/utils-shop';
import { open, close } from '../goods-sku-selector';

import PaginationTable from '../pagination-table';
import { formatOutput, formatInput, convertSkuInfo } from '../../utils';
import { getGoodsList, getSkuInfo, findWithSku } from '../../api';

import './styles.scss';

const { getControlGroup } = Form;

const RadioGroup = Radio.Group;

let goodsText = '全部课程商品（含专栏/内容）';

if (isEduSingleStore) {
  goodsText = '全部课程商品（含线下课/专栏/内容/直播）';
}
if (isPureWscSingleStore) {
  goodsText = '全部课程商品（含专栏/内容/直播）';
}

window._productIds = [];

function GoodsList({ disabled, loading, goodsList, onGoodsListChange, value, onChange }) {
  const getColumns = useCallback(({ current, toggleCurrent }) => [
    {
      title: '课程',
      width: '278px ',
      bodyRender: item => (
        <div className="pct-freebie-goods-field-info">
          <a className="pct-freebie-goods-field-img" href={item.url} target="_blank" rel="noopener noreferrer">
            <img alt="" src={item.image_url || item.cover} />
          </a>
          <div className="pct-freebie-goods-field-title">
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              <ClampLines lines={1} popWidth={150} text={item.title} />
            </a>
          </div>
        </div>
      ),
    },
    {
      title: '金额（元）',
      width: '160px',
      textAlign: 'right',
      bodyRender: (item, { row }) => {
        if (item.sku_info_list && item.sku_info_list.length > 0 && value.goodsItemList[row]) {
          const goodsItem = value.goodsItemList.find(goodsItem => goodsItem.goodsId === item.product_id);
          const skuIdList = (goodsItem && goodsItem.skuIdList) || [];
          const curItems = item.sku_info_list
            .filter(skuInfo => skuIdList.find(skuId => skuId === skuInfo.sku_id))
            .sort((pre, cur) => {
              if (pre.sku_price < cur.sku_price) {
                return -1;
              } else if (pre.sku_price === cur.sku_price) {
                return 0;
              }
              return 1;
            });
          const startPrice = (curItems[0] && curItems[0].sku_price) || 0;
          const endPrice = (curItems[curItems.length - 1] && curItems[curItems.length - 1].sku_price) || 0;
          if (startPrice === endPrice) {
            return (startPrice / 100).toFixed(2);
          }
          return (startPrice / 100).toFixed(2) + '-' + (endPrice / 100).toFixed(2);
        }
        return (item.price / 100).toFixed(2);
      },
    },
    {
      title: '参与规格',
      width: '160px',
      bodyRender: item => {
        const handleSkuChange = selectedSkuIds => {
          let _goodsItemList = [];
          value.goodsItemList.forEach(goodsItem => {
            if (goodsItem.goodsId === item.product_id) {
              _goodsItemList.push({
                ...goodsItem,
                skuIdList: selectedSkuIds,
              });
            } else {
              _goodsItemList.push(goodsItem);
            }
          });
          onChange({
            rangeType: 'part',
            goodsItemList: _goodsItemList,
          });
        };
        const goodsItem = value.goodsItemList.find(goodsItem => goodsItem.goodsId === item.product_id);
        const skuIdList = goodsItem && goodsItem.skuIdList;
        if (item.sku_info_list && skuIdList) {
          const skuInfoText = item.sku_info_list.filter(skuInfo => {
            return skuIdList.findIndex(skuId => skuInfo.sku_id === skuId) !== -1;
          }).map(item => item.sku_desc).join('；');
          return (
            <>
              <div>{skuInfoText}</div>
              <div>
                <PopSku
                  disabled={disabled}
                  alias={item.alias}
                  data={item.skuInfo}
                  selected={skuIdList}
                  id={item.product_id}
                  onChange={handleSkuChange}
                  multiple
                />
              </div>
            </>
          );
        }
        return '-';
      },
    },
    {
      title: '操作',
      width: '80px',
      textAlign: 'right',
      bodyRender: ({ product_id: id }) => {
        if (disabled) {
          return '-';
        }
        const handleDelete = () => {
          const _goodsItemList = value.goodsItemList.filter(goodsItem => goodsItem.goodsId !== id);
          const _goodsList = goodsList.filter(goods => {
            return goods.product_id !== id;
          });
          onChange({
            ...value,
            goodsItemList: _goodsItemList,
          });
          onGoodsListChange(_goodsList);
          if (_goodsList.length % 5 === 0 && (current > _goodsList.length / 5)) {
            toggleCurrent({ current: current - 1 });
          }
        };
        return (
          <a rel="noopener noreferrer" onClick={handleDelete}>
            删除
          </a>
        );
      },
    },
  ], [disabled, value, onChange, goodsList, onGoodsListChange]);

  return (
    <PaginationTable
      className="pct-freebie-goods-field-list"
      rowKey="item_id"
      getColumns={getColumns}
      emptyLabel="没有选择商品"
      value={goodsList}
      loading={loading}
    />
  );
}

function GoodsField({
  disabled,
  value,
  onChange,
  activityId = 0,
}) {
  const [goodsList, setGoodsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const selected = formatInput(value);
  const handleSelect = useCallback(() => {
    open({
      multiple: true,
      channels: ['online'],
      selected,
      onlineManageUrl: isEduShop ? '/v4/vis/edu/course#/course-manage/list' : '/v4/vis/pct/page/tabs',
      fetchApi: ({
        keyword,
        pageNo,
        pageSize,
        channel: eduChannel,
        subType,
      }) => {
        const channel = eduChannel === 0 ? 'online' : 'distribution';
        const group = eduChannel === 0 ? subType || 0 : 1;
        const req = {
          channel,
          keyword,
          eduChannel,
          type: 'knowledge',
          subType: group,
          group,
          page: pageNo,
          pageSize,
          activityId: activityId || 0,
          activityType: 1001,
        };

        return getGoodsList(req).then(res => {
          // 添加 skuInfo 对象
          const items = (res.content && res.content.map(item => {
            if (!(isWscSingleStore || isRetailSingleStore) && (item.owlItemType === 10)) {
              item.error = '线下课不可用';
              item.canSelect = false;
            }
            return {
              ...item,
              goodsId: item.id,
            };
          })) || [];

          return Promise.all(
            items.filter(item => item.skuSize)
              .map(item => getSkuInfo({ alias: item.alias })))
            .then(skuInfos => {
              skuInfos.forEach(skuInfo => {
                if (skuInfo) {
                  const curItem = items.find(item => item.id === skuInfo.id);
                  curItem.skuInfo = convertSkuInfo(skuInfo);
                  curItem.isSku = true;
                }
              });
              return {
                items,
                count: (res.total) || (res.paginator && res.paginator.totalCount) || 0,
              };
            });
        }).catch(err => {
          Notify.error(err);
          return {
            items: [],
            count: 0,
          };
        });
      },
      onChange: data => {
        onChange({
          rangeType: 'part',
          goodsItemList: formatOutput(data),
        });
        close();
      },
    });
  }, [activityId, selected, onChange]);

  const handleRadioChange = useCallback(e => {
    onChange({
      rangeType: e.target.value,
      goodsItemList: [],
    });
  }, [onChange]);

  useEffect(() => {
    const valueLength = goodsList && goodsList.length;
    const goodsLength = value && value.goodsItemList && value.goodsItemList.length;

    // 表单数据和展示列表数据是否匹配
    let isMatched = false;

    if (valueLength === goodsLength) {
      isMatched = true;
      const valueIds = value.goodsItemList
        .map(goodsItem => goodsItem.goodsId)
        .sort((a, b) => a > b ? 1 : (a === b ? 0 : -1));
      const goodsIds = goodsList
        .map(goods => goods.product_id)
        .sort((a, b) => a > b ? 1 : (a === b ? 0 : -1));

      for (let i = 0; i < valueLength; i++) {
        if (valueIds[i] !== goodsIds[i]) {
          isMatched = false;
          break;
        }
      }
    }

    if (!isMatched) {
      const productIds = value && value.goodsItemList.map(({ goodsId }) => goodsId);

      // 防止重复提交请求
      if (productIds.length === window._productIds.length) {
        let repeated = true;
        for (let i = 0; i < productIds.length; i++) {
          if (window._productIds[i] !== productIds[i]) {
            repeated = false;
            break;
          }
        }
        if (repeated) {
          return;
        }
      }

      window._productIds = productIds;
      if (productIds.length > 0) {
        setLoading(true);
        findWithSku({
          productIds: productIds.join(),
        }).then(data => {
          const _data = data.filter(_item => _item.is_exist);
          Promise.all(_data
            .filter(item => item.sku_info_list && item.sku_info_list.length > 0)
            .map(item => getSkuInfo({ alias: item.alias })))
            .then(skuInfos => {
              skuInfos.forEach(skuInfo => {
                const curItem = _data.find(item => item.product_id === skuInfo.id);
                curItem.skuInfo = convertSkuInfo(skuInfo);
                curItem.isSku = true;
              });
              setGoodsList(_data);
            });
        }).catch(err => {
          Notify.error(err);
        }).finally(() => {
          setLoading(false);
        });
      } else {
        setGoodsList([]);
      }
    }
  }, [value, goodsList]);

  const handleGoodsListChange = useCallback(_goodsList => {
    window._productIds = _goodsList.map(goods => goods.product_id);
    setGoodsList(_goodsList);
  }, []);

  return (
    <div className="goods-select-wrapper">
      <RadioGroup disabled={disabled} onChange={handleRadioChange} value={value.rangeType}>
        <div className="pct-freebie-radio-field">
          <Radio value="all">{goodsText}</Radio>
        </div>
        <div className="pct-freebie-radio-field">
          <Radio value="part">
            指定课程商品
          </Radio>
        </div>
      </RadioGroup>
      {value.rangeType === 'part' ? (
        <div className="pct-freebie-goods-field-link">
          {disabled ? null : (
            <div className="pct-freebie-link">
              <a href="javascript: void(0);" onClick={handleSelect}>选择指定商品</a>
            </div>
          )}
          <GoodsList
            disabled={disabled}
            loading={loading}
            goodsList={goodsList}
            onGoodsListChange={handleGoodsListChange}
            value={value}
            onChange={onChange}
          />
        </div>
      ) : null}
    </div>
  );
}

export default getControlGroup(GoodsField);
