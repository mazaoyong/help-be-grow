import React, { Component } from 'react';
import { Form } from '@zent/compat';
import { RegionSelect } from '@youzan/react-components';
import { Popover } from 'zent';
import omit from 'lodash/omit';

const { getControlGroup } = Form;

interface IProps {
  onChange: (any) => void;
}

/**
 * 地址选择器field
 */
class RegionSelectWrap extends Component<ZENT_FIELD_COMP<IProps>> {
  handleChange = data => {
    this.props.onChange(data);
  };

  render() {
    const passableProps = omit(this.props, ['onChange']);
    return (
      <RegionSelect
        position={Popover.Position.AutoBottomLeft}
        onChange={this.handleChange}
        {...passableProps}
      />
    );
  }
}

// @ts-ignore
const RegionSelectField = getControlGroup(RegionSelectWrap);

export default RegionSelectField;
