import React, { Component } from 'react';
// import cx from 'classnames';
import { PAGE_URL } from '../../constants';

export default class Option extends Component {
  render() {
    const { stateInfo, kdtId } = this.props;
    const eduClass = stateInfo.eduClass || {};
    return (
      <div className="option-item">
        <div className="option-item-left">
          <div className="option-item-left__title" title={stateInfo.title}>
            {stateInfo.title}
          </div>
          {!!stateInfo.tip &&
            <div className="option-item-left__tip">
              {stateInfo.tip}
            </div>
          }
        </div>
        {!!stateInfo.see && (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`${PAGE_URL.EDUCLASS_DETAIL}${eduClass.eduClassId}/${eduClass.eduCourseId}/${kdtId}`}
            className="option-item-right"
          >
            查看
          </a>
        )}
      </div>
    );
  }
}
