
import { Form } from '@zent/compat';
import React from 'react';
import component from './component';
import { BRANCH_STORE_NAME } from 'constants/chain';
import './index.scss';

const { Field } = Form;

/**
     * 教务课程页校区选择器
     *
     * @param {applicableCampusList：Array, applicableCampusType: Boolean} shopInfo applicableCampusList为table显示数据，applicableCampusType为是否选择全部校区：1为全部，0为选择校区
     * @param {boolean} isEdit 页面是否为回显详情页
     * @param {number} id 课程ID
     * @return {Field}
     */
function SchoolSelectorWrap(props) {
  const { shopInfo, isEdit = false, id, label = '上课校区:', validations = null, isCheckRemove = true, ...otherProps } = props;
  return <Field
    name='shopInfo'
    label={label}
    className = 'educourse-choose-school'
    value = {shopInfo}
    isEdit={isEdit}
    isCheckRemove={isCheckRemove}
    id={id}
    component={component}
    validations={validations || defaultValidations()}
    {...otherProps}
  >
  </Field>;
}

function defaultValidations() {
  const validations = {};
  validations['required'] = (_, value) => {
    if (!value || (!value.applicableCampusType && !value.applicableCampusList.length)) {
      return `请选择${BRANCH_STORE_NAME}`;
    }
    return true;
  };
  return validations;
}

export default SchoolSelectorWrap;
