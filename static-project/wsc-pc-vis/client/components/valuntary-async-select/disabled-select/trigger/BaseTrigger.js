/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { Icon } from 'zent';
import React, { PureComponent } from 'react';

class SelectTrigger extends PureComponent {
  handleReset = evt => {
    evt.stopPropagation();
    const { onReset } = this.props;
    if (onReset) onReset(evt);
  }

  render() {
    const { prefixCls, onClick, text, value, placeholder, hideClose, disabled, contentVisible } = this.props;

    let TriggerIcon = null;

    if (value && !hideClose) {
      TriggerIcon = <Icon type="close-circle" className={ `close-btn close ${disabled ? 'close-disabled' : ''}` } onClickCapture={this.handleReset} />;
    } else {
      TriggerIcon = <div className={`caret-down select ${contentVisible ? 'visible' : ''}`} onClick={onClick} />;
    }

    return (
      <div className={`${prefixCls}-text no-after`} onClick={onClick}>
        {text || <span className={`${prefixCls}-placeholder`}>{placeholder}</span>}
        <div className={`icon-box ${text && !hideClose ? '' : 'no-hide'}`}>
          {TriggerIcon}
        </div>
      </div>
    );
  }
}

SelectTrigger.propTypes = {
  prefixCls: PropTypes.string,
  value: PropTypes.any,
  text: PropTypes.any,
  placeholder: PropTypes.string,
};

export default SelectTrigger;
