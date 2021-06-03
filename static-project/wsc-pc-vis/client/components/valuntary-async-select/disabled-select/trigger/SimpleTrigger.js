/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

class SimpleTrigger extends PureComponent {
  render() {
    const { prefixCls, onClick } = this.props;

    return (
      <div className={`${prefixCls}-simple`} onClick={onClick}>
        {this.props.text || (
          <span className={`${prefixCls}-placeholder`}>{this.props.placeholder}</span>
        )}
      </div>
    );
  }
}

SimpleTrigger.propTypes = {
  prefixCls: PropTypes.string,
  value: PropTypes.any,
  text: PropTypes.any,
  placeholder: PropTypes.string,
};

export default SimpleTrigger;
