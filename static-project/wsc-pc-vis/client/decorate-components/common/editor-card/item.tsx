import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Icon } from 'zent';
import bem from '../../utils/bem';

import './style/item.scss';
import { IEditorItemProps, IEditorItemState } from './type';

const b = bem('deco-editor-card-item');

export default class EditorCardItem extends React.Component<IEditorItemProps, IEditorItemState> {
  static propTypes = {
    // 子组件
    children: PropTypes.node.isRequired,
    // 组件所在位置的下标
    index: PropTypes.number.isRequired,
    // 是否可拖拽
    canDrag: PropTypes.bool,
    // 是否可删除
    canDelete: PropTypes.bool.isRequired,
    // 删除组件的回调函数
    onDelete: PropTypes.func.isRequired,
    // 禁止拖拽的类名
    filterClass: PropTypes.string,
  };

  state = {
    overInput: false,
  };

  instance: HTMLElement | undefined;

  componentDidMount() {
    this.attachEventListeners();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.index !== this.props.index) {
      this.detachEventListeners();
      this.attachEventListeners();
    }
  }

  componentWillUnmount() {
    this.detachEventListeners();
  }

  attachEventListeners = () => {
    if (this.instance) {
      this.getInputElements(this.instance).forEach(el => {
        el.addEventListener('mouseenter', this.handleMouseEnter);
        el.addEventListener('mouseleave', this.handleMouseLeave);
      });
    }
  };

  detachEventListeners = () => {
    if (this.instance) {
      this.getInputElements(this.instance).forEach(el => {
        el.removeEventListener('mouseenter', this.handleMouseEnter);
        el.removeEventListener('mouseleave', this.handleMouseLeave);
      });
    }
  };

  getInputElements = (node: HTMLElement) => {
    return node ? Array.from(node.getElementsByTagName('input')) : [];
  };

  handleMouseEnter = () => {
    this.setState({ overInput: true });
  };

  handleMouseLeave = () => {
    this.setState({ overInput: false });
  };

  handleDeleteItem = () => {
    const { index, onDelete } = this.props;
    onDelete(index);
  };

  render() {
    const { children, canDrag, canDelete, filterClass } = this.props;
    const { overInput } = this.state;

    return (
      <div
        className={cx(b(), { [filterClass]: !canDrag || overInput })}
        ref={el => {
          el && (this.instance = el);
        }}
      >
        {children}
        {canDelete && (
          <Icon className={b('delete')} type="close-circle" onClick={this.handleDeleteItem} />
        )}
      </div>
    );
  }
}
