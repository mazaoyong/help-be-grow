
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import { Radio, Input, NumberInput } from 'zent';
import classnames from 'classnames';

import ColumnSelect from '../column/ColumnSelect';
import ColumnTable from '../column/ColumnTable';

const { getControlGroup } = Form;
const RadioGroup = Radio.Group;

class Participate extends Component {
  state = {
    selectVisible: false,
  };

  handleDialogChange = visible => {
    if (this.props.disabled) {
      return;
    }
    this.setState({
      selectVisible: visible,
    });
  };

  // 单选框改变事件
  onRadioChange = evt => {
    this.onPropsChange({
      way: evt.target.value,
    });
  };

  onColumnDelete = () => {
    if (this.props.disabled) {
      return;
    }
    this.onPropsChange({ columnAlias: '' });
    this.onPropsBlur({ columnAlias: '' });
  };

  onCloumnChange = alias => {
    this.setState({
      selectVisible: false,
    });
    this.onPropsChange({ columnAlias: alias });
    this.onPropsBlur({ columnAlias: alias });
  };

  onPropsChange = obj => {
    this.props.onChange(obj, { merge: true });
  };

  onPropsBlur = obj => {
    this.props.onBlur(obj, { merge: true });
  };

  render() {
    const { disabled } = this.props;
    const { way, price, password, passwordCopy, columnAlias } = this.props.value;

    const chooseClass = classnames('choose-link', 'punch_choose-link-wrapper', {
      'cursor-link': !disabled,
      gray: disabled,
    });

    return (
      <div>
        <RadioGroup
          name="participate"
          disabled={disabled}
          value={way}
          onChange={evt => this.onRadioChange(evt)}
        >
          <Radio value={1}>免费参加</Radio> <br />
          <Radio value={2}>付费参加</Radio> <br />
          {way === 2 && (
            <div className="price">
              <NumberInput
                className="price__input"
                key="price"
                addonBefore=" ¥ "
                width="120px"
                decimal={2}
                disabled={disabled}
                value={price}
                onChange={(value) => this.onPropsChange({ price: value })}
                onBlur={(evt) => this.onPropsChange({ price: evt.target.value })}
              />
              {/* <span className="price__desc">iOS环境的小程序会封杀虚拟商品，请谨慎选择</span> */}
              <br />
            </div>
          )}
          <Radio value={3}>购买专栏参加</Radio>
          <br />
          {way === 3 && (
            <div>
              <a
                className={chooseClass}
                href="javascript:void(0);"
                onClick={() => {
                  this.handleDialogChange(true);
                }}
              >
                选择专栏
              </a>
              <ColumnSelect
                selected={columnAlias}
                visible={this.state.selectVisible}
                onSubmit={alias => {
                  this.onCloumnChange(alias);
                }}
              />

              {columnAlias !== '' && (
                <ColumnTable
                  alias={columnAlias}
                  disabled={disabled}
                  onDelete={() => {
                    this.onColumnDelete();
                  }}
                />
              )}
            </div>
          )}
          <Radio value={4}>输入密码参加</Radio> <br />
          {way === 4 && (
            <div className="pwd">
              <div className="input-wrapper">
                <label>设置密码</label>
                <Input
                  placeholder="最多8个字符"
                  maxLength={8}
                  disabled={disabled}
                  value={password}
                  onChange={evt => this.onPropsChange({ password: evt.target.value })}
                />
              </div>
              <div className="input-wrapper">
                <label>默认文案</label>
                <Input
                  placeholder="最多20个字符"
                  maxLength={20}
                  disabled={disabled}
                  value={passwordCopy}
                  onChange={evt => this.onPropsChange({ passwordCopy: evt.target.value })}
                />
              </div>
            </div>
          )}
        </RadioGroup>
      </div>
    );
  }
}

export default getControlGroup(Participate);
