
import { Form } from '@zent/compat';
import React, { FC, useCallback } from 'react';
import component, { IMentionedParams } from './component';
import backgroundComponent from './background-component';
import './index.scss';

const { Field } = Form;

const MentionedFieldWrap: FC<IMentionedParams> = (props) => {
  const { type, isBackground, ...otherProps } = props;
  const getValidations = useCallback(() => {
    let validation = {};
    if (type === 1) {
      validation = {
        required: (_, value) => {
          if (!value || value.length === 0) {
            return '请选择被点评学员';
          }
          return true;
        },
      };
    }
    return validation;
  }, []);

  return <Field
    type={type}
    required={!isBackground}
    name="mentionedUsers"
    className="mentioned-students-wrap"
    label="点评学员："
    component={type === 2 ? backgroundComponent : component}
    validateOnChange={false}
    validateOnBlur={false}
    validations={getValidations()}
    {...otherProps}
  />;
};

export default MentionedFieldWrap;
