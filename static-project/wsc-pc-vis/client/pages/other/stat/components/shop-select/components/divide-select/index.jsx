import cn from 'classnames';
import React from 'react';
import isEqual from 'lodash/isEqual';

export default class DivideSelect extends React.Component {
  static defaultProps = {
    items: [],
  };

  isItemActive(item) {
    const { metaInfo, kdtId } = this.props;
    return item.kdtId === kdtId && isEqual(item.metaInfo, metaInfo);
  }

  hasActiveItem() {
    const { items = [] } = this.props;
    return items.some(item => this.isItemActive(item));
  }

  renderDivideItem = (item) => {
    const active = this.isItemActive(item);
    const cls = cn('stat-shop-select__divide-item', { active });
    return (
      <div
        key={item.text}
        className={cls}
        onClick={() => this.props.onChange(item.kdtId, item.metaInfo)}
      >
        {item.text}
      </div>
    );
  };

  renderChildren() {
    const { children } = this.props;

    if (!children) {
      return;
    }

    const hasActiveItem = this.hasActiveItem();
    const childrenWrapCls = cn('stat-shop-select__divide-item', { active: !hasActiveItem });

    return <div className={childrenWrapCls}>{children}</div>;
  }

  render() {
    const { items = [] } = this.props;
    return (
      <div className="stat-shop-select__divide-select">
        {items.map(this.renderDivideItem)}
        {this.renderChildren()}
      </div>
    );
  }
}
