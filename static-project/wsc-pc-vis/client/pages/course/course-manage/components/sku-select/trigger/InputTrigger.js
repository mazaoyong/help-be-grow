import PropTypes from 'prop-types';
import React, { Component } from 'react';
import trim from 'lodash/trim';

class InputTrigger extends Component {
  state = {
    value: '',
  };

  componentDidMount() {
    this.props.onChange({
      extraFilter: true,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.value !== this.state.value;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.keyword === null ? nextProps.value : nextProps.keyword,
    });
  }

  inputChangeHandler = evt => {
    this.props.onChange({
      keyword: trim(evt.target.value),
    });
  };

  handleKeyDown = evt => {
    if (evt.keyCode === 13 || evt.keyCode === 9) {
      evt.target.blur();
    }
  };

  handleInputBlur = evt => {
    let relatedTarget = evt.relatedTarget;
    let needChange = true;

    if (
      relatedTarget &&
      relatedTarget.classList &&
      relatedTarget.classList.contains('zent-select-popup')
    ) {
      needChange = false;
    }
    if (needChange) {
      this.props.onTriggerBlur({
        keyword: trim(evt.target.value),
      });
    }
  };

  render() {
    const { prefixCls, placeholder, keyword, text, disabled, maxLength } = this.props;
    const isEmpty = keyword === null && text === '';
    const showText = keyword === null ? text : keyword;

    return (
      <input
        ref={input => (this.input = input)}
        className={`${prefixCls}-input`}
        placeholder={placeholder}
        type="text"
        value={showText}
        title={showText}
        onChange={this.inputChangeHandler}
        onClick={this.props.onClick}
        onKeyDown={this.handleKeyDown}
        onBlur={this.handleInputBlur}
        disabled={disabled}
        autoFocus={isEmpty}
        maxLength={maxLength}
      />
    );
  }
}

InputTrigger.propTypes = {
  prefixCls: PropTypes.string,
  value: PropTypes.any,
  placeholder: PropTypes.string,
};

export default InputTrigger;
