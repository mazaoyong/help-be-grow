
import { Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import cx from 'classnames';
import component from './component';
import './index.scss';
const { Field } = Form;

class StartRewardRelatedWrap extends PureComponent {
  // 入学奖励是否被关联
  isStartNodeSet = () => {
    const { courseProduct } = this.props;
    if (courseProduct.alias && courseProduct.rewardNode && courseProduct.rewardNode.length) {
      if (courseProduct.rewardNode.filter(item => (
        item.rewardNodeType === 2
      )).length) {
        return true;
      }
    }
    return false;
  }

  render() {
    const { label, courseProduct, rewardNode, startRewardType, ...props } = this.props;
    return (
      <Field
        label={label}
        name='startRewardType'
        value={startRewardType}
        component={component}
        courseProduct={courseProduct}
        rewardNodeType={rewardNode.rewardNodeType}
        className={cx([
          'start-reward-field',
          {
            hide: courseProduct.courseName === '' || rewardNode.rewardNodeType !== 2 || this.isStartNodeSet(),
          },
        ])}
        {...props}
      ></Field>
    );
  }
};

export default StartRewardRelatedWrap;
