import React, { PureComponent, isValidElement } from 'react';
// @ts-ignore
import { checkAccess } from '@youzan/sam-components';

import './styles.scss';

export default class LinkGroup extends PureComponent<{data: any}> {
  render() {
    const { data } = this.props;
    return <span className="edu-link-group">{this.renderChildren(data)}</span>;
  }
  renderChildren = (data: any[]) => {
    return data.map((item, index) => {
      // 如果是react node就直接渲染
      if (isValidElement(item)) {
        return item;
      }
      const itemProps: any = {};
      if (item.samName && !checkAccess(item.samName)) {
        return item.text;
      }
      if (item.href) {
        itemProps.href = item.href;
      }
      if (item.targetBlank) {
        itemProps.target = '_blank';
        itemProps.rel = 'noopener noreferrer';
      }
      if (item.onClick) {
        itemProps.href = 'javascript: void(0);';
        itemProps.onClick = item.onClick;
      }
      return (
        <a key={index} {...itemProps}>
          {item.text}
        </a>
      );
    });
  };
}
