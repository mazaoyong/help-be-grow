
import { Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import cx from 'classnames';
import component from './component';
import './index.scss';
const { Field } = Form;

class EndRewardRelatedWrap extends PureComponent {
  // 毕业奖励是否被关联
  isEndNodeSet = () => {
    const { courseProduct } = this.props;
    if (courseProduct.alias && courseProduct.rewardNode && courseProduct.rewardNode.length) {
      if (courseProduct.rewardNode.filter(item => (
        item.rewardNodeType === 3
      )).length) {
        return true;
      }
    }
    return false;
  }

  render() {
    const { label, courseProduct, rewardNode, endRewardType, ...props } = this.props;
    return (
      <Field
        label={label}
        name='endRewardType'
        value={endRewardType}
        component={component}
        courseProduct={courseProduct}
        rewardNodeType={rewardNode.rewardNodeType}
        className={cx([
          'end-reward-field',
          {
            hide: courseProduct.courseName === '' || rewardNode.rewardNodeType !== 3 || this.isEndNodeSet(),
          },
        ])}
        {...props}
      ></Field>
    );
  }
};

export default EndRewardRelatedWrap;
