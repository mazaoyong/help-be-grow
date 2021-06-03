import React, { Component } from 'react';
import { NumberInput } from 'zent';
import { Form } from '@zent/compat';
import omit from 'lodash/omit';
import noop from 'lodash/noop';

const { getControlGroup, unknownProps } = Form;

class PackNumber extends Component {
  defaultProps = {
    onDelete: noop,
  };
  render() {
    const passableProps = omit(this.props, [...unknownProps, 'onDelete']);
    return (
      <div>
        共计{' '}
        <div style={{ display: 'inline-block' }}>
          <NumberInput min={1} width="80px" showStepper {...passableProps} />
        </div>{' '}
        件商品
        <a className="delete-pick-item" href="javascript:;" onClick={this.props.onDelete}>
          删除
        </a>
      </div>
    );
  }
}

const PackNumberField = getControlGroup(PackNumber);

export default PackNumberField;
