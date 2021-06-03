import React, { Component } from 'react';
import { NumberInput } from 'zent';
// import isNull from 'lodash/isNull';
import { Form, Validation } from 'components/form-kit';
import Env from '../../common/env';
import PopWrapper from '../../components/pop-wrapper';
import { isInStoreCondition, ShowWrapper } from 'fns/chain';

export default class StockItem extends Component {
  componentDidMount() {
    this.initValidation();
  }

  initValidation() {
    this.validation = new Validation(
      this,
      {
        price(value, values) {
          if (value === undefined || value === '') {
            return '请输入价格';
          }
          if (+value < 0) {
            return '价格不能为负数';
          }
          if (+value > 9999999) {
            return '价格最大不能超过9999999.00';
          }
        },
        stockNum(value) {
          if ((value === undefined || value === '') && isInStoreCondition({
            supportEduBranchStore: true,
            supportEduSingleStore: true,
          })) {
            return '请输入名额';
          }
          if (+value < 0) {
            return '名额不能为负数';
          }
          if (+value > 10000000) {
            return '名额最大值不能超过10000000';
          }
        },
      },
      { scrollToError: false },
    );
  }

  isValid() {
    if (this.validation) {
      return this.validation.isValid(this.props.value);
    }

    return true;
  }

  handleFormChange = (name, value) => {
    const { onChange } = this.props;
    const { ...rest } = this.props.value;
    rest[name] = value;

    onChange(rest, name);
  };

  getDisableField = (Element) => {
    return React.cloneElement(Element, { disabled: this.props.disabled || isInStoreCondition({
      supportEduBranchStore: true,
    }) });
  }

  getStockFields = (bindField, stock) => {
    const { disabled, disabledMsg, isStockIndependent } = this.props;
    const isStockLock = !!stock.stock_locked;
    let fields = [];

    const priceField = (
      <td key={4}>
        <PopWrapper
          trigger="hover"
          position="top-left"
          content={disabledMsg}
          wrapperClassName="stock-price-input"
        >
          {bindField(
            this.getDisableField(<NumberInput
              className="input-mini"
              name="price"
              decimal={2}
              autoComplete="off"
              readOnly={Env.isReadOnly('price')}
            />)
          )}
        </PopWrapper>
      </td>
    );

    fields = ShowWrapper(
      {
        children:
      <td key={5}>
        {bindField(
          <NumberInput
            className="input-mini"
            name="stockNum"
            decimal={0}
            disabled={disabled || isInStoreCondition({
              supportEduBranchStore: !isStockIndependent,
            })}
            autoComplete="off"
            readOnly={isStockLock}
          />,
        )}
      </td>,
        isInStoreCondition: isInStoreCondition({
          supportEduSingleStore: true,
          supportEduBranchStore: true, // todo: add privilege check
        }),
      }
    );

    return [priceField, fields];
  };

  render() {
    const { value } = this.props;
    const stock = { ...value };
    const headTds = [1, 2, 3].filter(index => {
      return stock[`v${index}Id`] && stock[`row_${index}_num`] > 0;
    });
    const placeholderCell = () => {
      const len = 3 - headTds.length;
      const placeholders = [];
      for (let i = 0; i < len; i += 1) {
        placeholders.push(<td key={`placeholder-${i}`} />);
      }
      return placeholders;
    };

    return (
      <Form
        component="tr"
        state={stock}
        onChange={this.handleFormChange}
        validation={this.validation}
        className={stock.is_new_row === 1 ? 'has-border' : ''}
      >
        {bindField => [
          headTds.map(index => (
            <td
              key={index}
              className={stock[`row_${index}_num`] > 1 ? 'has-border' : ''}
              rowSpan={stock[`row_${index}_num`]}
            >
              {stock[`v${index}`]}
            </td>
          )),
          this.getStockFields(bindField, stock),
          placeholderCell(),
        ]}
      </Form>
    );
  }
}
