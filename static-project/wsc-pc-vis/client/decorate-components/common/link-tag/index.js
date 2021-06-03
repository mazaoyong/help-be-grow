import React, { Component } from 'react';
import cx from 'classnames';
import Icon from '../icon';
import bem from '../../utils/bem';
import './style/index.scss';

const b = bem('deco-link-tag');
export default class LinkTag extends Component {
  handleActionClick = ev => {
    const { index } = ev.currentTarget.dataset;
    const { onActionClick } = this.props;

    onActionClick && onActionClick(index);
  };

  renderContent() {
    const { url, type, children } = this.props;
    const NodeName = url ? 'a' : 'div';
    let linkProps = {};

    if (url) {
      linkProps = {
        href: url,
        target: '_blank',
        rel: 'noopener noreferrer',
      };
    }

    return (
      <NodeName className={b('content')} {...linkProps}>
        {type && `${type} | `}
        {children}
      </NodeName>
    );
  }

  renderActions() {
    const { actions = [], onEdit, onClose } = this.props;

    if (actions && actions.length) {
      return actions.map((action, index) => (
        <span
          key={index}
          className={b('action')}
          data-index={index}
          onClick={this.handleActionClick}
        >
          {action}
        </span>
      ));
    }

    return (
      <>
        {onEdit && (
          <div className={b('edit')} onClick={onEdit}>
            {<Icon type="edit" />}
          </div>
        )}
        {onClose && (
          <div className={b('close')} onClick={onClose}>
            {<Icon type="delete" />}
          </div>
        )}
      </>
    );
  }

  render() {
    const { icon, url, className, style = {}, colored } = this.props;
    const cls = cx(b(), className, {
      [b('', 'colored')]: colored,
      [b('', 'linkable')]: url,
    });

    return (
      <div className={cls} style={style}>
        {icon && <Icon className={b('prefix-icon')} type={icon} />}
        {this.renderContent()}
        {this.renderActions()}
      </div>
    );
  }
}
