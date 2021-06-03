
import { Form } from '@zent/compat';
/**
 * 商品标题
 */
import React, { Component } from 'react';
import { Input } from 'zent';
// import Env from '../../../../common/env';
import PopWrapper from '../../components/pop-wrapper';

const { getControlGroup } = Form;

class TitleFieldComponent extends Component {
  render() {
    return (
      <span>
        <PopWrapper trigger="hover" position="top-left">
          <Input
            className="input-large"
            // readOnly={Env.isReadOnly('title')}
            value={this.props.value}
            placeholder="请输入线下课名称"
            onChange={this.props.onChange}
            onBlur={this.props.onChange}
          />
        </PopWrapper>
      </span>
    );
  }
}

export default getControlGroup(TitleFieldComponent);
