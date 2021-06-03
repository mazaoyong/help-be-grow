import React from 'react';
import cn from 'classnames';
import SelectAdapter from './components/select-adapter';
import { CURRENT_SHOP_INFO, divideItemPresets } from './constants';
import DivideSelect from './components/divide-select';
import './index.scss';

const ApapterMap = {
  select: SelectAdapter,
};

const StatShopSelect = function(props) {
  const {
    type,
    getCustomComponent,
    divideItems,
    kdtId,
    shopList,
    metaInfo,
    onChange,
    className,
    ...passedProps
  } = props;

  const Adapter = getCustomComponent ? getCustomComponent() : ApapterMap[type];

  return (
    <div className={cn('stat-shop-select', className)}>
      <DivideSelect
        items={divideItems}
        kdtId={kdtId}
        shopList={shopList}
        metaInfo={metaInfo}
        onChange={onChange}
      >
        <Adapter
          kdtId={kdtId}
          shopList={shopList}
          metaInfo={metaInfo}
          onChange={onChange}
          {...passedProps}
        />
      </DivideSelect>
    </div>
  );
};

StatShopSelect.defaultProps = {
  selectProps: {},
  type: 'select',
  divideItems: [],
  rootShop: CURRENT_SHOP_INFO,
};

StatShopSelect.divideItemPresets = divideItemPresets;

export default StatShopSelect;
