
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import WindowEventHandler from './WindowEventHandler';

function getViewportSize() {
  const doc = document.documentElement;
  return {
    width: Math.max(doc.clientWidth, window.innerWidth || 0),
    height: Math.max(doc.clientHeight, window.innerHeight || 0),
  };
}

export default class WindowResizeHandler extends PureComponent {
  static propTypes = {
    onResize: PropTypes.func.isRequired,
  };

  onResize = evt => {
    const viewportSize = getViewportSize();

    if (!this._prevViewportSize) {
      this._prevViewportSize = viewportSize;
    }

    const prevViewportSize = this._prevViewportSize;
    const delta = {
      deltaX: viewportSize.width - prevViewportSize.width,
      deltaY: viewportSize.height - prevViewportSize.height,
    };

    if (delta.deltaX === 0 && delta.deltaY === 0) {
      return;
    }

    this.props.onResize(evt, delta);
    this._prevViewportSize = viewportSize;
  };

  componentDidMount() {
    this._prevViewportSize = getViewportSize();
  }

  render() {
    return <WindowEventHandler eventName="resize" callback={this.onResize} />;
  }
}
