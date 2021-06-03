
import { Form } from '@zent/compat';
// 2020-1-14
// 增加了隐藏名额组件
// 本应该和stock的input一起封在一个field中，但是这样会改变totalStock这个字段的类型，影响面太大。。。
// 所以分为两个field，通过样式处理成类似效果
// 难受。。。等一个重构
import React, { Component } from 'react';
import sum from 'lodash/sum';
import { isInStoreCondition } from 'fns/chain';

const { FormNumberInputField, FormCheckboxField } = Form;

export default class Stock extends Component {
  getValidation = () => {
    const validateRule = {
      max(_, value) {
        return +value < 10000000;
      },
      min(_, value) {
        return +value >= 0;
      },
      required: true,
    };
    return validateRule;
  };

  render() {
    const {
      label,
      totalStock,
      stocks,
      sellStocks,
      courseType,
      courseSellType,
      isStockIndependent,
      hideStock,
    } = this.props;
    let total = totalStock;
    if (courseType === 0 || (courseType === 1 && courseSellType === 0)) {
      if (stocks.length) {
        total = sum(stocks.map(item => +item.stockNum));
      }
    } else {
      if (sellStocks.length) {
        total = sum(sellStocks.map(item => +item.stockNum));
      }
    }
    const normalCourseDisabled = courseType === 1 && courseSellType !== 0;
    return (
      <div>
        <div
          className="stock-wrap"
        >
          <FormNumberInputField
            name="totalStock"
            className="input-normal stock-wrap__input"
            label={label}
            value={parseInt(total)}
            disabled={stocks.length > 0 || normalCourseDisabled || isInStoreCondition({
              supportEduBranchStore: !isStockIndependent,
            })}
            required
            validations={this.getValidation()}
            validationErrors={{
              max: '名额最大值不能超过10000000',
              min: '名额不能为负数',
              required: '请输入名额',
            }}
          />
          <div className="stock-wrap__unit">人</div>
        </div>
        <div className="hide-stock-wrap">
          <FormCheckboxField
            name="hideStock"
            value={Boolean(hideStock)}
          >
            课程详情页隐藏剩余名额
          </FormCheckboxField>
        </div>
      </div>
    );
  }
}
