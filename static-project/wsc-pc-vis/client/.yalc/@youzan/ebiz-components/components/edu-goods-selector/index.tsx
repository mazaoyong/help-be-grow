import React, { FC, useMemo, useCallback } from 'react';
import isNumber from 'lodash/isNumber';
import get from 'lodash/get';
import cx from 'classnames';
import { GoodsSelectorV2 } from '@youzan/react-components';
import {
  IPropsConfig,
  ISelectResult,
  Mode,
  IChannelSelected,
} from '@youzan/react-components/typings/components/goods-selector-v2';
import { getGoodsDict, getConfig } from './utils';
import { IEduGoodsSelectorProps, EduGoodsType, SelectTypes } from './types';
import './style.scss';

const { Dialog: GoodsSelectorDialog, getUmpFieldConfig } = GoodsSelectorV2;

const EduGoodsSelector: FC<IEduGoodsSelectorProps> = ({
  selected,
  isSingle = false,
  isSkuMode = false,
  isHideManageBtn = false,
  activityType,
  activityId,
  backEndConfig,
  biz = ['course', 'column', 'content', 'live'] as EduGoodsType[],
  typeFilterOptions,
  selectTypes = ['all', 'part'] as SelectTypes[],
  maxGoodsNum,
  maxSkuNum,
  showTypeFilter = false,
  showGroupColumn = true,
  showStockColumn = true,
  showSalesColumn = true,
  showJoinActivityColumn = true,
  showNotOptionalColumn = true,
  showSoldOut = false,
  showContentFilterSubType = false,
  soldOutSelectable = true,
  needSkuInfo = false,
  onConfirm,
  mapGoodsValue,
  dialogClassName = '',
  dictConfig = {
    isOnlyShowEduGoods: true,
    customManageUrl: '',
  },
  ...rest
}) => {
  // TODO(meijing): 中台组件未暴露类型筛选onChange事件，用户切换了商品类型，组件外部无从得知
  // 和杨超和阿西沟通后，先维持有实物商品等非教育商品时，统一跳转到商品管理页面，后续阿西会给中台提需求
  const { isOnlyShowEduGoods, customManageUrl } = dictConfig;
  const dict = useMemo(() => getGoodsDict(GoodsSelectorV2.initDict(), isOnlyShowEduGoods !== false, customManageUrl || ''), [
    isOnlyShowEduGoods,
    customManageUrl,
  ]);

  const config: IPropsConfig = useMemo(() => {
    /** 是否为营销模式，显式指定了activityType，则开启营销模式 */
    const isUmpType = isNumber(activityType);
    let initConfig;

    if (isUmpType) {
      const formattedConfig = getUmpFieldConfig(backEndConfig);
      initConfig = get(formattedConfig, 'dialogsProps.part.config', {});
    } else {
      initConfig = GoodsSelectorV2.initConfig();
    }

    return getConfig({
      isUmpType,
      initConfig,
      isSingle,
      isSkuMode,
      activityType,
      activityId,
      biz,
      typeFilterOptions,
      selectTypes,
      maxGoodsNum,
      maxSkuNum,
      showTypeFilter,
      showGroupColumn,
      showStockColumn,
      showSalesColumn,
      showJoinActivityColumn,
      showNotOptionalColumn,
      showSoldOut,
      showContentFilterSubType,
      soldOutSelectable,
      needSkuInfo,
      mapGoodsValue,
      dictConfig,
    });
  }, [
    isSingle,
    isSkuMode,
    activityType,
    activityId,
    backEndConfig,
    biz,
    typeFilterOptions,
    selectTypes,
    maxGoodsNum,
    maxSkuNum,
    showTypeFilter,
    showGroupColumn,
    showStockColumn,
    showSalesColumn,
    showJoinActivityColumn,
    showNotOptionalColumn,
    showSoldOut,
    showContentFilterSubType,
    soldOutSelectable,
    needSkuInfo,
    mapGoodsValue,
    dictConfig,
  ]);

  const onSelectorConfirm = useCallback(
    (result: ISelectResult) => {
      onConfirm(result.online);
    },
    [onConfirm]
  );

  const selectorSelected = selected
    ? {
        mode: 'goods' as Mode,
        online: selected,
        offline: {
          type: 'part',
          value: [],
        } as IChannelSelected,
      }
    : undefined;

  return (
    <GoodsSelectorDialog
      config={config}
      selected={selectorSelected}
      dict={dict}
      onSelectOk={onSelectorConfirm}
      dialogClassName={cx(dialogClassName, {
        'ebiz-gs-hide-manage-btn': isHideManageBtn,
      })}
      {...rest}
    />
  );
};

export default { GoodsSelector: EduGoodsSelector };
export * from './types';
export * from './constants';
