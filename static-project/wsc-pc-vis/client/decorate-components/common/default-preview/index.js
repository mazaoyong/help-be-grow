import React, { PureComponent, Component } from 'react';
import PropTypes from 'prop-types';
import ReactPreview from '../react-preview';

import './style/index.scss';

export default class DefaultPreview extends (PureComponent || Component) {
  static propTypes = {
    text: PropTypes.node,
    tip: PropTypes.string,
    className: PropTypes.string,
  };

  static defaultProps = {
    className: '',
    text: '',
    tip: '',
  };

  render() {
    const { text, tip } = this.props;
    return (
      <ReactPreview className="rc-design-component-default-preview">
        {text !== '' && tip !== '' ? (
          <div>
            <div className="rc-design-component-default-preview__title">{text}</div>
            <div className="rc-design-component-default-preview__tip">{tip}</div>
          </div>
        ) : (
          <div className="rc-design-component-default-preview__text">{text}</div>
        )}
      </ReactPreview>
    );
  }
}
