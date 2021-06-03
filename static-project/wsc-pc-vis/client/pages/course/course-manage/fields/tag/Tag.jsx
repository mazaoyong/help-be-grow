
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import cx from 'classnames';
import Env from '../../common/env';
import component from './component';

const { Field } = Form;

export default class TagWrap extends Component {
  render() {
    const { label, tagList } = this.props;
    return (
      <Field
        name="tagList"
        label={label}
        className={cx({ hide: Env.isBaseChildFold() })}
        component={component}
        value={tagList}
        maxAmount={6}
        validations={{
          max(_, value) {
            return value.length <= 6;
          },
        }}
        validationErrors={{
          max: '最多可以选择6个标签',
        }}
      />
    );
  }
}
