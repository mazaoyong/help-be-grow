
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { RegionSelect } from '@youzan/react-components';
import omit from 'lodash/omit';

const { getControlGroup, unknownProps } = Form;

class SelectRegion extends Component {
  render() {
    const passableProps = omit(this.props, unknownProps);
    return <RegionSelect {...passableProps} value={passableProps.value.area} />;
  }
}

export default getControlGroup(SelectRegion);
