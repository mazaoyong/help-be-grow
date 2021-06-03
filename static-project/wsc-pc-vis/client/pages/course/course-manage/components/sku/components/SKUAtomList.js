import React, { Component, PureComponent } from 'react';
import { Sweetalert } from 'zent';
import PropTypes from 'prop-types';
import isArray from 'lodash/isArray';
import SKUAtom from './SKUAtom';
// import Env from '../../../common/env';
import { getSkuLength } from '../utils';

class SKUAtomList extends (PureComponent || Component) {
  constructor(props) {
    super(props);
    this.state = {
      skuOptions: [],
      id: 0,
    };
  }

  componentWillMount() {
    let { sku } = this.props;
    let { optionValue } = this.context;
    let skuId = sku[optionValue];

    if (skuId) {
      this.skuId = skuId;
      this.fetchLeafById(skuId);
    }
  }

  componentWillReceiveProps(nextProps) {
    let { optionValue } = this.context;
    let nextSkuId = nextProps.sku[optionValue];

    if (nextSkuId && +this.skuId !== +nextSkuId) {
      this.skuId = nextSkuId;
      this.fetchLeafById(nextSkuId);
    }
  }

  fetchLeafById(id) {
    if (!id) return;
    let dictId = id;
    this.context.onFetchSKU({ dictId }).then(skuOptions => {
      if (isArray(skuOptions)) {
        // 防止规格过多导致页面卡死
        skuOptions = skuOptions.slice(0, 100);
      } else {
        skuOptions = [];
      }
      this.setState({
        id,
        skuOptions,
      });
    });
  }

  onAddAtomClick = () => {
    let { sku, skuStore } = this.props;
    let { optionText } = this.context;
    let skuLen = getSkuLength(skuStore);

    if (skuLen >= 600) {
      Sweetalert.alert({
        content: '一个线下课最多支持600种组合规格',
        title: '提示',
      });
      return;
    }

    sku = { ...sku };
    sku.leaf.push({
      [optionText]: '',
    });
    this.props.onSKULeafChange(sku.leaf);
  };

  render() {
    let { optionValue } = this.context;
    let { sku, hasSKUImage, onSKULeafChange, disabled } = this.props;
    let { id, skuOptions } = this.state;
    let addAtomEle = (
      <a className="sku-add" href="javascript:;" onClick={this.onAddAtomClick}>
        添加规格值
      </a>
    );

    return (
      <div className="group-container">
        <span className="sku-list__label">规格值：</span>
        <div className="sku-list">
          {(sku.leaf || []).map((item, index) => {
            let itemKey = item[optionValue];
            itemKey = itemKey > 0 ? itemKey : -index;

            return (
              <SKUAtom
                key={itemKey}
                atom={item}
                atomIndex={index}
                skuId={id}
                sku={sku}
                hasSKUImage={hasSKUImage}
                skuOptions={skuOptions}
                onSKULeafChange={onSKULeafChange}
                disabled={disabled}
              />
            );
          })}
          {!disabled && sku[optionValue] > 0 && addAtomEle}
        </div>
      </div>
    );
  }
}

SKUAtomList.contextTypes = {
  maxLeafSize: PropTypes.number,
  optionValue: PropTypes.string,
  optionText: PropTypes.string,
  onFetchSKU: PropTypes.func,
};

export default SKUAtomList;
