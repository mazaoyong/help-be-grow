
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { NumberInput } from 'zent';
import './result-charge-condition-field.scss';
import { tryCatch } from '../../utils';

const { getControlGroup } = Form;

const getBoundaryCount = (value, name, index, preValue, titleCount) => {
  let count;
  try {
    const obj = JSON.parse(value);
    count = obj[name];

    if (obj.new) {
      if (name === 'lowPoint') return 0;
      if (name === 'highPoint') {
        if (+index === 0) {
          return titleCount;
        } else {
          return getBoundaryCount(preValue, 'lowPoint') - 1;
        }
      }
    }
  } catch (error) {
    // error
  }
  return count;
};

// return number
const renderMinCount = nextProps => {
  const { conditionsValue: value } = nextProps;

  let minCount;
  if (value) {
    minCount = getBoundaryCount(value, 'lowPoint');
  }
  return minCount;
};

// return string
const renderMaxCount = nextProps => {
  const { conditionsValue: value, titleCount, resultIndex, preValue } = nextProps;
  let maxCount;
  if (value) {
    maxCount = getBoundaryCount(value, 'highPoint', resultIndex, preValue, titleCount);
  }
  return maxCount;
};

// 判断条件 field
class ResultChargeConditionField extends Component {
  state = {
    minCount: 0,
    maxCount: 0,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const minCount = renderMinCount(nextProps);
    const maxCount = renderMaxCount(nextProps);

    if (prevState.minCount !== minCount || prevState.maxCount !== maxCount) {
      return {
        minCount,
        maxCount,
      };
    }
    return null;
  }

  componentDidMount() {
    // 目的在于新建第一个结果时 触发 onChange 事件
    const { minCount } = this.state;
    const resultIndex = this.props.resultIndex;
    const value = tryCatch(() => {
      return JSON.stringify({
        lowPoint: minCount,
        highPoint: +this.props.titleCount,
      });
    });

    this.props.onChange({ value, resultIndex });
  }

  handleNumber = newNum => {
    if (+newNum === this.state.minCount) return;

    const maxCount = this.state.maxCount;
    const resultIndex = this.props.resultIndex;
    let value;
    try {
      value = JSON.stringify({
        lowPoint: +newNum,
        highPoint: maxCount,
      });
    } catch (error) {
      value = '';
    }
    this.props.onChange({ value, resultIndex });
  };

  render() {
    const { minCount, maxCount } = this.state;
    const { resultCount, resultIndex, unchangable } = this.props;

    const disabled = resultIndex < resultCount - 1 || unchangable;
    const maxRequired = maxCount;

    return (
      <div className="exam-result-charge-condition-field">
        <span className="exam-result-charge-condition-field__text">共答对</span>
        <NumberInput
          width={100}
          value={+minCount}
          showStepper
          min={0}
          max={maxRequired}
          disabled={disabled}
          placeholder="请输入数字"
          onChange={this.handleNumber}
        />
        <span className="exam-result-charge-condition-field__textrate">
          {maxCount === 0 ? '道题' : `至 ${maxCount} 道题`}
          （指答对的题目总数）
        </span>
      </div>
    );
  }
}

export default getControlGroup(ResultChargeConditionField);
