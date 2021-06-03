
import { Form } from '@zent/compat';
import React, { Component, PureComponent } from 'react';
import component from './component';
import cx from 'classnames';
import { createCustomStocks } from './init-stock-data';
import './index.scss';
const { Field } = Form;

export default class CourseTypeDetail extends (PureComponent || Component) {
  getInitStock = () => {
    const { sellStocks } = this.props;
    return sellStocks && sellStocks.length ? sellStocks : createCustomStocks();
  };

  render() {
    const { courseType, courseSellType, ...props } = this.props;
    return (
      <Field
        name="sellStocks"
        component={component}
        courseSellType={courseSellType}
        courseType={courseType}
        value={this.getInitStock()}
        {...props}
        required
        className={cx([
          'stock-field',
          {
            hide: courseType === 0 || courseSellType === 0,
          },
        ])}
      />
    );
  }
}
