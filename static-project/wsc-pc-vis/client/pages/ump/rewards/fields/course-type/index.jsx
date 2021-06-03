
import { Form } from '@zent/compat';
import React, { PureComponent } from 'react';
import component from './component.js';
import cx from 'classnames';
import './index.scss';
const { Field } = Form;

class CourseTypeWrap extends PureComponent {
  render() {
    const { label, courseProduct, courseType, awardType, ...props } = this.props;
    const value = (courseProduct.courseSellType % 3 === 0 || props.rewardNode.rewardNodeType === 3) ? 2 : courseType;
    return (
      <Field
        name='courseType'
        label={label}
        courseProduct={courseProduct}
        value={value}
        awardType={awardType}
        className={cx(['coursetype-wrap'], {
          hide: awardType !== 3,
        })}
        component={component}
        {...props}>
      </Field>
    );
  }
}

export default CourseTypeWrap;
