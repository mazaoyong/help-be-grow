import React, { Component } from 'react';
import { Form } from '@zent/compat';
import Rule from './Rule';
import cloneDeep from 'lodash/cloneDeep';
import { IValuationRuleModel, IValuationWeightRule } from 'definitions/local-delivery/config';

interface IProps {
  value: IValuationRuleModel[];
  onChange: (data: IValuationRuleModel[]) => void;
}

class DeliveryWeight extends Component<IProps> {
  handleChange = (rule: IValuationWeightRule, index: number, order: number) => {
    const { value } = this.props;
    const rules = cloneDeep(value);
    rules[index].valuationWeightRules[order] = rule;
    this.props.onChange(rules);
  };

  render() {
    const { value } = this.props;
    return value.map((rule, index) => {
      if (rule.valuationType === 1) {
        return rule.valuationWeightRules.map((weightRule, order) => {
          return (
            <Rule
              key={index}
              rule={weightRule}
              index={index}
              order={order}
              onChange={this.handleChange}
            />
          );
        });
      }
      return null;
    });
  }
}
// @ts-ignore
export default Form.getControlGroup(DeliveryWeight);
