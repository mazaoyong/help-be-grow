import React from 'react';
import { differenceBy } from 'lodash';
import { Grid, FormControl, BlockLoading } from 'zent';
import { EduGoodsSelector, EasyList, Img } from '@youzan/ebiz-components';
import { Operations } from '@youzan/react-components';
import { IChannelSelected } from '@youzan/react-components/typings/components/goods-selector-v2';
import buildUrl from '@youzan/utils/url/buildUrl';
import formatMoney from '@youzan/utils/money/format';
import CommonLink from 'components/common-link';

import type { IGoods, IGridColumn, IGoodsSelectorV2Props } from './types';
import './style.scss';

const { GoodsSelector } = EduGoodsSelector;
const { GridPop } = EasyList;
const { ImgWrap } = Img;
const EDU_GOODS_PREFIX = '/wscvis/course/detail/';
const COMMON_GOODS_PREFIX = '/wscshop/goods/';
const GoodsSelectorV2: React.FC<IGoodsSelectorV2Props> = (props) => {
  const {
    umpConfig,
    onChange,
    onDelete,
    goodsList,
    width = '520px',
    renderOperators,
    loading = false,
    required = false,
    attachColumns = [],
    triggerText = '添加商品',
  } = props;

  const selectedGoodsIds = React.useMemo(
    () => goodsList.map((goodsData) => ({ goodsId: goodsData.goodsId })),
    [goodsList],
  );
  const goodsListConfig = React.useMemo<IGridColumn<IGoods>[]>(
    () => [
      {
        title: '商品',
        bodyRender(goodsData) {
          const targetUrl = buildUrl(
            `${goodsData.isEduGoods ? EDU_GOODS_PREFIX : COMMON_GOODS_PREFIX}${
              goodsData.goodsAlias
            }?kdt_id=${_global.kdtId}`,
            'h5',
            _global.kdtId,
          );
          return (
            <div className="goods-selector-v2__goods">
              <div className="goods-selector-v2__goods-img">
                <ImgWrap
                  fullfill="!middle.png"
                  src={goodsData.goodsImage}
                  width="106px"
                  height="60px"
                />
              </div>
              <div className="goods-selector-v2__goods-info">
                <CommonLink url={targetUrl} target="_blank">
                  {goodsData.goodsName}
                </CommonLink>
                <div className="goods-selector-v2__goods-info_price">
                  ￥{formatMoney(goodsData.goodsPrice)}
                </div>
              </div>
            </div>
          );
        },
      },
      // 附加内容展示区域
      ...attachColumns,
      {
        title: '操作',
        textAlign: 'right',
        bodyRender(goodsData, gridPos) {
          const _handleDelete = () => onDelete && onDelete(goodsData);
          if (renderOperators) {
            return renderOperators(goodsData, gridPos);
          }
          return (
            <Operations
              items={[
                <GridPop
                  key="delete"
                  text="删除"
                  trigger="click"
                  content="是否删除？"
                  onConfirm={_handleDelete}
                />,
              ]}
            />
          );
        },
      },
    ],
    [attachColumns, onDelete, renderOperators],
  );

  const handleChange = React.useCallback(
    (online: IChannelSelected) => {
      const curGoodsList = online.value || [];
      // 获取新旧两组商品列表中goodsId不同的
      const minusGoodsList = differenceBy(selectedGoodsIds, curGoodsList, 'goodsId');
      const addonGoodsList = differenceBy(curGoodsList, selectedGoodsIds, 'goodsId');
      const minusGoodsIds = minusGoodsList.map((goodsData) => goodsData.goodsId);
      // 过滤掉变化的数据中存在于老数据里的数据，然后加上新数据
      // 分两种情况，如果勾选的商品反选，说明剔除
      // 没有勾选的商品勾选，就添加到列表的最末
      const newGoodsList = selectedGoodsIds
        .filter((goodsData) => !minusGoodsIds.includes(goodsData.goodsId))
        .concat(addonGoodsList);
      onChange && onChange(newGoodsList);
    },
    [onChange, selectedGoodsIds],
  );

  return (
    <FormControl required={required} label={props.label}>
      <div className="goods-selector-v2" style={{ width }}>
        <BlockLoading loading={loading}>
          <GoodsSelector
            dialogClassName="goods-selector-v2__dialog"
            btnText={triggerText}
            selected={{ type: 'part', value: selectedGoodsIds }}
            activityType={umpConfig.activityType}
            // @ts-ignore
            backEndConfig={_global.gsConfig}
            selectTypes={['part']}
            onConfirm={handleChange}
            mapGoodsValue={(item) => {
              if (item.goodsInventory === 0) {
                item.optional = false;
                item.notOptionalReason.push('库存0不可选');
              }
            }}
            dictConfig={{
              isOnlyShowEduGoods: false,
            }}
          />
          <div className="description">{props.helpDesc}</div>
          <Grid rowKey="goodsId" datasets={goodsList} columns={goodsListConfig} />
        </BlockLoading>
      </div>
    </FormControl>
  );
};

export default GoodsSelectorV2;
export type IGoodsImpl = IGoods;
