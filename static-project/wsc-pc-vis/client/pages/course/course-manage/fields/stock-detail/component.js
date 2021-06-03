
import { Form } from '@zent/compat';
import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import forEach from 'lodash/forEach';
import { Notify, NumberInput } from 'zent';
import { calcRowNumber } from '../../common/utils';
import SKU from '../../components/sku';
// import Env from '../../common/env';
import StockItem from './StockItem';
import { isInStoreCondition, ShowWrapper } from 'fns/chain';
// import Constants from '../../constants';

const { getControlGroup } = Form;
const { isSame, diffSku, ignoreEmptySku } = SKU;

class StockFieldComponent extends (PureComponent || Component) {
  constructor(props) {
    super(props);
    this.state = {
      batchEditing: '',
      batchValue: 0,
    };

    window.stockValid = (field => {
      return () => field.isValid();
    })(this);
  }

  componentWillUnmount() {
    window.stockValid = null;
  }

  componentWillReceiveProps(nextProps) {
    const options = {
      optionValue: 'dictId',
    };
    const prevSku = ignoreEmptySku(this.props.sku, options);
    const skuList = ignoreEmptySku(nextProps.sku, options);

    if (this.props.value.length === nextProps.value.length && isSame(prevSku, skuList, options)) {
      return;
    }

    // 查找sku的变动项
    const skuAction = diffSku(prevSku, skuList, options);
    if (skuAction === null) return;

    this.skuList = skuList;
    this.descartesBackup = this.props.value;

    let stock = [];
    if (skuAction.type === 'rebuild') {
      stock = this.rebuildDescartes();
    } else if (skuAction.type === 'change') {
      stock = this.handleSkuLeafRename(skuAction);
    } else {
      stock = this.updateDescartes();
    }

    this.props.onChange(stock);
  }

  rebuildDescartes() {
    const descartesData = this.generateDescartes();
    this.descartesBackup = descartesData;
    return descartesData;
  }

  updateDescartes() {
    let descartesData = this.generateDescartes();
    descartesData = this.recoverBackup(descartesData);
    return descartesData;
  }

  handleSkuLeafRename(data) {
    const index = data.index;
    const skuTreeId = data.sku.dictId;
    const fromSkuLeaf = data.prev;
    const toSkuLeaf = data.next;

    let descartesData = this.props.value;
    const kid = `k${index}Id`;
    const vid = `v${index}Id`;
    const v = `v${index}`;
    const s = `s${index}`;
    descartesData = [...descartesData];

    const filterDescartes = descartesData.filter(item => {
      return item[kid] === skuTreeId && item[vid] === fromSkuLeaf.dictId;
    });

    filterDescartes.forEach(item => {
      item.id = 0;
      item[vid] = toSkuLeaf.dictId;
      item[v] = toSkuLeaf.text;
      item[s] = toSkuLeaf.dictId;
    });

    return descartesData;
  }

  generateDescartes() {
    let descartesData = [];
    forEach(this.skuList, (item, key) => {
      if (isEmpty(descartesData)) {
        descartesData = this.initSkuData(item, key);
      } else {
        descartesData = this.appendSkuInfo(descartesData, item, key);
      }
    });
    return descartesData;
  }

  initSkuData = (item, key) => {
    const newDescartes = [];

    forEach(item.leaf, atom => {
      const _key = key + 1;
      const preAtom =
        this.descartesBackup.find(descarte => descarte.id && descarte.id === item.id) || {};

      const row = {
        id: preAtom.id || 0,
        price: preAtom.price || '',
        stockNum: preAtom.stockNum || '',
      };

      row[`k${_key}Id`] = item.dictId;
      row[`k${_key}`] = item.text;
      row[`v${_key}Id`] = atom.dictId;
      row[`v${_key}`] = atom.text;

      newDescartes.push(row);
    });

    return newDescartes;
  };

  appendSkuInfo = (descartesData, item, key) => {
    const newDescartes = [];

    forEach(descartesData, baseRow => {
      forEach(item.leaf, atom => {
        const row = {};

        forEach(baseRow, (v, k) => {
          row[k] = v;
        });

        const _key = key + 1;

        const preAtom =
          this.descartesBackup.find(descarte => descarte.id && descarte.id === item.id) || {};

        row.price = preAtom.price || '';
        row.stockNum = preAtom.stockNum || '';
        row[`k${_key}Id`] = item.dictId;
        row[`k${_key}`] = item.text;
        row[`v${_key}Id`] = atom.dictId;
        row[`v${_key}`] = atom.text;

        newDescartes.push(row);
      });
    });

    return newDescartes;
  };

  recoverBackup = descartesData => {
    forEach(descartesData, (item, key) => {
      const oldItem = this.findItemInBackup(item);
      if (oldItem) {
        if (oldItem.dictId) {
          descartesData[key].id = oldItem.id;
        }
        descartesData[key].stockNum = oldItem.stockNum;
        descartesData[key].price = oldItem.price;
      }
    });
    return descartesData;
  };

  findItemInBackup = descartesAtom => {
    let result;
    const filters = this.getFilterKeys(descartesAtom);
    for (let i = 0, len = this.descartesBackup.length; i < len; i++) {
      const item = this.descartesBackup[i];
      const itemStr = this.getFilterKeys(item);
      if (filters === itemStr) {
        result = item;
        break;
      }
    }
    return result;
  };

  isSkuEqual(arr1, arr2) {
    let result = true;

    arr1.forEach(key => {
      if (!arr2.includes(key)) {
        result = false;
      }
    });

    return result;
  }

