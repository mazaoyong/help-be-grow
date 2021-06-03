import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Notify } from 'zent';
import forEach from 'lodash/forEach';
import SKUAtomList from './SKUAtomList';
import SKUSelect from '../../sku-select';
import appCache from '../../../common/app-cache';
// import Env from '../../../common/env';

const noop = res => res;

class SKUGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newSKUText: '',
    };
  }

  filterHandler = (item, keyword) => {
    let { maxSKUTextLength } = this.context;
    if (maxSKUTextLength && maxSKUTextLength > 0) {
      keyword = keyword.substring(0, maxSKUTextLength);
    }
    return `${item.text}`.includes(keyword);
  };

  // 选择sku
  selectSKUHandler = (evt, sku) => {
    let { index, onSKUChange } = this.props;
    let { optionValue, optionText } = this.context;
    sku = { ...sku };
    sku.leaf = [{ text: '' }];
    if (sku[optionValue] === this.props.sku[optionValue]) return;
    if (sku[optionValue]) {
      onSKUChange(sku, index);
      this.updateRecentSelectedSku(sku[optionValue]);
    } else {
      this.createSKU(sku[optionText], index);
    }
  };

  // 创建sku
  createSKU(text) {
    let { sku, index, onSKUChange } = this.props;
    let { onCreateGroup, optionValue, optionText } = this.context;
    let msg = '创建规格名失败，请重试';

    onCreateGroup(text)
      .then(
        resp => {
          if (resp > 0) {
            msg = '';
            sku = { ...sku };
            sku.leaf = [{ text: '' }];
            sku[optionValue] = resp;
            sku[optionText] = text;
            this.setState({
              newSKUText: '',
            });
            onSKUChange(sku, index);
            this.updateRecentSelectedSku(sku[optionValue]);
          }
        },
        resp => {
          if (resp && resp.code !== 99999 && resp.msg) {
            msg = resp.msg;
          }
        }
      )
      .finally(() => {
        if (msg) {
          Notify.error(msg);
        }
      });
  }

  // 记录最近点击的sku
  updateRecentSelectedSku(id) {
    let typeKey = 'common';
    let skuSelectedMap = appCache.get('skuSelectedMap');
    let skuTargetArray = skuSelectedMap[typeKey] || [];
    skuTargetArray.unshift(id);
    skuSelectedMap[typeKey] = skuTargetArray.slice(0, 3);
    appCache.set({
      skuSelectedMap,
    });
  }

  asyncFilterSKU = keyword => {
    let { skuTree } = this.props;
    let { optionText, maxSKUTextLength } = this.context;
    if (maxSKUTextLength && maxSKUTextLength > 0) {
      keyword = keyword.substring(0, maxSKUTextLength);
    }
    if (skuTree.some(item => item[optionText] === keyword)) return;
    this.setState({
      newSKUText: keyword,
    });
  };

  onSKULeafChange = leaf => {
    let { sku, index, onSKUChange } = this.props;
    sku = { ...sku };

    sku.leaf = leaf;
    onSKUChange(sku, index);
  };

  rebuildSKULeaf(sku, index) {
    let { subGroup } = this.state;
    subGroup = [].concat(subGroup);
    if (subGroup[index]) {
      subGroup[index].leaf = [].concat(sku);
    }
    this.setState({ subGroup });
    this.props.onChange(subGroup);
  }

  handleReset = () => {
    this.setState({
      newSKUText: '',
    });
  };

  onSearchChange = keyword => {
    let { sku, index } = this.props;
    let { optionText } = this.context;

    if (keyword && keyword !== sku[optionText]) {
      this.createSKU(keyword, index);
    }
  };

  render() {
    let { sku, skuTree, disabled, skuStore } = this.props;
    let { optionValue, optionText } = this.context;
    let { newSKUText, hasSKUImage } = this.state;
    const prefix = `${this.context.prefix}-group`;

    // 过滤掉已经选中的规格名
    let tmpSkuTree = [];
    let existSkus = skuStore.map(item => {
      return item.text;
    });
    forEach(skuTree, item => {
      if (sku.text === item.text || !existSkus.includes(item.text)) {
        tmpSkuTree.push(item);
      }
    });

    if (newSKUText) {
      if (tmpSkuTree[0][optionValue] === 0) {
        tmpSkuTree[0][optionText] = newSKUText;
      } else {
        let newSKU = {};
        newSKU[optionValue] = 0;
        newSKU[optionText] = newSKUText;
        tmpSkuTree.unshift(newSKU);
      }
    }

    return (
      <div className={prefix}>
        <h3 className="group-title">
          <span className="group-title__label">规格名：</span>
          <SKUSelect
            open={typeof sku[optionValue] === 'undefined'}
            optionValue={optionValue}
            data={tmpSkuTree}
            onChange={this.selectSKUHandler}
            filter={this.filterHandler}
            onAsyncFilter={this.asyncFilterSKU}
            onOpen={this.handleReset}
            value={sku[optionValue]}
            text={sku[optionText]}
            onSearchChange={this.onSearchChange}
            disabled={disabled}
            maxLength={4}
            popupClassName="goods-select-popup"
          />
          {!disabled && (
            <span className="group-remove" onClick={this.props.onSKUDelete}>
              ×
            </span>
          )}
        </h3>
        <SKUAtomList
          sku={{ ...sku }}
          skuStore={skuStore}
          hasSKUImage={hasSKUImage}
          onSKULeafChange={this.onSKULeafChange}
          disabled={disabled}
        />
      </div>
    );
  }
}

SKUGroup.contextTypes = {
  prefix: PropTypes.string,
  maxSKUTextLength: PropTypes.number,
  optionValue: PropTypes.string,
  optionText: PropTypes.string,
  onCreateGroup: PropTypes.func,
};

SKUGroup.propTypes = {
  index: PropTypes.number,
  // sku: PropTypes.object.isRequired,
  onSKUDelete: PropTypes.func,
  onSKUChange: PropTypes.func,
};

SKUGroup.defaultProps = {
  index: 0,
  data: {},
  onSKUDelete: noop,
  onSKUChange: noop,
};

export default SKUGroup;
