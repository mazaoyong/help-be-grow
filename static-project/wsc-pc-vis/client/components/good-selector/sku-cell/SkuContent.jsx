import React, { Component } from 'react';
import { Radio, Checkbox } from 'zent';
import './sku-content.scss';
import { isEduHqStore } from '@youzan/utils-shop';

const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

class SkuContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.tempValue,
    };
  }

  isValueEqual = (a, b) => {
    return a.id === b.id;
  };

  onChange = e => {
    if (this.props.singleSkuMode) {
      this.setState({
        value: e.target.value,
      });
      this.props.setTempValue(e.target.value);
    } else {
      this.setState({
        value: e,
      });
      this.props.setTempValue(e);
    }
  };

  renderHeader = () => {
    const { sku } = this.props;
    return (
      <tr>
        {sku.sku_name_1 && <td>{sku.sku_name_1}</td>}
        {sku.sku_name_2 && <td>{sku.sku_name_2}</td>}
        {sku.sku_name_3 && <td>{sku.sku_name_3}</td>}
      </tr>
    );
  };

  renderBody = (item, preItem, index) => {
    const { sku } = this.props;
    // 3列
    if (item.v1Id && item.v2Id && item.v3Id) {
      // 第一列不同
      const radioValue = {
        id: item.id,
        value: [item.v1, item.v2, item.v3].join(','),
      };
      if (item.v1Id !== preItem.v1Id) {
        const rowSpan1 = sku.sku_name_2_value_length * sku.sku_name_3_value_length;
        const rowSpan2 = sku.sku_name_3_value_length;
        return (
          <tr key={index}>
            <td rowSpan={rowSpan1}>
              {rowSpan1 === 1 && rowSpan2 === 1 && this.renderSelect(item, radioValue)}
              {item.v1}
            </td>
            <td rowSpan={rowSpan2} className={rowSpan2 === 1 && rowSpan1 === 1 ? '' : 'per'}>
              {rowSpan1 !== 1 && rowSpan2 === 1 && this.renderSelect(item, radioValue)}
              {item.v2}
            </td>
            <td className={rowSpan2 === 1 ? '' : 'per'}>
              {rowSpan1 !== 1 && rowSpan2 !== 1 && this.renderSelect(item, radioValue)}
              {item.v3}
            </td>
          </tr>
        );
        // 第一列相同，第二列不同
      } else if (item.v1Id === preItem.v1Id && item.v2Id !== preItem.v2Id) {
        const rowSpan2 = sku.sku_name_3_value_length;
        return (
          <tr key={index}>
            <td rowSpan={rowSpan2} className="per">
              {rowSpan2 === 1 && this.renderSelect(item, radioValue)}
              {item.v2}
            </td>
            <td className={rowSpan2 === 1 ? '' : 'per'}>
              {rowSpan2 !== 1 && this.renderSelect(item, radioValue)}
              {item.v3}
            </td>
          </tr>
        );
      }
      return (
        <tr key={index}>
          <td className="per">
            {this.renderSelect(item, radioValue)}
            {item.v3}
          </td>
        </tr>
      );
      // 2列
    } else if (item.v1Id && item.k2Id && !item.k3Id) {
      // 第一列不同
      const radioValue = {
        id: item.id,
        value: [item.v1, item.v2].join(','),
      };
      if (item.v1Id !== preItem.v1Id) {
        const rowSpan1 = sku.sku_name_2_value_length;
        return (
          <tr key={index}>
            <td rowSpan={rowSpan1}>
              {rowSpan1 === 1 && this.renderSelect(item, radioValue)}
              {item.v1}
            </td>
            <td className={rowSpan1 === 1 ? '' : 'per'}>
              {rowSpan1 !== 1 && this.renderSelect(item, radioValue)}
              {item.v2}
            </td>
          </tr>
        );
      }
      return (
        <tr key={index}>
          <td className="per">
            {this.renderSelect(item, radioValue)}
            {item.v2}
          </td>
        </tr>
      );
    }
    // 1列
    const radioValue = {
      id: item.id,
      value: item.v1,
    };
    return (
      <tr key={index}>
        <td className="per">
          {this.renderSelect(item, radioValue)}
          {item.v1}
        </td>
      </tr>
    );
  };

  renderSelect(item, value) {
    const { singleSkuMode } = this.props;
    let disabled = +item.price === 0 || +item.stockNum === 0;

    if (isEduHqStore) {
      disabled = false;
    }

    return singleSkuMode ? (
      <Radio disabled={disabled} value={value} />
    ) : (
      <Checkbox disabled={disabled} value={value} />
    );
  }

  render() {
    const { sku, singleSkuMode } = this.props;
    const children = (
      <table>
        <thead>{this.renderHeader()}</thead>
        <tbody>
          {sku.stock.map((item, index) => {
            const preItem = sku.stock[index - 1] || {};
            return this.renderBody(item, preItem, index);
          })}
        </tbody>
      </table>
    );
    const element = React.createElement(
      singleSkuMode ? RadioGroup : CheckboxGroup,
      {
        onChange: this.onChange,
        value: this.state.value,
        isValueEqual: this.isValueEqual,
      },
      children,
    );
    return <div className="table-sku-stock">{element}</div>;
  }
}

export default SkuContent;
