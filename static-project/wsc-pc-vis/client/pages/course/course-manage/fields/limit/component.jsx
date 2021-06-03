
import { Pop, Form } from '@zent/compat';
import React, { Component } from 'react';
import { NumberInput, Input, Checkbox } from 'zent';

const { getControlGroup } = Form;

class LimitComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: props.value > 0,
      isInit: true,
    };
  }

  // 在获取到表单数据初始化时调用一次init更新勾选状态
  componentDidUpdate(prevProps, prevState) {
    if (this.props.value === prevProps.value || !this.state.isInit) return;
    this.init();
  }

  init() {
    const isLimited = this.props.value > 0;
    this.setState({ checked: isLimited, isInit: false });
  }

  onCheckChange = evt => {
    const { checked } = evt.target;

    this.setState({ checked, isInit: false }); // 创建时没有init，在勾选启用限购时关闭init状态
    this.props.onChange(checked ? '' : null); // null为未勾选限购，空字符串为勾选但空输入
  };

  onInputChange = evt => {
    this.props.onChange(evt === null ? '' : evt);
  };

  render() {
    const { value, disabled, disabledMsg } = this.props;
    const { checked } = this.state;
    return (
      <div className="limit-type-group">
        <Checkbox
          checked={checked}
          disabled={disabled}
          onChange={this.onCheckChange}
        />
        <span>限制每人终身可购买</span>
        {
          disabled ? (
            <Pop
              position="top-left"
              trigger="hover"
              content={disabledMsg}>
              <Input
                className="limit-type-group__input"
                value={value}
                disabled
              />
            </Pop>
          ) : (
            <NumberInput
              className="limit-type-group__input"
              value={value === '' ? null : value}
              onChange={this.onInputChange}
              integer
              disabled={!checked}
            />
          )
        }
        <span>次</span>
      </div>
    );
  }
}

export default getControlGroup(LimitComponent);
