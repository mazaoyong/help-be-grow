import React, { Component } from 'react';
import { Select } from 'zent';
import { Form } from '@zent/compat';
import omit from 'lodash/omit';

const { getControlGroup, unknownProps } = Form;

class FilterSelect extends Component {
  render() {
    const passableProps = omit(this.props, unknownProps);
    return <Select {...passableProps} />;
  }
}

const FilterSelectField = getControlGroup(FilterSelect);

export default FilterSelectField;
