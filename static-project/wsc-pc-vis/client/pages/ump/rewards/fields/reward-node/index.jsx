
import { Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import { hashHistory } from 'react-router';
import component from './component';
import './index.scss';

const { Field } = Form;

class RewardNode extends PureComponent {
  getCerValidations = (startNodeSet, endNodeSet) => {
    const { courseProduct } = this.props;
    const validations = {};
    if (courseProduct.alias) {
      validations['required'] = (formatValue, value) => {
        if ((value.rewardNodeType === 2 && startNodeSet) || (value.rewardNodeType === 3 && endNodeSet)) {
          return `${value.rewardNodeType === 2 ? '入学' : '毕业'}奖励已被关联`;
        }
        return true;
      };
    }
    return validations;
  }

  getCurrentActivityId() {
    const { pathname } = hashHistory.getCurrentLocation();
    const idReg = /\/edit\/([0-9]+)/;
    const matchStr = pathname.match(idReg);
    if (matchStr && matchStr[1]) {
      return +matchStr[1];
    }
    return null;
  }

  // 入学奖励，毕业奖励是否被关联
  isStartEndNodeSet = (nodeType) => {
    const { courseProduct = {} } = this.props;
    if (courseProduct.alias && courseProduct.rewardNode &&
      courseProduct.rewardNode.length && courseProduct.activityId !== this.getCurrentActivityId()) {
      if (courseProduct.rewardNode.filter(item => (
        nodeType === item.rewardNodeType
      )).length) {
        return true;
      }
    }
    return false;
  }

  render() {
    const { label, rewardNode, ...props } = this.props;
    const startNodeSet = this.isStartEndNodeSet(2);
    const endNodeSet = this.isStartEndNodeSet(3);
    return (
      <>
        <Field
          name='rewardNode'
          className= 'reward-node-wrap'
          component={component}
          startNodeSet={startNodeSet}
          endNodeSet={endNodeSet}
          required
          label={label}
          {...props}
          validations={this.getCerValidations(startNodeSet, endNodeSet)}
          value={rewardNode}
        />
      </>
    );
  }
};

export default RewardNode;
