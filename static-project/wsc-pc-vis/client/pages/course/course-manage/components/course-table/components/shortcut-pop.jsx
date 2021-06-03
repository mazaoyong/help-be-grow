import { Pop } from '@zent/compat';
import React from 'react';
import { Input } from 'zent';
import accMul from 'zan-utils/number/accMul.js';
import format from '@youzan/utils/money/format';

import QuickEditSku from './quick-edit-sku';

import '../style.scss';

class ShortCutPop extends React.Component {
  static defaultProps = {
    onOk: () => {},
    onCancel: () => {},
    onShow: () => {},
    onClose: () => {},
    defaultValue: '',
    width: null,
    type: 'text',
    name: null,
    index: -1,
    productAlias: '',
    // 是否是多规格的信息
    useSku: false,
    // 有多少sku，这个在quick-edit-sku组件中作为一个数据处理的依据
    skuSize: 0,
    // 是否是必填，在onChange阶段检验
    required: false,
  };

  state = {
    value: this.props.defaultValue,
    isValid: true,
  };

  submitQuickEdit() {
    const { name, index, onOk, pop, useSku, skuSize, type } = this.props;
    const { value, isValid } = this.state;
    if (isValid) {
      const _value =
        useSku && !skuSize
          ? [{ [name]: type === 'currency' ? accMul(Number(value), 100) : value }]
          : value;
      onOk(name, index, _value, useSku);
      pop.close();
    }
  }

  terminateSubmit() {
    const { name, index, onCancel, pop } = this.props;
    onCancel(name, index);
    pop.close();
  }

  handleChange(e) {
    const { type, validate, maxLength, required } = this.props;
    let userInput = e.target.value;
    let isValid = this.state.isValid;
    if (this.state.value === '' && userInput !== '') {
      isValid = true;
    }
    if (validate) {
      isValid = validate(userInput);
    }
    if (type === 'currency' || type === 'number') {
      // 如果是货币类型，就需要比对是否是数字
      isValid = !isNaN(userInput) && isValid;
      if (isValid && userInput) {
        userInput = +format(userInput, false, false);
      }
    }
    if (required) {
      if (userInput === '') {
        isValid = false;
      }
    }
    if (maxLength && userInput.length > maxLength) return void 0;
    this.setState({ value: userInput, isValid });
  }

  render() {
    const { useSku, skuSize, type, width, disabled } = this.props;
    const { value, isValid } = this.state;
    // 如果格式为货币形式，则展示为储存值的100分之一
    return (
      <div className="shortcut-pop__container">
        {useSku && skuSize > 0 ? (
          <QuickEditSku
            {...this.props}
            disabled={disabled}
            submitQuickEdit={this.submitQuickEdit}
            terminateSubmit={this.terminateSubmit}
            onChange={value => this.setState({ value })}
            onPressEnter={this.submitQuickEdit.bind(this)}
          />
        ) : (
          <>
            <Input
              autoFocus
              value={value}
              width={width || 80}
              disabled={disabled}
              className={`${!isValid ? 'input-disable' : ''}`}
              type={type === 'currency' ? 'number' : type}
              onChange={this.handleChange.bind(this)}
              onPressEnter={this.submitQuickEdit.bind(this)}
            />
            <section className="shortcut-pop__container-action">
              {!disabled && <><span
                className={`course-table__body__actions__textBtn${!isValid ? ' disable' : ''}`}
                onClick={this.submitQuickEdit.bind(this)}
              >
                保存
              </span>
              |</>}
              <span
                className="course-table__body__actions__textBtn"
                onClick={this.terminateSubmit.bind(this)}
              >
                取消
              </span>
            </section>
          </>
        )}
      </div>
    );
  }
}

export default Pop.withPop(props => {
  return <ShortCutPop {...props} />;
});
