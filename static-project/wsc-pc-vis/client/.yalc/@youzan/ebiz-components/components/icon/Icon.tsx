import React, { Component, CSSProperties } from 'react';

import { IIconProps } from './types';

export default class Icon extends Component<IIconProps, {}> {
  static defaultProps: Partial<IIconProps> = {
    size: 'inherit',
    color: 'inherit'
  };

  get xlinkHref() {
    return `#icon-${this.props.type}`;
  }

  get className() {
    if (this.props.className) {
      return 'ebiz-icon ' + this.props.className;
    }
    return 'ebiz-icon';
  }

  get style(): CSSProperties {
    const { size, color } = this.props;

    return {
      fontSize: size,
      color
    };
  }

  render() {
    return (
      <svg className={this.className} style={this.style} aria-hidden="true">
        <use xlinkHref={this.xlinkHref} />
      </svg>
    );
  }
}
