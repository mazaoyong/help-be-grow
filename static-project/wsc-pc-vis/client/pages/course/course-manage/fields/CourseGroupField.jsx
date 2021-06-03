
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import component from '../../group/components/CourseGroupFieldComp';
import cx from 'classnames';
import Env from '../common/env';
import '../../group/components/CourseGroupField.scss';

const { Field } = Form;

export default class CourseGroupField extends Component {
  render() {
    const { label, groups, defaultGroupsOptions } = this.props;
    return (
      <Field
        name="groups"
        label={label}
        groups={defaultGroupsOptions}
        component={component}
        value={groups || []}
        className={cx('course-group-field', { hide: Env.isBaseChildFold() })}
      />
    );
  }
}
