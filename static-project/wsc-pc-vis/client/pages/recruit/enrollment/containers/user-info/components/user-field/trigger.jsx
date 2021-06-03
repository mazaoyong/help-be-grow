import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { Icon } from 'zent';

export default class Trigger extends PureComponent {
  handleChange = e => {
    if (e.target.value.length > 20) {
      return;
    }
    this.props.onChange({
      keyword: e.target.value,
    });
  };

  handleClear = e => {
    this.props.onChange({
      keyword: '',
      visible: false,
    });
  };

  render() {
    const { className, placeholder, keyword, disabled, onBlur, onClick, injectRef } = this.props;
    const rootClass = classnames({
      [className]: Boolean(className),
      'zent-input': true,
      'edu-enrollment-user-trigger-disabled': disabled,
    });
    return (
      <div className="edu-enrollment-user-trigger zent-input-wrapper zent-input--size-normal" ref={injectRef}>
        <input
          type="text"
          className={rootClass}
          placeholder={placeholder}
          value={keyword}
          onClick={onClick}
          onBlur={onBlur}
          onChange={this.handleChange}
        />
        {(!disabled && keyword) ? <Icon type="close-circle-o" onClick={this.handleClear} /> : null}
      </div>
    );
  }
}
