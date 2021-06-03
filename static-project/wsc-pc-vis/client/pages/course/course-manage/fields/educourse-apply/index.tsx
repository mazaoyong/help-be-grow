import React, { FC, useMemo } from 'react';
import { Form } from '@zent/compat';
import { IEduCourseApplyProps } from './types';
import EduCourseApplyField from './components';
import get from 'lodash/get';
import cx from 'classnames';
import VersionWrapper from 'fns/version';
import './index.scss';

const { Field } = Form;

const EduCourseApplyWrapper: FC<IEduCourseApplyProps> = (props) => {
  const { applyCourse, ...restProps } = props;
  const getRequiredValidation = useMemo(() => {
    const { courseType, applyCourse = {} } = props;
    let validations = {};
    if (courseType !== 0 && applyCourse.applyCourseType !== 1 && applyCourse.isRelatedEduCourse) {
      validations['required'] = (_, value) => {
        if (!get(value, 'eduCourse.id')) {
          return '请选择关联课程';
        }
        return true;
      };
    }
    return validations;
  }, [props]);

  return <Field
    {...restProps}
    name='applyCourse'
    component={EduCourseApplyField}
    value={applyCourse}
    disabled={props.disabled || (!props.isFromOldCustomer && props.isEdit)}
    validations={VersionWrapper({
      name: 'course-manage-applycourse-validation',
      children: getRequiredValidation,
    })}
    className={cx({
      hide: (props.className && props.className.includes('hide')) || props.courseType === 0,
    })}
  />;
};

export default EduCourseApplyWrapper;
