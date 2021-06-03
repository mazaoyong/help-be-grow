import React, { PureComponent } from 'react';
import { createPortal, findDOMNode } from 'react-dom';
import { PopPosition } from './types';

interface IPopProps {
  top: number;
  left: number;
  position: PopPosition;
  cushion?: {
    // 定位的偏移量
    top?: number;
    left?: number;
  };
}

export default class Pop extends PureComponent<IPopProps, {}> {
  private readonly el = document.createElement('div');
  private dom: Element = null as any;

  componentDidMount() {
    document.body.appendChild(this.el);
    this.dom = findDOMNode(this.refs.mousefollow_pop) as Element;
  }

  componentWillUnmount() {
    document.body.removeChild(this.el);
  }

  get childrenStyle() {
    if (this.dom && this.dom.getBoundingClientRect) {
      const rect = this.dom.getBoundingClientRect();
      const { width, height } = rect;
      return { width, height };
    }
    return { width: 0, height: 0 };
  }

  get style(): string {
    const { top, left, position, cushion = {} } = this.props;
    const { width, height } = this.childrenStyle;

    let topPosition = top;
    let leftPosition = left;

    switch (position) {
      case 'TopLeft':
        topPosition -= height - (cushion.top || 0);
        leftPosition -= width - (cushion.left || 0);
        break;
      case 'TopCenter':
        topPosition -= height - (cushion.top || 0);
        leftPosition -= width / 2 - (cushion.left || 0);
        break;
      case 'TopRight':
        topPosition -= height - (cushion.top || 0);
        leftPosition -= cushion.left || 0;
        break;
      case 'LeftCenter':
        topPosition -= height / 2 - (cushion.top || 0);
        leftPosition -= width - (cushion.left || 0);
        break;
      case 'RightCenter':
        topPosition -= height / 2 - (cushion.top || 0);
        leftPosition += cushion.left || 0;
        break;
      case 'BottomLeft':
        topPosition += cushion.top || 0;
        leftPosition -= width - (cushion.left || 0);
        break;
      case 'BottomCenter':
        topPosition += cushion.top || 0;
        leftPosition -= width / 2;
        break;
      case 'BottomRight':
        topPosition += cushion.top || 0;
        leftPosition += cushion.left || 0;
        break;
    }

    return `
      position: absolute;
      top: ${topPosition}px;
      left: ${leftPosition}px;
      z-index: 9999;
    `;
  }

  render() {
    this.el.style.cssText = this.style;
    return createPortal(
      <div ref="mousefollow_pop">{this.props.children}</div>,
      this.el
    );
  }
}
