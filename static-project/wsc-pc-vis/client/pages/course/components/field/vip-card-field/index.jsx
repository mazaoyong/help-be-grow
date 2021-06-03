
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { Checkbox } from 'zent';
import './style.scss';

const { getControlGroup } = Form;

const testValid = sellTypeData => {
  if (sellTypeData === undefined) return true;
  if (sellTypeData.isSingleChecked && sellTypeData.price === 0) return true;
  return sellTypeData.isSingleChecked && sellTypeData.price && +sellTypeData.price >= 0;
};

class VipCardField extends Component {
  onChange = e => {
    const val = e.target.checked;
    this.props.onChange(val);
    this.props.self.setState({
      join_level_discount: val,
    });
  };

  render() {
    return (
      <div className="vip-card-field">
        <Checkbox
          disabled={!testValid(this.props.sellTypeData)}
          checked={this.props.value}
          onChange={this.onChange}
        >
          <span>参加会员折扣 &nbsp;</span>
          <p className="help-inline">
            <a href="/v4/scrm/membercard" target="_blank" rel="noopener noreferrer">配置会员折扣</a>
          </p>
        </Checkbox>
      </div>
    );
  }
}

export default getControlGroup(VipCardField);
