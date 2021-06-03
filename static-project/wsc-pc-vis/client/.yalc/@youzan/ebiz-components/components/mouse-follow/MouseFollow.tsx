import React, { Component, MouseEventHandler } from 'react';
import Pop from './Pop';

import { IMouseFollowProps } from './types';

interface IMouseFollowState {
  showPop: boolean;
  top: number;
  left: number;
}

export default class MouseFollow extends Component<
  IMouseFollowProps,
  IMouseFollowState
> {
  state = {
    showPop: false,
    top: 0,
    left: 0
  };

  onMouseEnter: MouseEventHandler = () => {
    this.setState({
      showPop: true
    });
  };

  onMouseLeave: MouseEventHandler = () => {
    this.setState({
      showPop: false
    });
  };

  onMouseMove: MouseEventHandler = e => {
    this.setState({
      top: e.pageY,
      left: e.pageX
    });
  };

  render() {
    const { popContent, position, children, cushion } = this.props;
    const { showPop, top, left } = this.state;

    return (
      <div
        className="ebiz-mouse-follow"
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onMouseMove={this.onMouseMove}
      >
        {showPop && (
          <Pop top={top} left={left} position={position} cushion={cushion}>
            {popContent}
          </Pop>
        )}
        {children}
      </div>
    );
  }
}
