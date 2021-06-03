import React, { Component } from 'react';
import { Icon } from 'zent';
import cx from 'classnames';
import PropTypes from 'prop-types';
import findIndex from 'lodash/findIndex';

import Card from './Card';
import CardWrap from './CardWrap';
import Sortable from '../sortable';

export default class DragSelect extends Component {
  static propTypes = {
    sort: PropTypes.bool, // 是否支持拖拽
    items: PropTypes.array,
    className: PropTypes.string,
    onChange: PropTypes.func,
    current: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onSelect: PropTypes.func,
    onDelete: PropTypes.func,
    placeholder: PropTypes.string,
    removable: PropTypes.bool, // 是否能被删除
  };

  state = {
    dragHoverIndex: -1, // 拖拽时的目标元素的 index
    disappearIndex: -1, // 拖拽时需要小时的 dom index
  };

  sortableEl = null; // 拖拽的 container

  // 拖拽完成事件
  handleChange = list => {
    const { current, items } = this.props;
    const preKey = items[current].dragCardKey;
    const nextIndex = findIndex(list, o => o.dragCardKey === preKey);
    this.props.onChange({
      list,
      index: nextIndex,
    });
  };

  // 卡片选择事件
  handleClickCard = index => {
    this.props.onSelect(index);
  };

  // 删除某选项事件
  handleDelete = (index, card) => {
    this.props.onDelete(index, card);
  };

  // 拖动某项
  handleDragMove = ev => {
    // 拖拽的目标元素
    const relatedEl = ev.related;
    const dragHoverIndex = relatedEl.getAttribute('data-index');
    this.setState({
      dragHoverIndex: +dragHoverIndex,
    });
  };

  // 除 move 事件外的通用事件
  handleDrag = (type, ev) => {
    if (type === 'onEnd') {
      this.setState({
        dragHoverIndex: -1,
        disappearIndex: -1,
      });
    }
    if (type === 'onClone') {
      const relatedEl = ev.item;
      const disappearIndex = relatedEl.getAttribute('data-index');
      this.setState({
        disappearIndex,
      });
    }
  };

  // 点击左右切换逻辑
  handleSlider = direction => {
    const sortableEl = this.sortableEl;
    if (sortableEl) {
      if (direction === 'left') {
        sortableEl.scrollLeft = sortableEl.scrollLeft - 400;
      } else if (direction === 'right') {
        sortableEl.scrollLeft = sortableEl.scrollLeft + 400;
      }
    }
  };

  render() {
    let { className, items, current, sort = true, placeholder, removable = true } = this.props;
    const { dragHoverIndex, disappearIndex } = this.state;
    const hasTitle = !!items.length;

    const classes = cx('drag-select-wrap', className);
    const forwardLeftClass = cx({
      'drag-select__forward': true,
      'drag-select__forward--left': true,
      'drag-select__forward--empty': !hasTitle,
    });
    const forwardRightClass = cx({
      'drag-select__forward': true,
      'drag-select__forward--right': true,
      'drag-select__forward--empty': !hasTitle,
    });
    return (
      <div className={classes}>
        <div
          className={forwardLeftClass}
          onClick={() => {
            this.handleSlider('left');
          }}
        >
          <Icon type="right" className="drag-select__left-forward-icon" />
        </div>
        <div
          className={forwardRightClass}
          onClick={() => {
            this.handleSlider('right');
          }}
        >
          <Icon type="right" className="drag-select__right-forward-icon" />
        </div>
        <div
          className="drag-select__content"
          ref={el => {
            this.sortableEl = el;
          }}
        >
          {hasTitle ? (
            <Sortable
              className="drag-select__drag-wrap"
              items={items}
              handle=".j_cardDragIcon"
              onChange={this.handleChange}
              sort={sort}
              scrollSensitivity={500}
              onMove={this.handleDragMove}
              onEnd={ev => {
                this.handleDrag('onEnd', ev);
              }}
              onClone={ev => {
                this.handleDrag('onClone', ev);
              }}
            >
              {items.map((card, index) => {
                const cardRender = card.dragCardRender || (() => {});
                const classNames = cx({
                  'drag-select__card-wrap--drag-disappear': +index === +disappearIndex,
                  'drag-select__card-wrap--drag-hover': +index === +dragHoverIndex,
                });

                return (
                  <CardWrap
                    className={classNames}
                    sort={sort}
                    key={card.dragCardKey}
                    onClick={() => {
                      this.handleClickCard(index);
                    }}
                    onDelete={() => {
                      this.handleDelete(index, card);
                    }}
                    isActive={+current === index}
                    index={index}
                    removable={removable}
                  >
                    {cardRender() ? (
                      cardRender()
                    ) : (
                      <Card data={card} index={index} current={current} />
                    )}
                  </CardWrap>
                );
              })}
            </Sortable>
          ) : (
            <p className="drag-select__empty-text">{placeholder}</p>
          )}
        </div>
      </div>
    );
  }
}