  getAtomKeys(descartesAtom) {
    descartesAtom = descartesAtom || {};
    const arr = [];
    for (let i = 1; i <= 3; i++) {
      const key = `v${i}Id`;
      const value = descartesAtom[key];

      if (value) {
        arr.push(value);
      }
    }

    return arr;
  }

  getFilterKeys(descartesAtom) {
    descartesAtom = descartesAtom || {};
    const arr = [];
    for (let i = 1; i <= 3; i++) {
      const key = `v${i}Id`;
      const value = descartesAtom[key];

      if (value) {
        arr.push(`${key}_${value}`);
      }
    }
    const str = arr.join('-');

    return str;
  }

  onBatchEdit = type => {
    if (!this.props.disabled) {
      this.setState({
        batchEditing: type,
      });
    }
  };

  cancelBatchEdit = () => {
    this.setState({
      batchEditing: '',
      batchValue: 0,
    });
  };

  handleBatchChange = evt => {
    // let { batchEditing } = this.state;
    const targetValue = evt || 0;
    this.setState({
      batchValue: targetValue,
    });
  };

  handleStockChange(index, stock, type) {
    const { onChange } = this.props;
    const stocks = this.props.value.slice();

    stocks[index] = stock;
    this.descartesBackup = stocks;
    onChange(stocks);
  }

  batchUpdate = () => {
    let { value } = this.props;
    const { batchEditing, batchValue } = this.state;
    value = [...value];

    if (
      (batchEditing === 'price' &&
        (!/^\d+(\.\d{0,2})?$/.test(batchValue) || +batchValue < 0 || +batchValue > 9999999)) ||
      (batchEditing === 'stockNum' &&
        (!/^\d+$/.test(batchValue) || +batchValue < 0 || +batchValue > 10000000))
    ) {
      Notify.error(`请输入一个正确的${batchEditing === 'price' ? '价格' : '库存'}`);
      this.setState({
        batchEditing: '',
        batchValue: 0,
      });
      return;
    }
    value = value.map(item => {
      item = { ...item };
      item[batchEditing] = +batchValue;
      return item;
    });
    this.setState({
      batchEditing: '',
      batchValue: 0,
    });
    this.descartesBackup = value;
    this.props.onChange(value);
  };

  isValid() {
    if (this.stocksInstance) {
      const unvalidInstance = this.stocksInstance
        .map(instance => instance.isValid())
        .filter(isValid => isValid === false);
      if (unvalidInstance && unvalidInstance.length > 0) {
        return false;
      }
      return true;
    }

    return true;
  }

  render() {
    const { value, sku, disabled, disabledMsg, isStockIndependent } = this.props;
    const { batchEditing, batchValue } = this.state;
    this.stocksInstance = [];
    calcRowNumber(value);

    const stocksElement = value.map((item, index) => {
      return (
        <StockItem
          key={this.getFilterKeys(item)}
          value={item}
          disabled={disabled}
          disabledMsg={disabledMsg}
          isStockIndependent={isStockIndependent}
          ref={instance => {
            if (instance) {
              this.stocksInstance[index] = instance;
            }
          }}
          onChange={(e, type) => this.handleStockChange(index, e, type)}
        />
      );
    });
    let validateKeys = [];
    // 如果选择了sku信息
    if (value.length) {
      const keys = Object.keys(value[0]);
      // 筛选出所有key名字形如k+数字+Id的
      validateKeys = keys.filter(key => {
        return key.toString().match(/k\d$/) !== null && value[0][key] !== '';
      });
    }

    return (
      <div className="table-sku-wrap">
        {value.length && (
          <table className="table-sku-stock">
            <thead>
              <tr>
                {validateKeys.map((k, index) => (
                  <th key={index}>{value[0][k]}</th>
                ))}
                <th className="th-price">
                  <em className="zent-form__required">*</em>
                  价格（元）
                </th>
                {ShowWrapper(
                  {
                    children: <th className="th-stock">
                      <em className="zent-form__required">*</em>
                    名额
                    </th>,
                    isInStoreCondition: isInStoreCondition({
                      supportEduSingleStore: true,
                      supportEduBranchStore: true, // todo: add privilege check
                    }),
                  })}
              </tr>
            </thead>
            <tbody>{stocksElement}</tbody>
            <tfoot>
              <tr>
                <td className="batch-opts" colSpan={sku.length + 5}>
                  <span>批量设置：</span>
                  {batchEditing ? (
                    <span>
                      <span className="input-mini">
                        <NumberInput
                          value={batchValue}
                          decimal={batchEditing === 'stockNum' ? 0 : 2}
                          onChange={this.handleBatchChange}
                        />
                      </span>
                      <a href="javascript:;" onClick={this.batchUpdate} style={{ marginRight: 10 }}>
                        保存
                      </a>
                      <a href="javascript:;" onClick={this.cancelBatchEdit}>
                        取消
                      </a>
                    </span>
                  ) : (
                    <span>
                      {
                        <a
                          href="javascript:;"
                          onClick={() => this.onBatchEdit('price')}
                          style={{ marginRight: 10 }}
                          className={isInStoreCondition({
                            supportEduBranchStore: true,
                          }) ? 'disable-pointer-input' : ''}
                        >
                          价格
                        </a>
                      }
                      {
                        ShowWrapper(
                          {
                            children: <a href="javascript:;" onClick={() => this.onBatchEdit('stockNum')}>
                              名额
                            </a>,
                            isInStoreCondition: isInStoreCondition({
                              supportEduSingleStore: true,
                              supportEduBranchStore: true, // todo: add privilege check
                            }),
                          })
                      }
                    </span>
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    );
  }
}

StockFieldComponent.defaultProps = {
  sku: [],
};

StockFieldComponent.propTypes = {
  sku: PropTypes.array,
};

export default getControlGroup(StockFieldComponent);
