import React, { Component } from 'react';
import moneyFormat from 'zan-utils/money/format';
import { COURSE_TYPE } from '../../constants';
import classnames from 'classnames';

export default class CardService extends Component {
  render() {
    const { service, isSelect, onSelect } = this.props;
    const cardWrapClass = classnames({
      'service-card-wrap': true,
      'service-card-wrap__active': isSelect,
    });
    return (
      <div className={cardWrapClass} onClick={onSelect}>
        <div className="service-card">
          <div
            className="service-card__image"
            style={{ backgroundImage: `url(${service.pictureWrapDTO.url})` }}
          />
          <div className="service-card__content">
            <div className="service-card__title">{service.title}</div>
            <div className="service-card__price-and-type">
              <span className="service-card__price">￥{moneyFormat(service.price)}</span>
              <span className="service-card__type">{COURSE_TYPE[service.courseType]}</span>
            </div>
          </div>
        </div>
        {isSelect && <div className="service-card__select-icon" />}
      </div>
    );
  }
}
