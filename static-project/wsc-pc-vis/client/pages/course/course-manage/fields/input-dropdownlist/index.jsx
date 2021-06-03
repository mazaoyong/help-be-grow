import { Form } from '@zent/compat';
import React, { PureComponent, Component } from 'react';
import DropdownList from './component';
import './index.scss';
const { Field } = Form;

class DropdownListWrap extends (PureComponent || Component) {
  render() {
    const { ...props } = this.props;
    const timeListExpalin = unit => {
      const options = ['+N天', '至N月后同一天', '+90天*N', '至N年后同一天'];
      return `有效期=生效当天${options[+unit - 1]}（N=填写数量）`;
    };
    return (
      <div>
        <Field
          name={props.name}
          component={DropdownList}
          value={props.value}
          {...props}
          className={`dropdown-input-list ${props.className}`}
        />
        {
          props.courseSellType === 2 &&
          (<p className="dropdown-input-bottom-explain">{timeListExpalin(props.value?.unit || 1)}</p>)
        }
      </div>
    );
  }
}

export default DropdownListWrap;
