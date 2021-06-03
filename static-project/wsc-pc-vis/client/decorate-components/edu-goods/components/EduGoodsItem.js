import React, { PureComponent, Component } from 'react';

/**
 * 知识商品拖动项
 */
export default class KnowledgeItem extends (PureComponent || Component) {
  render() {
    const { title, shortenUrl, url } = this.props;
    return (
      <a
        className="knowledge-item"
        href={shortenUrl || url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {title}
      </a>
    );
  }
}
