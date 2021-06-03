import React, { Component } from 'react';
import { Tag } from 'zent';
import PropTypes from 'prop-types';
import cx from 'classnames';
import get from 'lodash/get';

import { ellipsisWord } from './utils';

import { TITLE_VIDEO_STATUS } from '../../constants';

export default class Card extends Component {
  static propTypes = {
    data: PropTypes.object,
    current: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // 被选择的序号
    index: PropTypes.number,
  };

  renderVideoStatus = () => {
    const { data: cardInfo } = this.props;
    const {
      UNKNOW,
      UPLOAD_SUCCESS,
      TRANSCODING_SUCCESS,
      TRANSCODING_FAIL,
      VERIFY_WAIT,
      VERIFY_FAIL,
    } = TITLE_VIDEO_STATUS;
    let tagColor;
    let tag;

    const videoStatus = get(cardInfo, 'media.video.status');
    if ([UNKNOW, UPLOAD_SUCCESS, TRANSCODING_SUCCESS, VERIFY_WAIT].indexOf(videoStatus) > -1) {
      tagColor = '#38f';
      tag = '审核中';
    } else if ([TRANSCODING_FAIL, VERIFY_FAIL].indexOf(videoStatus) > -1) {
      tagColor = '#f60';
      tag = '不通过';
    }

    return (
      <span>
        {[
          UNKNOW,
          UPLOAD_SUCCESS,
          TRANSCODING_SUCCESS,
          TRANSCODING_FAIL,
          VERIFY_WAIT,
          VERIFY_FAIL,
        ].indexOf(videoStatus) > -1 ? (
            <Tag borderColor={tagColor} bgColor={tagColor} className="card__title-icon">
              {tag}
            </Tag>
          ) : null}
      </span>
    );
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
          <span>{ellipsisWord(cardInfo.dragCardTitle, 17)}</span>
          {this.renderVideoStatus()}
        </p>
        <div className={cardFooterclasses}>
          <span>{cardInfo.dragCardIndex}</span>
          <span>{cardInfo.dragCardExtra}</span>
        </div>
      </div>
    );
  }
}
