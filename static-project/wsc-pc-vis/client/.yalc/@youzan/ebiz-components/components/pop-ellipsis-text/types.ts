import React from 'react';
import { PopPositions } from 'zent';

export interface PopEllipsisTextProps {
  text: string;
  count?: number;
  defaultText?: string;
  tagName?: keyof HTMLElementTagNameMap;
  /** 是否通过渲染虚拟节点判断 */
  renderVirtualNode?: boolean;
  width?: number;
  style?: React.CSSProperties;
  selector?: string;
  position?: PopPositions;
  deferEllipsis?: boolean;
  nowarp?: boolean;
}
