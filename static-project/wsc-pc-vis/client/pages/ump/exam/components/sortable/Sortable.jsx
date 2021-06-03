import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import sortableJS from 'sortablejs';
import isFunction from 'lodash/isFunction';
import { reorder } from './utils';
import { chainSupportHqAndSingle } from '../../chain';

let instanceEl;
export default class Sortable extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    prefix: PropTypes.string,
    items: PropTypes.array,
    onChange(props, propName, componentName) {
      if ((props.items && !props[propName]) || (!props.items && props[propName])) {
        throw new Error('prop items and onChange must appear at the same time.');
      }
      if (props[propName] && !isFunction(props[propName])) {
        throw new Error(
          `Invalid prop ${propName} supplied to ${componentName}, expects a function.`,
        );
      }
    },
    tag: PropTypes.string,
    sort: PropTypes.bool,
    filterClass: PropTypes.string,
    group: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    delay: PropTypes.number,
    animation: PropTypes.number,
    handle: PropTypes.string,
    ghostClass: PropTypes.string,
    chosenClass: PropTypes.string,
    dragClass: PropTypes.string,
    forceFallback: PropTypes.bool,
    fallbackClass: PropTypes.string,
    fallbackOnBody: PropTypes.bool,
    fallbackTolerance: PropTypes.number,
    scroll: PropTypes.bool,
    scrollFn: PropTypes.func,
    scrollSensitivity: PropTypes.number,
    scrollSpeed: PropTypes.number,
    setData: PropTypes.func,
    onStart: PropTypes.func,
    onEnd: PropTypes.func,
    onAdd: PropTypes.func,
    onUpdate: PropTypes.func,
    onSort: PropTypes.func,
    onRemove: PropTypes.func,
    onFilter: PropTypes.func,
    onMove: PropTypes.func,
    onClone: PropTypes.func,
    options: PropTypes.object,
    children: PropTypes.any,
  };

  static defaultProps = {
    prefix: 'zent',
    tag: 'div',
    sort: true,
  };

  sortable = null;

  initSortable = instance => {
    const { prefix, onMove, onEnd, onChange, filterClass, ...rest } = this.props;

    if (!instance) {
      return;
    }

    const sortableOptions = {
      filter: filterClass ? `.${filterClass}` : '',
      ghostClass: `${prefix}-ghost`,
      chosenClass: `${prefix}-chosen`,
      dragClass: `${prefix}-drag`,
      fallbackClass: `${prefix}-fallback`,
      onMove: e => {
        if (onMove) {
          return onMove(e);
        }

        return e.related.className !== filterClass;
      },
      onEnd: e => {
        const { items } = this.props;

        onEnd && onEnd(e);

        if (!items) {
          return;
        }

        const { oldIndex, newIndex } = e;
        const newItems = reorder(items, oldIndex, newIndex);

        onChange && onChange(newItems);
      },
      ...rest,
    };

    this.sortable = sortableJS.create(instance, sortableOptions);
  };

  componentWillUnmount() {
    if (this.sortable) {
      this.sortable.destroy();
      this.sortable = null;
    }
  }

  componentDidMount() {
    if (chainSupportHqAndSingle) {
      this.sortable = this.initSortable(instanceEl);
    }
    if (this.props.sort === false) {
      this.sortable = null;
    }
  }

  render() {
    const { prefix, className, children, tag: Com } = this.props;
    const classString = cx(`${prefix}-sortable`, className);

    return (
      <Com
        ref={instance => {
          instanceEl = instance;
        }}
        className={classString}
      >
        {children}
      </Com>
    );
  }
}
