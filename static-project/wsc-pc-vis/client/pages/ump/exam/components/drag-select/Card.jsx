import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { ellipsisWord } from './utils';

export default class Card extends Component {
  static propTypes = {
    data: PropTypes.object,
    current: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // 被选择的序号
    index: PropTypes.number,
  };

  render() {
    const { data: cardInfo = {}, index, current = 0 } = this.props;

    const isActive = +index === +current;
    const cardTitleClasses = cx({
      card__title: true,
      'card__title--active': isActive,
    });
    const cardFooterclasses = cx({
      card__footer: true,
      'card__footer--active': isActive,
    });

    return (
      <div className="drag-select__card">
        <p className={cardTitleClasses}>
          <span>{ellipsisWord(cardInfo.dragCardTitle, 19)}</span>
        </p>
        <div className={cardFooterclasses}>
          <span>{cardInfo.dragCardIndex}</span>
          <span>{cardInfo.dragCardExtra}</span>
        </div>
      </div>
    );
  }
}
