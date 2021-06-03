import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

export default class CardWrap extends Component {
  static propTypes = {
    isActive: PropTypes.bool,
    children: PropTypes.object,
    onDelete: PropTypes.func,
    onClick: PropTypes.func,
    className: PropTypes.string,
    index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    sort: PropTypes.bool,
    removable: PropTypes.bool,
  };

  render() {
    const { isActive, className, index, sort, removable } = this.props;

    const cardWrapClasses = cx({
      'drag-select__card-wrap': true,
      'drag-select__card-wrap--active': isActive,
      [className]: true,
    });

    return (
      <div onClick={this.props.onClick} className={cardWrapClasses} data-index={index}>
        {this.props.children}

        {/* 拖动的占位线 */}
        <div className="card-wrap__drag-line" />

        {/* 拖动 icon */}
        {sort ? (
          <div className="card-wrap__drag-icon-wrap j_cardDragIcon">
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
              <div className="card-wrap__drag-icon" key={index} />
            ))}
          </div>
        ) : null}

        {/* 删除 icon */}
        {removable ? (
          <div
            onClick={ev => {
              ev.stopPropagation();
              ev.preventDefault();
              this.props.onDelete();
            }}
            className="card-wrap__close"
          />
        ) : null}
      </div>
    );
  }
}
