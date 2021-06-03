import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { DropTarget, DragSource } from 'react-dnd';

import { Icon } from 'zent';
import { IEditorCardItemProps } from './type';

const ITEM = 'editorCardItem';
const preventDefault = e => e.preventDefault();

class EditorCardItem extends Component<IEditorCardItemProps> {
  static propTypes = {
    // 子组件
    children: PropTypes.node.isRequired,
    // 组件所在位置的下标
    index: PropTypes.number.isRequired,
    // 是否可拖拽
    isDragable: PropTypes.bool.isRequired,
    // 是否可删除
    canDelete: PropTypes.bool.isRequired,
    // 是否为行内样式
    isInline: PropTypes.bool,
    // 删除组件的回调函数
    onDelete: PropTypes.func.isRequired,
    // 拖拽时移动组件的回调函数
    onMove: PropTypes.func.isRequired,
  };

  componentWillUnmount() {
    this.detachEventListeners(this.node);
    this.node = undefined;
  }

  node: HTMLElement | Element | Text | undefined;

  state = { overInput: false };

  handleRef = instance => {
    const { overInput } = this.state;
    this.detachEventListeners(this.node);
    const node = findDOMNode(instance);
    node && (this.node = node);

    if (!overInput) {
      this.getInputElements(this.node).forEach(e => {
        e.addEventListener('mouseenter', this.onHoverOverInput);
      });
    } else {
      this.getInputElements(this.node).forEach(e => {
        e.addEventListener('mouseleave', this.onHoverOutOfInput);
      });
    }
  };

  // 获取input元素
  getInputElements(node) {
    return node
      ? Array.prototype.slice.call(node.getElementsByTagName('input')).filter(e => !e.readOnly)
      : [];
  }

  handleDeleteItem = () => {
    const { index, onDelete } = this.props;
    onDelete(index);
  };

  onHoverOverInput = () => {
    this.setState({ overInput: true });
  };

  onHoverOutOfInput = () => {
    this.setState({ overInput: false });
  };

  // remove input 上面的 mouseleave/mouseenter 事件
  detachEventListeners(node) {
    this.getInputElements(node).forEach(e => {
      e.removeEventListener('mouseleave', this.onHoverOutOfInput);
      e.removeEventListener('mouseenter', this.onHoverOverInput);
    });
  }

  render() {
    const {
      children,
      isDragging,
      connectDragSource,
      connectDropTarget,
      isInline,
      canDelete,
    } = this.props;
    const { overInput } = this.state;

    const cls = isInline ? 'rc-design-editor-card-item__inline' : 'rc-design-editor-card-item';

    const editorCardItemClass = cx(cls, {
      'rc-design-editor-card-item__no-icon': isDragging,
    });

    const style = {
      opacity: isDragging ? 0 : 1,
    };

    const element = (
      <div className={editorCardItemClass} style={style} ref={this.handleRef}>
        {children}
        {canDelete && !isDragging && (
          <Icon
            className="rc-design-editor-card-item-delete"
            type="close-circle"
            onClick={this.handleDeleteItem}
          />
        )}
      </div>
    );

    if (overInput) {
      return element;
    }

    return connectDragSource(connectDropTarget(element));
  }
}

const dndSource = {
  canDrag(props) {
    return props.isDragable;
  },

  // 拖拽的时候禁掉点击事件，拖动带链接的图片时会打开链接
  beginDrag(props, _monitor, component) {
    const node = findDOMNode(component);
    if (node) {
      node.addEventListener('click', preventDefault);
    }

    return {
      index: props.index,
    };
  },

  // react-dnd 确保 endDrag 和 beginDrag 成对出现
  endDrag(_props, _monitor, component) {
    const node = findDOMNode(component);
    if (node) {
      node.removeEventListener('click', preventDefault);
    }
  },
};

const dndTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    const isInline = props.isInline;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const node = findDOMNode(component);
    const hoverBoundingRect = node && (node as HTMLElement).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect!.bottom - hoverBoundingRect!.top) / 2;
    const hoverMiddleX = (hoverBoundingRect!.right - hoverBoundingRect!.left) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect!.top;
    const hoverClientX = clientOffset.x - hoverBoundingRect!.left;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (isInline) {
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY && hoverClientX < hoverMiddleY) {
        return;
      }
    } else if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (isInline) {
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY && hoverClientX > hoverMiddleX) {
        return;
      }
    } else if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.onMove(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

/* eslint-disable new-cap, no-use-before-define */
export default DropTarget(ITEM, dndTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))(
  DragSource(ITEM, dndSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }))(EditorCardItem as any),
);
/* eslint-enable new-cap, no-use-before-define */
