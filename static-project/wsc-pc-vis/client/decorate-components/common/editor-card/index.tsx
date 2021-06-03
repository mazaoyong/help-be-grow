import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Sortable } from 'zent';
import uuid from '../../utils/uuid';
import EditorCardItem from './item';
import EditorCardAdd from './add';
import bem from '../../utils/bem';
import { IEditorCardProps } from './type';

import './style/index.scss';

const prefix = 'deco-editor-card';
const b = bem(prefix);
const UUID_STR = '__deco-editor-card-uuid__';

class EditorCard extends React.Component<IEditorCardProps> {
  static Item: typeof EditorCardItem;
  static Add: typeof EditorCardAdd;
  static propTypes = {
    list: PropTypes.array.isRequired,
    canDrag: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    canDelete: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    canAdd: PropTypes.bool,
    isInline: PropTypes.bool,
    addText: PropTypes.node,
    onAdd: PropTypes.func,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
    children: PropTypes.node,
    selfDefinedText: PropTypes.bool,
    filterClass: PropTypes.string,
    disable: PropTypes.bool,
    disableText: PropTypes.string,
  };

  static defaultProps = {
    canDrag: true,
    canDelete: false,
    canAdd: false,
    isInline: false,
    filterClass: b(['disable-drag']),
    disable: false,
  };

  setUUID = list => {
    list.forEach(item => {
      if (!item[`${UUID_STR}`]) {
        item[`${UUID_STR}`] = uuid();
      }
    });
  };

  handleChange = list => {
    this.props.onChange(list);
  };

  handleDelete = index => {
    const { list, onChange } = this.props;
    const newList = list.slice();
    newList.splice(index, 1);

    onChange(newList);
  };

  /*
   * zent/Sortable 的 onMove 方法有问题：只有类名全等才能禁止拖拽移动
   * https://github.com/youzan/zent/blob/master/packages/zent/src/sortable/Sortable.js
   * 这里改用 classList 来判断
   **/
  handleMove = (ev): any => {
    return !ev.related.classList.contains(this.props.filterClass);
  };

  render() {
    const {
      className,
      children,
      list,
      canDelete,
      canAdd,
      canDrag,
      isInline,
      addText,
      onAdd,
      selfDefinedText,
      filterClass,
      disable,
      disableText,
    } = this.props;
    const cls = cx(b(), className, {
      [b(['inline'])]: isInline,
    });
    const filterFn = typeof canDrag === 'function' ? canDrag : null;

    // 给列表设置 uuid
    this.setUUID(list);
    const SortWrap: any = Sortable;

    return (
      <SortWrap
        className={cls}
        items={list}
        filterClass={filterClass}
        animation={100}
        scroll={false}
        bubbleScroll={false}
        dragoverBubble={false}
        preventOnFilter={false}
        // forceFallback={true}
        // fallbackOnBody
        // fallbackTolerance={0.5}
        onMove={this.handleMove}
        onChange={this.handleChange}
      >
        {(children as React.ReactNodeArray).map((child, index) => {
          if (child && list[index]) {
            const isDraggable = filterFn ? filterFn(index) : canDrag;
            const isDeletable = typeof canDelete === 'function' ? canDelete(index) : canDelete;
            return (
              <EditorCardItem
                key={list[index][`${UUID_STR}`]}
                filterClass={filterClass}
                canDrag={isDraggable}
                index={index}
                canDelete={isDeletable}
                onDelete={this.handleDelete}
              >
                {child}
              </EditorCardItem>
            );
          }
          return null;
        })}
        {canAdd && (
          <EditorCardAdd
            text={addText}
            onAdd={onAdd}
            selfDefinedText={selfDefinedText}
            filterClass={filterClass}
            disable={disable}
            disableText={disableText}
          />
        )}
      </SortWrap>
    );
  }
}

EditorCard.Item = EditorCardItem;
EditorCard.Add = EditorCardAdd;

export default EditorCard;
