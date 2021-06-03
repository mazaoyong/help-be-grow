import { Select } from '@zent/compat';
import React, { Component, Fragment } from 'react';
import cx from 'classnames';
import { Input } from 'zent';
import './style.scss';

const phoneType = [{ value: 1, text: '手机' }, { value: 2, text: '座机' }];

class ContactPhone extends Component {
  handleChange = e => {
    const value = this.props.value;
    const newValue = Object.assign({}, value, {
      [e.target.name]: e.target.value,
    });
    this.props.onChange(newValue);
  };

  render() {
    const props = this.props;
    const { value, displayError } = props;
    const showError =
      displayError === undefined ? props.isDirty && props.errors.length > 0 : displayError;
    const groupClass = cx('contact-phone-field', 'zent-form__control-group', {
      'has-error': showError,
    });
    return (
      <div className={groupClass}>
        <label className="zent-form__control-label">联系方式：</label>
        <div className="zent-form__controls contact-phone-field__control">
          <Select
            className="contact-phone-field__select"
            value={value.phoneType}
            data={phoneType}
            name="phoneType"
            onChange={this.handleChange}
          />
          <div className="zent-form__controls">
            <div className="flex-center">
              {value.phoneType === 1 ? (
                <Input name="mobile" onChange={this.handleChange} value={value.mobile} />
              ) : (
                <Fragment>
                  <Input
                    className="contact-phone-field__input contact-phone-field__input--short"
                    placeholder="区号"
                    name="telAreaCode"
                    value={value.telAreaCode}
                    onChange={this.handleChange}
                  />
                  <span className="separator">-</span>
                  <Input
                    className="contact-phone-field__input"
                    placeholder="座机号码"
                    name="telLandline"
                    value={value.telLandline}
                    onChange={this.handleChange}
                  />
                </Fragment>
              )}
            </div>
            {showError && <p className="zent-form__error-desc">{props.errors.join(' ')}</p>}
          </div>
        </div>
      </div>
    );
  }
}

export default ContactPhone;
