import React, { Component } from 'react';
import { Form } from '@zent/compat';
import cx from 'classnames';
import { setToFixed, isNumber } from '../../../utils';
import { IValuationWeightRule } from 'definitions/local-delivery/config';

const { FormInputField } = Form;

interface IProps {
  rule: IValuationWeightRule;
  index: number;
  order: number;
  onChange: (rule: IValuationWeightRule, index: number, order: number) => void;
}

interface IState {
  hasError: {
    weightStart: boolean;
    weightUnit: boolean;
    perFee: boolean;
  };
}

const validations = (
  min: number,
  max: number,
  error: string,
  ctx: React.Component<IProps, IState>,
  name: string,
) => {
  return {
    validations: {
      validatorRange(_, value) {
        if (value !== '' && isNumber(value) && value >= min && value <= max) {
          const hasError = {
            ...ctx.state.hasError,
            [name]: false,
          };
          ctx.setState({ hasError });
          return true;
        }
        const hasError = {
          ...ctx.state.hasError,
          [name]: true,
        };
        ctx.setState({ hasError });
      },
    },
    validationErrors: {
      validatorRange: error,
    },
  };
};

const onChange = (name: string, ctx: React.Component<IProps, IState>) => {
  return evt => {
    const value = evt.target.value;
    const newRule = {
      ...ctx.props.rule,
      [name]: value,
    };
    ctx.props.onChange(newRule, ctx.props.index, ctx.props.order);
  };
};

const onBlur = (name: string, decimal: number, ctx: React.Component<IProps, IState>) => {
  return evt => {
    const value = evt.target.value;
    if (isNumber(value)) {
      const newRule = {
        ...ctx.props.rule,
        [name]: setToFixed(value, decimal),
      };
      ctx.props.onChange(newRule, ctx.props.index, ctx.props.order);
    }
  };
};

class Rule extends Component<IProps, IState> {
  state: IState = {
    hasError: {
      weightStart: false,
      weightUnit: false,
      perFee: false,
    },
  };

  weightStartOnChange = onChange('weightStart', this);
  weightStartOnBlur = onBlur('weightStart', 3, this);

  weightUnitOnChange = onChange('weightUnit', this);
  weightUnitOnBlur = onBlur('weightUnit', 0, this);

  perFeeOnChange = onChange('perFee', this);
  perFeeOnBlur = onBlur('perFee', 2, this);

  shouldComponentUpdate(nextProps: IProps, nextState: IState): boolean {
    const nextRule = nextProps.rule;
    const rule = this.props.rule;
    const { hasError } = this.state;
    if (
      nextRule.weightStart === rule.weightStart &&
      nextRule.weightUnit === rule.weightUnit &&
      nextRule.perFee === rule.perFee &&
      nextState.hasError.weightStart === hasError.weightStart &&
      nextState.hasError.weightUnit === hasError.weightUnit &&
      nextState.hasError.perFee === hasError.perFee
    ) {
      return false;
    }
    return true;
  }

  render() {
    const { weightStart, weightUnit, perFee } = this.props.rule;
    const { hasError } = this.state;
    const error = hasError.weightStart || hasError.weightUnit || hasError.perFee;
    return (
      <div className={cx('delivery-weight-fee', { error })}>
        商品重量&nbsp;
        <FormInputField
          inline
          name="weightStart"
          value={weightStart}
          onChange={this.weightStartOnChange}
          onBlur={this.weightStartOnBlur}
          {...validations(0, 10000, '请输入0-10000.000之间的数值', this, 'weightStart')}
        />
        &nbsp;kg 内不额外收费，每超出&nbsp;
        <FormInputField
          inline
          name="weightUnit"
          value={weightUnit}
          onChange={this.weightUnitOnChange}
          onBlur={this.weightUnitOnBlur}
          {...validations(0, 999, '请输入0-999之间的整数', this, 'weightUnit')}
        />
        &nbsp;kg 费用增加&nbsp;
        <FormInputField
          inline
          name="perFee"
          value={perFee}
          onChange={this.perFeeOnChange}
          onBlur={this.perFeeOnBlur}
          {...validations(0, 999, '请输入0-999.00之间的数值', this, 'perFee')}
        />
        &nbsp;元。
      </div>
    );
  }
}

export default Rule;
