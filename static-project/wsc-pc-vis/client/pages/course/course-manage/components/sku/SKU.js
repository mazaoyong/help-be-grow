import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Notify } from 'zent';
import cloneDeep from 'lodash/cloneDeep';
import forEach from 'lodash/forEach';
import SKUGroup from './components/SKUGroup';
import SKUButton from './components/SKUButton';
import PopWrapper from '../pop-wrapper';
// import Env from '../../common/env';
import appCache from '../../common/app-cache';

const noop = res => res;

const noopPromise = () => new Promise(noop);

class SKU extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.value,
      skuTree: [].concat(props.skuTree),
    };
  }

  getChildContext() {
    const {
      prefix,
      maxSize,
      maxLeafSize,
      maxSKUTextLength,
      maxLeafTextLength,
      optionText,
      optionValue,
      onFetchSKU,
      onCreateGroup,
      onCreateSKU,
    } = this.props;

    return {
      prefix: `${prefix}-sku`,
      maxSize,
      maxLeafSize,
      maxSKUTextLength,
      maxLeafTextLength,
      optionValue,
      optionText,
      onFetchSKU,
      onCreateGroup,
      onCreateSKU,
    };
  }

  componentWillMount() {
    const { onFetchGroup } = this.props;
    if (typeof onFetchGroup === 'function') {
      onFetchGroup().then(skuTree => {
        this.setState({ skuTree: [].concat(skuTree) });
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: [].concat(nextProps.value),
    });
  }

  addSKU = () => {
    let { data } = this.state;
    data = [...data];
    data.push({
      leaf: [],
    });
    this.setState({ data });
  };

  rebuildSKU = (sku, index) => {
    const { optionValue } = this.props;
    let { data, skuTree } = this.state;
    data = [...data];
    skuTree = [...skuTree];

    if (data.some((item, idx) => item[optionValue] === sku[optionValue] && index !== idx)) {
      Notify.error('已经添加了相同的规格名');
      const currSku = data[index];
      if (!currSku[optionValue]) {
        data[index] = {
          dictId: '',
          leaf: [],
        };
      }
      this.setState({ data });
      return false;
    }
    if (data[index]) {
      data[index] = sku;
    } else {
      data.push(sku);
    }

    if (!skuTree.some(item => item[optionValue] === sku[optionValue])) {
      skuTree.push(sku);
      this.setState({ skuTree: cloneDeep(skuTree) });
    }

    this.setState({ data });
    this.props.onChange(data);
  };

  deleteSKU = index => {
    let { data } = this.state;
    data = [...data];
    data.splice(index, 1);
    this.setState({ data });
    this.props.onChange(data);
  };

  filterSkuTree() {
    const { optionValue } = this.props;
    const { skuTree } = this.state;
    const commonSkuTree = [];
    const customSkuTree = [];
    const typeKey = 'common';
    const skuSelectedMap = appCache.get('skuSelectedMap');
    const skuSelectedCache = skuSelectedMap[typeKey] || [];
    const recentSkuList = [];

    forEach(skuTree, item => {
      const skuId = item[optionValue];
      if (!skuSelectedCache.includes(skuId)) {
        if (item.item_type === 1) {
          // 通用规格名
          customSkuTree.push(item);
        } else {
          // 自定义规格名
          commonSkuTree.push(item);
        }
      } else {
        recentSkuList.push(item);
      }
    });
    return recentSkuList.concat(commonSkuTree, customSkuTree);
  }

  onSorted = data => {
    this.setState({ data });
    this.props.onChange(data);
  };

  render() {
    const { className, prefix, onCreateGroup, disabled, lockedMsg, optionValue } = this.props;
    const { data } = this.state;

    return (
      <div className={cx(`${prefix}-sku`, className)}>
        <PopWrapper trigger="hover" position="top-left" block content={lockedMsg}>
          <div>
            {(data || []).map((item, index) => {
              let itemKey = item[optionValue];
              itemKey = itemKey > 0 ? itemKey : -index;

              return (
                <SKUGroup
                  key={itemKey}
                  index={index}
                  sku={item}
                  skuTree={this.filterSkuTree()}
                  skuStore={data}
                  onSKUChange={this.rebuildSKU}
                  onSKUDelete={() => this.deleteSKU(index)}
                  onSKUCreate={onCreateGroup}
                  disabled={disabled}
                />
              );
            })}
            <SKUButton
              onClick={this.addSKU}
              disabled={disabled}
              skuStore={data}
              onSorted={this.onSorted}
            />
          </div>
        </PopWrapper>
      </div>
    );
  }
}

SKU.childContextTypes = {
  prefix: PropTypes.string,
  maxSize: PropTypes.number,
  maxLeafSize: PropTypes.number,
  maxSKUTextLength: PropTypes.number,
  maxLeafTextLength: PropTypes.number,
  optionValue: PropTypes.string,
  optionText: PropTypes.string,
  onFetchSKU: PropTypes.func,
  onCreateGroup: PropTypes.func,
  onCreateSKU: PropTypes.func,
};

SKU.propTypes = {
  className: PropTypes.string,
  value: PropTypes.array,
  disabled: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  maxSize: PropTypes.number,
  maxLeafSize: PropTypes.number,
  maxSKUTextLength: PropTypes.number,
  maxLeafTextLength: PropTypes.number,
  optionValue: PropTypes.string,
  optionText: PropTypes.string,
  onFetchGroup: PropTypes.func,
  onFetchSKU: PropTypes.func,
  onCreateGroup: PropTypes.func,
  onCreateSKU: PropTypes.func,
  onChange: PropTypes.func,
  prefix: PropTypes.string,
  skuTree: PropTypes.array,
  lockedMsg: PropTypes.any,
};

SKU.defaultProps = {
  className: '',
  value: [],
  maxSize: 3,
  maxLeafSize: 600,
  maxSKUTextLength: 4,
  maxLeafTextLength: 20,
  optionValue: 'id',
  optionText: 'text',
  onFetchGroup: noopPromise,
  onFetchSKU: noopPromise,
  onCreateGroup: noopPromise,
  onCreateSKU: noopPromise,
  onChange: noop,
  prefix: 'rc',
  skuTree: [],
};

export default SKU;
