import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Notify } from 'zent';
// import fullfillImage from 'zan-utils/fullfillImage';
// import Upload from 'components/upload';
import forEach from 'lodash/forEach';
import SKUSelect from '../../sku-select';

const EQUALS_ATOM_TEXT_MSG = '已经添加了相同的规格值';

class SKUAtom extends (PureComponent || Component) {
  constructor(props) {
    super(props);
    this.state = {
      newLeafText: '',
    };
  }

  asyncFilterSKULeaf = keyword => {
    let { optionText, maxLeafTextLength } = this.context;
    let { skuOptions } = this.props;
    if (maxLeafTextLength && maxLeafTextLength > 0) {
      keyword = keyword.substring(0, maxLeafTextLength);
    }
    if (skuOptions.some(item => item[optionText] === keyword)) return;
    this.setState({
      newLeafText: keyword,
    });
  };

  filterSKU = (item, keyword) => {
    let { maxLeafTextLength } = this.context;
    if (maxLeafTextLength && maxLeafTextLength > 0) {
      keyword = keyword.substring(0, maxLeafTextLength);
    }
    return item.text.includes(keyword);
  };

  handleReset = () => {
    this.setState({
      newLeafText: '',
    });
  };

  // 删除规格项
  removeSKULeaf(idx) {
    let { sku } = this.props;
    let { leaf } = sku;

    leaf = [...leaf];
    leaf.splice(idx, 1);
    this.props.onSKULeafChange(leaf);
  }

  // 创建规格值
  createAtom(text, index) {
    let { optionValue, optionText, onCreateSKU } = this.context;
    let { sku, onSKULeafChange, skuOptions } = this.props;
    let msg = '创建规格值失败，请重试';

    onCreateSKU({
      text,
      dictId: sku[optionValue],
    })
      .then(resp => {
        if (resp > 0) {
          msg = '';
          let newSKULeaf = {};
          let { leaf } = sku;
          leaf = [...leaf];
          newSKULeaf[optionText] = text;
          newSKULeaf[optionValue] = resp;

          if (!skuOptions.some(item => item[optionText] === text)) {
            skuOptions.push(newSKULeaf);
            this.setState({
              skuOptions: [].concat(skuOptions),
            });
          }

          leaf[index] = newSKULeaf;
          onSKULeafChange(leaf);
        }
      })
      .finally(() => {
        if (msg) {
          Notify.error(msg);
        }
      });
  }

  // 规格项变化
  onAtomChange = (evt, atom) => {
    let { sku, atomIndex, onSKULeafChange } = this.props;
    let { optionValue, optionText } = this.context;

    // 选择得同一个规格
    if (atom[optionValue] === this.props.atom[optionValue]) return;

    if (atom[optionValue]) {
      let { leaf } = sku;
      leaf = [...leaf];

      if (leaf.some(item => item[optionText] === atom[optionText])) {
        Notify.error(EQUALS_ATOM_TEXT_MSG);
        let currAtom = this.props.atom;
        if (currAtom[optionValue]) {
          leaf[atomIndex] = currAtom;
        } else {
          leaf[atomIndex] = {
            _id: '',
          };
        }
      } else {
        leaf[atomIndex] = atom;
      }

      onSKULeafChange(leaf);
    } else {
      this.createAtom(atom[optionText], atomIndex);
    }
  };

  // 搜索框内容变化
  onSearchChange = keyword => {
    let { sku, atomIndex, onSKULeafChange } = this.props;
    let { optionText } = this.context;

    // 选择得同一个规格
    if (keyword === this.props.atom[optionText]) return;

    if (keyword) {
      let { leaf } = sku;
      leaf = [...leaf];

      if (leaf.some(item => item[optionText] === keyword)) {
        Notify.error(EQUALS_ATOM_TEXT_MSG);
        onSKULeafChange(leaf);
      } else {
        this.createAtom(keyword, atomIndex);
      }
    }
  };

  render() {
    let { prefix, optionValue, optionText } = this.context;
    let { sku, atom, atomIndex, skuOptions, hasSKUImage, disabled } = this.props;
    let { newLeafText } = this.state;

    // 过滤掉已经选中的规格值
    let tmpSkuOptions = [];
    let existAtoms = sku.leaf.map(item => {
      return item.text;
    });
    forEach(skuOptions, item => {
      if (atom.text === item.text || !existAtoms.includes(item.text)) {
        tmpSkuOptions.push(item);
      }
    });

    if (newLeafText) {
      if (tmpSkuOptions.length > 0 && tmpSkuOptions[0][optionValue] === 0) {
        tmpSkuOptions[0][optionText] = newLeafText;
      } else {
        let newLeaf = {};
        newLeaf[optionValue] = 0;
        newLeaf[optionText] = newLeafText;
        tmpSkuOptions.unshift(newLeaf);
      }
    }

    let needOpen = false;
    if (typeof atom[optionValue] === 'undefined') {
      if (!(atomIndex === 0 && sku.leaf && sku.leaf.length > 1)) {
        needOpen = true;
      }
    }

    return (
      <div
        key={atomIndex}
        className={cx(`${prefix}-item`, {
          active: hasSKUImage,
        })}
      >
        <SKUSelect
          open={needOpen}
          data={tmpSkuOptions}
          optionValue={optionValue}
          onOpen={this.handleReset}
          value={atom[optionValue]}
          filter={this.filterSKU}
          onAsyncFilter={this.asyncFilterSKULeaf}
          onChange={this.onAtomChange}
          onSearchChange={this.onSearchChange}
          disabled={disabled}
          text={atom[optionText]}
          maxLength={20}
          popupClassName="goods-select-popup"
        />
        {!disabled && (
          <span className="item-remove small" onClick={() => this.removeSKULeaf(atomIndex)}>
            ×
          </span>
        )}
      </div>
    );
  }
}

SKUAtom.contextTypes = {
  prefix: PropTypes.string,
  maxLeafSize: PropTypes.number,
  maxLeafTextLength: PropTypes.number,
  optionValue: PropTypes.string,
  optionText: PropTypes.string,
  onFetchSKU: PropTypes.func,
  onCreateSKU: PropTypes.func,
};

export default SKUAtom;
