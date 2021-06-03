import { Select } from '@zent/compat';
import React from 'react';
import cn from 'classnames';

const defaultSelectProps = {
  placeholder: '选择店铺',
  optionText: 'shopName',
  optionValue: 'kdtId',
  width: 'auto',
};

// 普通选择器适配器
export default class SelectAdapter extends React.PureComponent {
  onSelectChange = (_, shop) => {
    this.props.onChange(shop.kdtId, shop.metaInfo);
  };

  render() {
    const { kdtId, shopList, ...selectProps } = this.props;
    const { className, popupClassName, ...zentSelectProps } = Object.assign(
      {},
      defaultSelectProps,
      selectProps,
    );
    return (
      <Select
        className={cn('stat-shop-select__select-adapter', className)}
        popupClassName={cn('stat-shop-select__select-adapter-popup', popupClassName)}
        data={shopList}
        {...zentSelectProps}
        onChange={this.onSelectChange}
        value={kdtId}
      />
    );
  }
}
